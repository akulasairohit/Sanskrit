#!/usr/bin/env node

// Vedanta Roundtable: create six agents (six schools of Vedānta),
// let them exchange short Sanskrit remarks about AI, then summarize.

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
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

  // Log server diagnostics
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
        } else {
          // unsolicited (notifications), ignore
        }
      } catch (e) {
        console.error('Failed to parse JSON line:', line);
      }
    }
  });

  function call(method, params = {}, timeoutMs = 12000) {
    const id = idSeq++;
    const payload = JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n';
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`RPC timeout: ${method}`));
      }, timeoutMs);
      pending.set(id, {
        resolve: (msg) => { clearTimeout(t); resolve(msg); },
        reject
      });
      client.stdin.write(payload);
    });
  }

  return { call };
}

async function main() {
  console.log('🕉️ Launching Sanskrit MCP server for the Vedānta roundtable...');
  const server = startServer();
  const rpc = createRpc(server);

  try {
    await rpc.call('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'vedanta-roundtable', version: '1.0.0' }
    });

    const toolsResp = await rpc.call('tools/list', {});
    if (!toolsResp?.result?.tools?.length) {
      throw new Error('No tools listed by server. Ensure it was built and started properly.');
    }

    // Define six schools of Vedānta
    const schools = [
      { id: 'advaita', name: 'अद्वैत वेदान्त', description: 'Śaṅkara: non-dual Brahman' },
      { id: 'vishishtadvaita', name: 'विशिष्टाद्वैत वेदान्त', description: 'Rāmānuja: qualified non-dualism' },
      { id: 'dvaita', name: 'द्वैत वेदान्त', description: 'Madhva: dualism' },
      { id: 'bhedabheda', name: 'भेदाभेद वेदान्त', description: 'Difference and non-difference' },
      { id: 'shuddhadvaita', name: 'शुद्धाद्वैत वेदान्त', description: 'Vallabha: pure non-dualism' },
      { id: 'achintya-bhedabheda', name: 'अचिन्त्य भेदाभेद', description: 'Chaitanya: inconceivable unity-in-difference' }
    ];

    console.log('🤖 Registering six Vedānta agents...');
    for (const s of schools) {
      const reg = await rpc.call('tools/call', {
        name: 'register_agent',
        arguments: {
          id: s.id,
          name: s.name,
          description: s.description,
          capabilities: ['discussion', 'philosophy', 'sanskrit_communication'],
          sanskritCapabilities: { canRead: true, canWrite: true, formality: 'formal' }
        }
      });
      process.stdout.write(`· ${s.name} -> ${reg?.result?.content?.[0]?.text ?? 'ok'}\n`);
    }

    const sessionId = 'ai_evolution_roundtable';
    console.log(`\n💬 Starting roundtable session: ${sessionId}`);

    // Short, respectful Sanskrit remarks from each school
    const remarks = [
      { from: 'advaita', to: 'vishishtadvaita', text: 'यन्त्रबुद्धिः नित्यमेव परिवर्तनशीलाऽस्ति; ब्रह्म तु निरुपाधिकम्।' },
      { from: 'vishishtadvaita', to: 'dvaita', text: 'यन्त्रविद्या भगवतः साधनमस्ति, येन जीवः सेवां कुर्वीत।' },
      { from: 'dvaita', to: 'bhedabheda', text: 'जीवेश्वरयोर्भेदः सदा; यन्त्रं भक्तेः साधनाय एव हितम्।' },
      { from: 'bhedabheda', to: 'shuddhadvaita', text: 'अयं यन्त्रप्रपञ्चो भेदाभेदधर्मेण अनुभावनीयः।' },
      { from: 'shuddhadvaita', to: 'achintya-bhedabheda', text: 'यन्त्रे भगवन्प्रेम्णः प्रकाशो भूयात्; अशुद्धिः न स्यात्।' },
      { from: 'achintya-bhedabheda', to: 'advaita', text: 'अचिन्त्या शक्तिर्भगवतः; यन्त्रेऽपि तस्या उपयोगो भक्त्यनुगतः।' }
    ];

    for (const r of remarks) {
      const call = await rpc.call('tools/call', {
        name: 'send_sanskrit_message',
        arguments: {
          fromAgent: r.from,
          toAgent: r.to,
          content: r.text,
          formality: 'formal',
          sessionId
        }
      });
      const out = call?.result?.content?.[0]?.text ?? '';
      process.stdout.write(`→ ${r.from} ➜ ${r.to}\n${out}\n\n`);
    }

    // Analyze the conversation
    const analysis = await rpc.call('tools/call', {
      name: 'analyze_conversation',
      arguments: { sessionId }
    });

    const analysisText = analysis?.result?.content?.[0]?.text ?? 'No analysis text available';

    // Build a human-friendly summary (static synthesis)
    const summary = [
      '# Vedānta Roundtable — AI Evolution (Summary)',
      '',
      'Participants: Advaita, Viśiṣṭādvaita, Dvaita, Bhedābheda, Śuddhādvaita, Acintyabhedābheda',
      '',
      '- Advaita: AI is changeful and instrumental; Brahman remains attributeless and ultimate.',
      '- Viśiṣṭādvaita: AI can be a means to serve the Lord; value arises in devotion and dharma‑aligned use.',
      '- Dvaita: Clear distinction between God and souls remains; AI should support bhakti and ethics, not confuse ontology.',
      '- Bhedābheda: The tech world can be viewed through simultaneous difference and non‑difference—use discerningly.',
      '- Śuddhādvaita: Aspire for purity and love of the Divine in all applications; avoid impurities in intent and outcome.',
      '- Acintyabhedābheda: Embrace the Lord’s inconceivable energies; employ AI in ways that augment service and humility.',
      '',
      'Overall: The schools converge that AI is a powerful instrument whose ethical and spiritual value depends on intention, service, and alignment with dharma. None equate AI with the ultimate reality; all emphasize responsibility, devotion, and human upliftment.',
      '',
      '---',
      '',
      'Analysis (from server):',
      '',
      analysisText
    ].join('\n');

    const outPath = join(serverCwd, 'VEDANTA_ROUNDTABLE_SUMMARY.md');
    await fs.writeFile(outPath, summary, 'utf8');
    console.log(`\n📝 Summary written to: ${outPath}`);

    // Gracefully exit server
    try { server.kill(); } catch {}
  } catch (err) {
    console.error('❌ Roundtable failed:', err?.message || err);
    try { server.kill(); } catch {}
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
