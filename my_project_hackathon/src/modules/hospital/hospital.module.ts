import { Module } from '@nitrostack/core';
import { HospitalDataService } from './hospital.data.service.js';
import { HospitalTools } from './hospital.tools.js';
import { SharedModule } from '../shared/shared.module.js';

@Module({
  name: 'hospital',
  description: 'Hospital Agent — case entry and CGHS-based cost estimates',
  imports: [SharedModule],
  controllers: [HospitalTools],
  providers: [HospitalDataService],
  // Exported so the Orchestrator module can inject HospitalDataService directly
  exports: [HospitalDataService]
})
export class HospitalModule {}
