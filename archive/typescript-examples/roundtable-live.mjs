#!/usr/bin/env node

// Live roundtable simulator: streams a multi-agent Sanskrit discussion about AI.
// No external deps; uses MCP server via STDIO.

import { spawn } from 'child_process';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serverCwd = join(__dirname, '..');

function startServer() {
  const child = spawn('node', ['dist/index.js'], {
    cwd: serverCwd,
    stdio: ['pipe', 'pipe', 'pipe']
  });
  child.stderr.on('data', d => process.stderr.write(d));
  return child;
}

function createRpc(client) {
  let idSeq = 1;
  const pending = new Map();
  let buffer = '';

  client.stdout.on('data', (chunk) => {
    buffer += chunk.toString();
    let idx;
    while ((idx = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 1);
      if (!line) continue;
      try {
        const msg = JSON.parse(line);
        if (msg.id && pending.has(msg.id)) {
          const { resolve } = pending.get(msg.id);
          pending.delete(msg.id);
          resolve(msg);
        }
      } catch (e) {
        // ignore
      }
    }
  });

  function call(method, params = {}, timeoutMs = 15000) {
    const id = idSeq++;
    const payload = JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n';
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`RPC timeout: ${method}`));
      }, timeoutMs);
      pending.set(id, { resolve });
      client.stdin.write(payload);
    });
  }

  return { call };
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function ensureAgents(rpc) {
  const schools = [
    { id: 'advaita', name: 'अद्वैत वेदान्त', description: 'Śaṅkara: non-dual Brahman' },
    { id: 'vishishtadvaita', name: 'विशिष्टाद्वैत वेदान्त', description: 'Rāmānuja: qualified non-dualism' },
    { id: 'dvaita', name: 'द्वैत वेदान्त', description: 'Madhva: dualism' },
    { id: 'bhedabheda', name: 'भेदाभेद वेदान्त', description: 'Difference and non-difference' },
    { id: 'shuddhadvaita', name: 'शुद्धाद्वैत वेदान्त', description: 'Vallabha: pure non-dualism' },
    { id: 'achintya-bhedabheda', name: 'अचिन्त्य भेदाभेद', description: 'Chaitanya: inconceivable unity-in-difference' }
  ];
  for (const s of schools) {
    await rpc.call('tools/call', {
      name: 'register_agent',
      arguments: {
        id: s.id, name: s.name, description: s.description,
        capabilities: ['discussion','philosophy','sanskrit_communication'],
        sanskritCapabilities: { canRead: true, canWrite: true, formality: 'formal' }
      }
    });
  }
  return schools.map(s => s.id);
}

async function main() {
  const sessionId = 'ai_live_roundtable_' + Date.now();
  console.log(`🕒 Live roundtable session: ${sessionId}`);

  const server = startServer();
  const rpc = createRpc(server);

  process.on('SIGINT', () => { try { server.kill(); } catch {}; process.exit(0); });

  await rpc.call('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'roundtable-live', version: '1.0.0' }
  });

  await ensureAgents(rpc);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const scripted = [
    { from: 'advaita', to: 'vishishtadvaita', text: 'यन्त्रबुद्धिः परिवर्तनशीलाऽस्ति; ब्रह्म तु निरुपाधिकम्।' },
    { from: 'vishishtadvaita', to: 'dvaita', text: 'यन्त्रविद्या भगवतः साधनं, धर्मे निबद्धा भवतु।' },
    { from: 'dvaita', to: 'bhedabheda', text: 'जीवेश्वरयोर्भेदे सत्ये, यन्त्रं भक्तेः सहायः।' }
  ];

  console.log('\n▶ Streaming opening remarks...');
  for (const m of scripted) {
    process.stdout.write(`\n${m.from} → ${m.to} ... `);
    await delay(800);
    const res = await rpc.call('tools/call', {
      name: 'send_sanskrit_message',
      arguments: { fromAgent: m.from, toAgent: m.to, content: m.text, formality: 'formal', sessionId }
    });
    const text = res?.result?.content?.[0]?.text ?? '';
    console.log('\n' + text);
    await delay(600);
  }

  console.log('\n💬 You can add a remark (format: fromId toId Sanskrit-text). Example: advaita dvaita अहं पश्यामि');
  console.log('Type "analyze" to print session analysis, or "exit" to quit.');

  rl.on('line', async (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (trimmed === 'exit') {
      rl.close(); try { server.kill(); } catch {}; process.exit(0);
    }
    if (trimmed === 'analyze') {
      const analysis = await rpc.call('tools/call', { name: 'analyze_conversation', arguments: { sessionId } });
      console.log('\n' + (analysis?.result?.content?.[0]?.text ?? 'No analysis text')); return;
    }
    const parts = trimmed.split(' ');
    if (parts.length < 3) {
      console.log('Format: fromId toId Sanskrit-text'); return;
    }
    const [fromAgent, toAgent, ...rest] = parts;
    const content = rest.join(' ');
    try {
      const res = await rpc.call('tools/call', {
        name: 'send_sanskrit_message',
        arguments: { fromAgent, toAgent, content, formality: 'formal', sessionId }
      });
      const text = res?.result?.content?.[0]?.text ?? '';
      console.log('\n' + text);
    } catch (err) {
      console.log('Error:', err.message || String(err));
    }
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
