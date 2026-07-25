import { McpApp, Module, ConfigModule } from '@nitrostack/core';
import { HospitalModule } from './modules/hospital/hospital.module.js';
import { InsurerModule } from './modules/insurer/insurer.module.js';
import { LenderModule } from './modules/lender/lender.module.js';
import { ObjectivityModule } from './modules/objectivity/objectivity.module.js';
import { OrchestratorModule } from './modules/orchestrator/orchestrator.module.js';
import { SharedModule } from './modules/shared/shared.module.js';
import { SystemHealthCheck } from './health/system.health.js';

/**
 * Root Application Module
 *
 * Bootstraps the Care Mediator MCP server. The Orchestrator module transitively
 * imports Objectivity, which transitively imports Hospital + Insurer — but we
 * also import Hospital/Insurer/Lender here directly so their own tools
 * (get_treatment_estimate, get_claim_status, get_loan_offers, etc.) are exposed
 * to MCP clients too, not just used internally by the orchestrator.
 */
@McpApp({
  module: AppModule,
  server: {
    name: 'care-mediator-server',
    version: '1.0.0'
  },
  logging: {
    level: 'info'
  }
})
@Module({
  name: 'app',
  description: 'Root application module',
  imports: [
    ConfigModule.forRoot(),
    SharedModule,
    HospitalModule,
    InsurerModule,
    LenderModule,
    ObjectivityModule,
    OrchestratorModule
  ],
  providers: [
    // Health Checks
    SystemHealthCheck,
  ]
})
export class AppModule {}

