import { ToolDecorator as Tool, Injectable, ExecutionContext, z } from '@nitrostack/core';
import { ObjectivityTools } from '../objectivity/objectivity.tools.js';
import { LenderDataService } from '../lender/lender.data.service.js';

/**
 * Orchestrator — reconciles every agent into the ONE shared case record.
 * This is the tool the frontend's three portals ultimately read from.
 */
@Injectable({ deps: [ObjectivityTools, LenderDataService] })
export class OrchestratorTools {
  constructor(
    private objectivity: ObjectivityTools,
    private lenderData: LenderDataService
  ) {}

  @Tool({
    name: 'reconcile_case',
    description:
      'Build the single shared case record: objective report + coverage gap + (if needed) loan options',
    inputSchema: z.object({
      patientId: z.string(),
      procedureCode: z.string(),
      city: z.string(),
      hospitalBilledAmount: z.number()
    })
  })
  async reconcileCase(
    input: { patientId: string; procedureCode: string; city: string; hospitalBilledAmount: number },
    ctx: ExecutionContext
  ) {
    ctx.logger.info('Reconciling case', input);

    const report = await this.objectivity.buildObjectiveCaseReport(input, ctx);

    const approvedAmount = report.insurerClaim?.approvedAmount ?? 0;
    const gap = Math.max(0, input.hospitalBilledAmount - approvedAmount);

    let financingOptions: unknown = null;
    if (gap > 0) {
      const offers = this.lenderData.getAllOffers();
      financingOptions = [...offers]
        .sort((a, b) => a.effectiveAnnualRate - b.effectiveAnnualRate)
        .slice(0, 3);
    }

    // This is the single shape all three portals (hospital / patient / insurer) read from.
    return {
      patientId: input.patientId,
      procedureCode: input.procedureCode,
      city: input.city,
      isConsistent: report.isConsistent,
      inconsistencies: report.inconsistencies,
      hospitalBilledAmount: input.hospitalBilledAmount,
      cghsBenchmark: report.cghsBenchmark,
      insurerClaim: report.insurerClaim,
      coverageGap: gap,
      financingNeeded: gap > 0,
      financingOptions
    };
  }
}
