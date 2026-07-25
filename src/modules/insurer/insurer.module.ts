import { Module } from '@nitrostack/core';
import { InsurerDataService } from './insurer.data.service.js';
import { InsurerTools } from './insurer.tools.js';

@Module({
  name: 'insurer',
  description: 'Insurer Agent — cashless status, claim decisions, network status',
  controllers: [InsurerTools],
  providers: [InsurerDataService],
  exports: [InsurerDataService]
})
export class InsurerModule {}
