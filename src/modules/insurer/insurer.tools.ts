import { ToolDecorator as Tool, Injectable, ExecutionContext, z } from '@nitrostack/core';
import { InsurerDataService } from './insurer.data.service.js';

@Injectable({ deps: [InsurerDataService] })
export class InsurerTools {
  constructor(private insurerData: InsurerDataService) {}

  @Tool({
    name: 'get_claim_status',
    description: 'Get cashless status and claim decision for a patient',
    inputSchema: z.object({
      patientId: z.string().describe('Patient identifier, e.g. PAT-01')
    })
  })
  async getClaimStatus(input: { patientId: string }, ctx: ExecutionContext) {
    ctx.logger.info('Fetching claim status', input);
    const claim = this.insurerData.getClaimByPatient(input.patientId);

    if (!claim) {
      return { found: false, message: `No claim found for patient ${input.patientId}` };
    }

    return {
      found: true,
      claimId: claim.claimId,
      cashlessStatus: claim.cashlessStatus,
      approvedAmount: claim.approvedAmount,
      denialReason: claim.denialReason ?? null,
      isNetworkHospital: claim.isNetworkHospital
    };
  }

  @Tool({
    name: 'check_network_hospital',
    description: 'Check whether a hospital is in the insurer network',
    inputSchema: z.object({
      hospitalId: z.string().describe('Hospital identifier, e.g. HOSP-01')
    })
  })
  async checkNetworkHospital(input: { hospitalId: string }, ctx: ExecutionContext) {
    ctx.logger.info('Checking network hospital status', input);
    return {
      hospitalId: input.hospitalId,
      isNetworkHospital: this.insurerData.isNetworkHospital(input.hospitalId)
    };
  }
}
