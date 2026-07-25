import { ToolDecorator as Tool, Injectable, ExecutionContext, z } from '@nitrostack/core';
import { InsurerDataService } from './insurer.data.service.js';
import { CaseStoreService } from '../shared/case-store.service.js';

/**
 * Insurer Agent Tools
 *
 * - get_claim_status        : lookup by patientId in the static mock-claims.json
 *                             (kept for demo/backwards-compat)
 * - check_network_hospital  : static network check
 * - get_live_case_status    : fetch a LIVE case from the backend by caseId
 * - submit_decision         : POST approve / partial / deny / more-info to the backend
 */
@Injectable({ deps: [InsurerDataService, CaseStoreService] })
export class InsurerTools {
  constructor(
    private insurerData: InsurerDataService,
    private caseStore: CaseStoreService,
  ) {}

  // ─── Static mock-based tools (demo data, no backend required) ────────────

  @Tool({
    name: 'get_claim_status',
    description:
      'Get cashless status and claim decision for a patient from the reference dataset. ' +
      'Use get_live_case_status instead when you have a real caseId from a submitted case.',
    inputSchema: z.object({
      patientId: z.string().describe('Patient identifier, e.g. PAT-01'),
    }),
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
      isNetworkHospital: claim.isNetworkHospital,
    };
  }

  @Tool({
    name: 'check_network_hospital',
    description: 'Check whether a hospital is in the insurer network',
    inputSchema: z.object({
      hospitalId: z.string().describe('Hospital identifier, e.g. HOSP-01'),
    }),
  })
  async checkNetworkHospital(input: { hospitalId: string }, ctx: ExecutionContext) {
    ctx.logger.info('Checking network hospital status', input);
    return {
      hospitalId: input.hospitalId,
      isNetworkHospital: this.insurerData.isNetworkHospital(input.hospitalId),
    };
  }

  // ─── Live backend tools ───────────────────────────────────────────────────

  @Tool({
    name: 'get_live_case_status',
    description:
      'Fetch the full live case record from the Care Mediator backend by caseId. ' +
      'Returns claim status, objectivity report, coverage explainer, loan offers, and timeline. ' +
      'Use this whenever you have a real caseId (e.g. from the hospital portal or reconcile_case_by_id).',
    inputSchema: z.object({
      caseId: z.string().describe('Care Mediator case ID, e.g. clean-case or a CM-xxxxx ID'),
    }),
  })
  async getLiveCaseStatus(input: { caseId: string }, ctx: ExecutionContext) {
    ctx.logger.info('Fetching live case from backend', input);
    const caseData = await this.caseStore.getCase(input.caseId);

    return {
      caseId: caseData.caseId,
      patientName: caseData.patientName,
      hospitalName: caseData.hospitalName,
      procedure: caseData.procedure,
      submittedAt: caseData.submittedAt,
      claimStatus: caseData.claimStatus,
      denialReason: caseData.denialReason ?? null,
      hospitalEstimate: caseData.hospitalEstimate,
      insurerApproved: caseData.insurerApproved,
      gap: caseData.gap,
      coverageExplainer: caseData.coverageExplainer,
      objectivityReport: caseData.objectivityReport,
      timelineLength: caseData.timeline.length,
      latestTimelineEvent: caseData.timeline.at(-1) ?? null,
    };
  }

  @Tool({
    name: 'submit_decision',
    description:
      'Submit an insurer decision (approve / partial / deny / more-info) against a live case. ' +
      'The decision is persisted on the backend, appended to the shared timeline, and immediately ' +
      'visible to the patient and hospital portals. ' +
      'Approval sets insurerApproved = hospitalEstimate and gap = 0. ' +
      'Partial approval requires approvedAmount. ' +
      'Deny and more-info require a note.',
    inputSchema: z.object({
      caseId: z.string().describe('Care Mediator case ID to act on'),
      action: z
        .enum(['approve', 'partial', 'deny', 'more-info'])
        .describe('Decision action to take'),
      note: z
        .string()
        .optional()
        .describe('Required for deny and more-info. Optional context for partial.'),
      approvedAmount: z
        .number()
        .nonnegative()
        .optional()
        .describe('Required when action is partial — amount the insurer will cover'),
    }),
  })
  async submitDecision(
    input: { caseId: string; action: string; note?: string; approvedAmount?: number },
    ctx: ExecutionContext,
  ) {
    ctx.logger.info('Submitting insurer decision', input);

    if (input.action === 'deny' || input.action === 'more-info') {
      if (!input.note?.trim()) {
        throw new Error(`action "${input.action}" requires a non-empty note`);
      }
    }
    if (input.action === 'partial' && (input.approvedAmount === undefined || input.approvedAmount === null)) {
      throw new Error('action "partial" requires approvedAmount');
    }

    const updated = await this.caseStore.submitDecision(input.caseId, {
      action: input.action as 'approve' | 'partial' | 'deny' | 'more-info',
      note: input.note,
      approvedAmount: input.approvedAmount,
    });

    return {
      success: true,
      caseId: updated.caseId,
      newStatus: updated.claimStatus,
      insurerApproved: updated.insurerApproved,
      gap: updated.gap,
      denialReason: updated.denialReason ?? null,
      latestTimelineEvent: updated.timeline.at(-1),
    };
  }
}
