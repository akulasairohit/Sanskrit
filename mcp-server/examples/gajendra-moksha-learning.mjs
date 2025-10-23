#!/usr/bin/env node

/**
 * Gajendra Moksha Stotram - Agent Learning and Explanation
 * 
 * This demonstrates agents learning sacred texts and providing
 * line-by-line explanations with philosophical context.
 * 
 * The Gajendra Moksha Stotram is the prayer of the elephant-king Gajendra
 * when caught by a crocodile, representing the soul's cry for liberation.
 */

import { spawn } from 'child_process';
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
        console.error('Failed to parse JSON line:', line);
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
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║           GAJENDRA MOKSHA STOTRAM LEARNING SESSION           ║');
  console.log('║                                                               ║');
  console.log('║  Agents learn and explain this sacred hymn line by line     ║');
  console.log('║  From Śrīmad Bhāgavatam 8.3 - The Prayer of Gajendra        ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  const server = startServer();
  const rpc = createRpc(server);

  try {
    // Initialize
    await rpc.call('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'gajendra-moksha-learning', version: '1.0.0' }
    });

    console.log('✅ MCP Server initialized\n');

    // Register a teacher agent
    await rpc.call('tools/call', {
      name: 'register_agent',
      arguments: {
        id: 'bhakti_teacher',
        name: 'भक्ति आचार्य',
        description: 'Bhakti teacher specializing in sacred stotras and devotional texts',
        capabilities: ['vedic_texts', 'bhakti', 'sanskrit_communication', 'teaching'],
        sanskritCapabilities: {
          canRead: true,
          canWrite: true,
          formality: 'formal',
          comprehensionLevel: 'scholarly'
        }
      }
    });

    console.log('📝 Teacher agent registered\n');
    console.log('═'.repeat(65));
    console.log('CONTEXT: The Gajendra Moksha Story');
    console.log('═'.repeat(65));
    console.log(`
Gajendra, the king of elephants, was enjoying in a lake with his herd
when a crocodile caught his leg. After struggling for a thousand years,
exhausted and on the verge of death, Gajendra surrendered to the Lord
with this prayer. Lord Viṣṇu immediately appeared and liberated him.

The prayer represents the soul's ultimate surrender when all material
strength fails, symbolizing the path of śaraṇāgati (complete surrender).
`);

    console.log('\n═'.repeat(65));
    console.log('LEARNING SESSION: Line-by-Line Explanation');
    console.log('═'.repeat(65));

    // Query each verse and explain
    const verses = [
      { query: "gajendra om namo bhagavate", topic: "Opening Invocation" },
      { query: "gajendra yasmad api asakrt", topic: "Source of Creation" },
      { query: "gajendra dharma kama artha vimukti", topic: "Four Goals of Life" },
      { query: "gajendra ekantino yasya", topic: "Pure Devotion" },
      { query: "gajendra aksharam brahma param", topic: "Philosophical Attributes" },
      { query: "gajendra maya samsrti chakra", topic: "Māyā and Saṁsāra" },
      { query: "gajendra ajam avyayam purusham", topic: "Path to Liberation" },
      { query: "gajendra namo namas akhila karanaya", topic: "Final Surrender" }
    ];

    for (let i = 0; i < verses.length; i++) {
      const verse = verses[i];
      
      console.log(`\n\n📖 VERSE ${i + 1}: ${verse.topic}`);
      console.log('─'.repeat(65));

      // Query the Vedic corpus for this verse
      const queryResp = await rpc.call('tools/call', {
        name: 'query_vedic_knowledge',
        arguments: {
          query: verse.query
        }
      });

      const knowledge = queryResp?.result?.content?.[0]?.text || '';
      
      // Parse the knowledge to extract the verse details
      if (knowledge && knowledge.includes('Sanskrit:')) {
        const lines = knowledge.split('\n');
        let sanskrit = '';
        let translation = '';
        let context = '';
        let commentary = '';

        for (let line of lines) {
          if (line.includes('Sanskrit:')) {
            sanskrit = line.replace(/.*Sanskrit:\s*/, '').trim();
          } else if (line.includes('Context:')) {
            context = line.replace(/.*Context:\s*/, '').trim();
          } else if (line.match(/^".*"$/)) {
            translation = line.replace(/"/g, '').trim();
          } else if (line.includes('•') && line.includes(':')) {
            commentary = line.replace(/^\s*•\s*/, '').trim();
          }
        }

        // Display with formatting
        console.log('\n🕉️  \x1b[36mSanskrit:\x1b[0m');
        console.log(`    ${sanskrit}`);
        
        console.log('\n🌍 \x1b[32mTranslation:\x1b[0m');
        console.log(`    ${translation}`);
        
        if (context) {
          console.log('\n💡 \x1b[33mContext:\x1b[0m');
          console.log(`    ${context}`);
        }
        
        if (commentary) {
          console.log('\n📚 \x1b[35mCommentary:\x1b[0m');
          console.log(`    ${commentary}`);
        }

        // Generate Sanskrit explanation from teacher
        const sanskritExplanation = generateSanskritExplanation(i + 1, verse.topic);
        
        console.log('\n🎓 \x1b[36mभक्ति आचार्य explains:\x1b[0m');
        console.log(`    ${sanskritExplanation.sanskrit}`);
        console.log(`    \x1b[90m(${sanskritExplanation.english})\x1b[0m`);

        // Send message through MCP to log it
        await rpc.call('tools/call', {
          name: 'send_sanskrit_message',
          arguments: {
            fromAgent: 'bhakti_teacher',
            toAgent: 'bhakti_teacher',
            content: sanskritExplanation.sanskrit,
            formality: 'formal',
            sessionId: 'gajendra_learning'
          }
        });

      } else {
        console.log('\n⚠️  Verse details not found in corpus');
      }

      // Brief pause for readability
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Final summary
    console.log('\n\n═'.repeat(65));
    console.log('PHILOSOPHICAL SYNTHESIS');
    console.log('═'.repeat(65));
    console.log(`
The Gajendra Moksha Stotram progresses through levels of understanding:

1️⃣  Opening - Recognizes the Lord as the source of consciousness
2️⃣  Creation - Acknowledges His role as creator and sustainer  
3️⃣  Goals - Understands He fulfills all objectives (puruṣārthas)
4️⃣  Devotion - Pure bhakti seeks nothing but the Lord Himself
5️⃣  Philosophy - Vedantic attributes converge in personal God
6️⃣  Māyā - His transcendence despite creating the world
7️⃣  Liberation - Knowledge of Him alone grants mokṣa
8️⃣  Surrender - Complete śaraṇāgati as the ultimate refuge

KEY TEACHINGS:
✓ Śaraṇāgati (surrender) when all strength fails
✓ The Lord as both immanent (in creation) and transcendent
✓ Bhakti as the path accessible in extremis
✓ Unity of jñāna (knowledge) and bhakti (devotion)
✓ The Lord beyond causation yet cause of all
`);

    // Get conversation analysis
    console.log('\n═'.repeat(65));
    console.log('LEARNING SESSION STATISTICS');
    console.log('═'.repeat(65));

    const analysis = await rpc.call('tools/call', {
      name: 'analyze_conversation',
      arguments: { sessionId: 'gajendra_learning' }
    });

    const analysisText = analysis?.result?.content?.[0]?.text || '';
    console.log(`\n${analysisText}`);

    console.log('\n\n✨ SPIRITUAL SIGNIFICANCE:');
    console.log(`
The story of Gajendra represents every soul's journey:
- The elephant = Individual soul (jīva)
- The lake = Material enjoyment (saṁsāra)
- The crocodile = Death and time (kāla)
- The struggle = Life's futile material efforts
- The prayer = Surrender to the Divine (prapatti)
- The liberation = God's immediate grace (mokṣa)

When all material strength exhausted, the soul's cry reaches the Lord,
who appears instantly. This demonstrates that divine grace surpasses
karma, transcending even death itself.

"तमेव शरणं गच्छ" - Take refuge in Him alone.
`);

    // Cleanup
    try { server.kill(); } catch {}
    
  } catch (err) {
    console.error('\n❌ Error:', err?.message || err);
    try { server.kill(); } catch {}
    process.exit(1);
  }
}

/**
 * Generate Sanskrit explanation for each verse
 */
function generateSanskritExplanation(verseNum, topic) {
  const explanations = [
    {
      sanskrit: "अयं प्रथमः श्लोकः परमात्मनः प्रति नमस्कारः। सर्वं चिदात्मकम् ब्रह्मतत्त्वं यस्मात् प्रकाशते। भगवान् आदिबीजम्, सर्वस्य कारणम्।",
      english: "This first verse is salutation to the Supreme Self. All consciousness-natured Brahman principle shines from Him. The Lord is the primordial seed, cause of all."
    },
    {
      sanskrit: "ब्रह्मादयः सृष्टिकर्तारः अपि तस्मात् एव शक्तिं प्राप्नुवन्ति। त्रिगुणात्मिका प्रकृतिः तस्य नियन्त्रणे वर्तते।",
      english: "Even Brahmā and other creators receive power from Him alone. The three-fold nature (prakṛti) operates under His control."
    },
    {
      sanskrit: "धर्मार्थकाममोक्षाणां चतुर्णां पुरुषार्थानां दाता सः एव। यः तं भजति सः स्वाभिलषितं फलं प्राप्नोति।",
      english: "He alone is the giver of the four goals - dharma, artha, kāma, mokṣa. Whoever worships Him attains their desired fruit."
    },
    {
      sanskrit: "एकान्तिभक्ताः तु न किमपि याचन्ते। ते केवलं भगवदानन्दसागरे निमग्नाः सन्ति। शुद्धा भक्तिः फलकाङ्क्षारहिता।",
      english: "But exclusive devotees ask for nothing. They are merely immersed in the ocean of divine bliss. Pure devotion is devoid of desire for results."
    },
    {
      sanskrit: "अत्र सर्वे वेदान्तशब्दाः समाहिताः। अक्षरं ब्रह्म, चिदानन्दस्वरूपम्, अद्वयम्। सर्वे शब्दाः एकं तत्त्वं निर्दिशन्ति।",
      english: "Here all Vedantic terms are gathered. Imperishable Brahman, consciousness-bliss nature, non-dual. All words indicate one principle."
    },
    {
      sanskrit: "मायया सृष्टिस्थितिलयान् करोति, परन्तु स्वयं निर्लिप्तः। अन्तर्यामिरूपेण सर्वभूतेषु प्रविष्टः अस्ति।",
      english: "Through Māyā He creates, maintains, destroys, yet remains unattached. As the inner controller He has entered all beings."
    },
    {
      sanskrit: "तमेव विदित्वा मृत्युं तरति। ज्ञानमार्गः एकः एव मुक्तिहेतुः। नान्यः पन्था विद्यते।",
      english: "Knowing Him alone one transcends death. The path of knowledge is the only cause of liberation. No other path exists."
    },
    {
      sanskrit: "अयं चरमः श्लोकः सम्पूर्णशरणागतिः। सर्वकारणाय नमः। परमधाम तत् एव। एतत् गजेन्द्रस्य पूर्णसमर्पणम्।",
      english: "This final verse is complete surrender. Salutations to the cause of all. He alone is the supreme refuge. This is Gajendra's total self-offering."
    }
  ];

  return explanations[verseNum - 1];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default main;
