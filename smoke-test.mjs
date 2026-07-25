import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function main() {
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['dist/index.js']
  });

  const client = new Client({ name: 'smoke-test', version: '1.0.0' });
  await client.connect(transport);

  const tools = await client.listTools();
  console.log('--- TOOLS REGISTERED ---');
  console.log(tools.tools.map((t) => t.name).join(', '));

  console.log('\n--- get_treatment_estimate ---');
  const estimate = await client.callTool({
    name: 'get_treatment_estimate',
    arguments: { procedureCode: 'CGHS-ORTH-014', city: 'Chennai' }
  });
  console.log(JSON.stringify(estimate.content, null, 2));

  console.log('\n--- reconcile_case (Gotcha case: denied claim) ---');
  const reconcileDenied = await client.callTool({
    name: 'reconcile_case',
    arguments: {
      patientId: 'PAT-02',
      procedureCode: 'CGHS-ORTH-014',
      city: 'Chennai',
      hospitalBilledAmount: 130000
    }
  });
  console.log(JSON.stringify(reconcileDenied.content, null, 2));

  console.log('\n--- reconcile_case (Clean case: approved claim) ---');
  const reconcileClean = await client.callTool({
    name: 'reconcile_case',
    arguments: {
      patientId: 'PAT-01',
      procedureCode: 'CGHS-CARD-001',
      city: 'Chennai',
      hospitalBilledAmount: 65000
    }
  });
  console.log(JSON.stringify(reconcileClean.content, null, 2));

  await client.close();
  process.exit(0);
}

main().catch((err) => {
  console.error('SMOKE TEST FAILED:', err);
  process.exit(1);
});
