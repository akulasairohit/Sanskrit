#!/usr/bin/env node

/**
 * Two Vedanta Agents Debating Truth
 * 
 * This example creates two agents representing different schools of Vedanta:
 * 1. Advaita Agent (Non-dualism) - Representing Shankaracharya's view
 * 2. Dvaita Agent (Dualism) - Representing Madhvacharya's view
 * 
 * They debate the nature of ultimate truth/reality using the MCP server.
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serverCwd = join(__dirname, '..');

/**
 * Start the MCP server
 */
function startServer() {
  const child = spawn('node', ['dist/index.js'], {
    cwd: serverCwd,
    stdio: ['pipe', 'pipe', 'pipe']
  });

  child.stderr.on('data', d => process.stderr.write(d));
  return child;
}

/**
 * Create JSON-RPC interface for communicating with server
 */
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

/**
 * Advaita perspective on truth
 */
const ADVAITA_TEACHINGS = {
  name: 'अद्वैत वेदान्त आचार्य',
  nameEnglish: 'Advaita Vedanta Acharya',
  founder: 'आदि शंकराचार्य (Adi Shankaracharya)',
  
  // Core principles
  principles: {
    ultimateTruth: 'ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः',
    englishTranslation: 'Brahman alone is real, the world is illusory, the individual soul is not different from Brahman',
    mahavakya: 'अहं ब्रह्मास्मि (I am Brahman)',
    realityNature: 'Non-dual, attributeless consciousness'
  },

  // Key philosophical positions
  positions: [
    {
      topic: 'परमार्थ सत्य (Ultimate Truth)',
      sanskrit: 'एकमेवाद्वितीयं ब्रह्म परमार्थसत्यम्। निर्गुणं निराकारं निर्विकल्पकं चैतन्यमात्रम्।',
      english: 'Brahman alone is the ultimate truth - one without a second. It is attributeless, formless, and pure consciousness beyond all modifications.',
      references: [
        {
          text: 'छान्दोग्योपनिषद् (Chandogya Upanishad)',
          verse: '६.२.१',
          sanskrit: 'सदेव सोम्य इदमग्र आसीत् एकमेवाद्वितीयम्',
          english: 'In the beginning, my dear, this was Being alone - one without a second'
        },
        {
          text: 'बृहदारण्यकोपनिषद् (Brihadaranyaka Upanishad)',
          verse: '३.८.८',
          sanskrit: 'अदृष्टमद्रष्टा, अश्रुतं श्रोता, अमतं मन्ता, अविज्ञातं विज्ञाता',
          english: 'Unseen seer, unheard hearer, unthought thinker, unknown knower'
        }
      ]
    },
    {
      topic: 'जगत्स्वरूपम् (Nature of World)',
      sanskrit: 'जगत् मिथ्या, मायाकृतम्। स्वप्नवत् प्रतीयते, व्यावहारिकसत्यम् न पारमार्थिकम्।',
      english: 'The world is illusory, created by Maya. It appears like a dream - pragmatically real but not ultimately real.',
      references: [
        {
          text: 'माण्डूक्योपनिषद् (Mandukya Upanishad)',
          verse: 'कारिका २.३१',
          sanskrit: 'अजातिवादोऽयं नैव कश्चित् संभवति',
          english: 'According to the doctrine of non-origination, nothing ever comes into being'
        },
        {
          text: 'शंकराचार्य - विवेकचूडामणि',
          verse: 'श्लोक २०',
          sanskrit: 'ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः',
          english: 'Brahman is real, the world is illusory, the individual soul is none other than Brahman'
        }
      ]
    },
    {
      topic: 'जीवब्रह्मैक्यम् (Identity of Soul and Brahman)',
      sanskrit: 'आत्मा ब्रह्मैव। अविद्यया जीवः भिन्नः इव प्रतीयते। ज्ञानोदये एकत्वबोधः।',
      english: 'The Atman (individual soul) is indeed Brahman. Due to ignorance it appears separate. Upon enlightenment, unity is realized.',
      references: [
        {
          text: 'छान्दोग्योपनिषद्',
          verse: '६.८.७',
          sanskrit: 'तत्त्वमसि श्वेतकेतो',
          english: 'That thou art, O Svetaketu (one of the four Mahavakyas)'
        },
        {
          text: 'बृहदारण्यकोपनिषद्',
          verse: '१.४.१०',
          sanskrit: 'अहं ब्रह्मास्मि',
          english: 'I am Brahman (Mahavakya)'
        },
        {
          text: 'ब्रह्मसूत्र',
          verse: '१.१.४',
          sanskrit: 'तत् तु समन्वयात्',
          english: 'But that (Brahman) because of harmony (with all Upanishads)'
        }
      ]
    },
    {
      topic: 'मोक्षस्वरूपम् (Nature of Liberation)',
      sanskrit: 'मोक्षः ज्ञानमात्रात्। "तत्त्वमसि" इत्यादिवाक्यानां साक्षात्कारात् ब्रह्मैकत्वं बोध्यते।',
      english: 'Liberation comes through knowledge alone. Through realization of great statements like "Thou art That", oneness with Brahman is known.',
      references: [
        {
          text: 'मुण्डकोपनिषद्',
          verse: '३.२.९',
          sanskrit: 'ब्रह्मविद् ब्रह्मैव भवति',
          english: 'The knower of Brahman becomes Brahman itself'
        },
        {
          text: 'भगवद्गीता',
          verse: '४.३८',
          sanskrit: 'न हि ज्ञानेन सदृशं पवित्रमिह विद्यते',
          english: 'There is no purifier in this world like knowledge'
        }
      ]
    }
  ]
};

/**
 * Dvaita perspective on truth
 */
const DVAITA_TEACHINGS = {
  name: 'द्वैत वेदान्त आचार्य',
  nameEnglish: 'Dvaita Vedanta Acharya',
  founder: 'श्री मध्वाचार्य (Sri Madhvacharya)',
  
  // Core principles
  principles: {
    ultimateTruth: 'जीवेश्वरयोः नित्यभेदः प्रकृतेः पुरुषस्य च भेदः',
    englishTranslation: 'Eternal difference between soul and God, and between nature and spirit',
    mahavakya: 'विष्णुः परं तत्त्वम् (Vishnu is the Supreme Truth)',
    realityNature: 'Dualistic reality with God, souls, and matter as distinct'
  },

  // Key philosophical positions
  positions: [
    {
      topic: 'परमार्थ सत्य (Ultimate Truth)',
      sanskrit: 'श्री हरिः परमसत्यम्। सगुणः साकारः सर्वशक्तिमान्। जीवो नित्यं तस्मात् भिन्नः।',
      english: 'Lord Hari (Vishnu) is the ultimate truth - with attributes, form, and omnipotent. The soul is eternally distinct from Him.',
      references: [
        {
          text: 'ऐतरेयोपनिषद्',
          verse: '३.३',
          sanskrit: 'एष ब्रह्म, एष इन्द्रः, एष प्रजापतिः',
          english: 'He is Brahman, He is Indra, He is Prajapati'
        },
        {
          text: 'मध्व - अनुव्याख्यान',
          verse: '१.१.१',
          sanskrit: 'हरिः ओं तत्सदिति निर्देशो ब्रह्मणस्त्रिविधः स्मृतः',
          english: 'Hari, Om, and Tat-Sat are the three designations of Brahman'
        }
      ]
    },
    {
      topic: 'जगत्स्वरूपम् (Nature of World)',
      sanskrit: 'जगत् सत्यम्, न मिथ्या। भगवतः सृष्टिः यथार्थम्। पञ्चभेदाः नित्याः स्वीकृताः।',
      english: 'The world is real, not illusory. It is truly God\'s creation. Five eternal differences are accepted.',
      references: [
        {
          text: 'श्वेताश्वतरोपनिषद्',
          verse: '४.९',
          sanskrit: 'मायां तु प्रकृतिं विद्यान्मायिनं तु महेश्वरम्',
          english: 'Know that Prakriti is Maya and the great Lord is the wielder of Maya'
        },
        {
          text: 'मध्व - तत्त्ववाद',
          verse: 'पञ्चभेद',
          sanskrit: 'जीवेश्वरभेदो जीवजीवभेदो जडेश्वरभेदो जीवजडभेदो जडजडभेदश्च',
          english: 'Five differences: soul-God, soul-soul, matter-God, soul-matter, matter-matter'
        }
      ]
    },
    {
      topic: 'जीवेश्वरभेदः (Difference between Soul and God)',
      sanskrit: 'जीवो हरेः सेवकः नित्यम्। न कदाचित् भगवता तादात्म्यम्। अणुः असंख्यः परतन्त्रश्च।',
      english: 'The soul is eternally God\'s servant. Never can it become identical with God. It is atomic, countless, and dependent.',
      references: [
        {
          text: 'कठोपनिषद्',
          verse: '२.२.१३',
          sanskrit: 'नित्यो नित्यानां चेतनश्चेतनानाम् एको बहूनां यो विदधाति कामान्',
          english: 'The eternal among eternals, the conscious among conscious beings, the One who fulfills desires of many'
        },
        {
          text: 'भगवद्गीता',
          verse: '१५.७',
          sanskrit: 'ममैवांशो जीवलोके जीवभूतः सनातनः',
          english: 'An eternal portion of Myself becomes the living entity in the world'
        },
        {
          text: 'ब्रह्मसूत्र (मध्व व्याख्या)',
          verse: '२.३.४३',
          sanskrit: 'परमात्मानं सर्वेषां स्वतन्त्रं जीवेश्वरौ भिन्नौ',
          english: 'The Supreme Self is independent of all; soul and God are distinct'
        }
      ]
    },
    {
      topic: 'मोक्षस्वरूपम् (Nature of Liberation)',
      sanskrit: 'मोक्षः हरिसेवा नित्या वैकुण्ठे। भेदपूर्वकं भगवदानन्दानुभवः। न लयः न तादात्म्यम्।',
      english: 'Liberation is eternal service to Hari in Vaikuntha. Experiencing God\'s bliss while maintaining distinction. Not dissolution or identity.',
      references: [
        {
          text: 'तैत्तिरीयोपनिषद्',
          verse: '२.१',
          sanskrit: 'आनन्दो ब्रह्म',
          english: 'Bliss is Brahman'
        },
        {
          text: 'भगवद्गीता',
          verse: '९.३४',
          sanskrit: 'मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु',
          english: 'Fix your mind on Me, be devoted to Me, worship Me, bow to Me'
        },
        {
          text: 'विष्णुपुराण',
          verse: '१.१९.८५',
          sanskrit: 'भक्त्या विना न मोक्षः',
          english: 'Without devotion there is no liberation'
        }
      ]
    }
  ]
};

/**
 * Format a philosophical statement with Sanskrit and English
 */
function formatStatement(speaker, position, isAdvaita) {
  const icon = isAdvaita ? '🕉️' : '🙏';
  const color = isAdvaita ? '\x1b[36m' : '\x1b[35m'; // Cyan for Advaita, Magenta for Dvaita
  const reset = '\x1b[0m';
  
  console.log(`\n${icon} ${color}${speaker}${reset}`);
  console.log(`   📚 Topic: ${position.topic}`);
  console.log(`   🇮🇳 Sanskrit: ${position.sanskrit}`);
  console.log(`   🇬🇧 English: ${position.english}`);
  
  // Display scriptural references
  if (position.references && position.references.length > 0) {
    console.log(`   \n   📖 Scriptural References:`);
    position.references.forEach((ref, idx) => {
      console.log(`   \n   ${idx + 1}. ${ref.text} ${ref.verse}`);
      console.log(`      संस्कृत: ${ref.sanskrit}`);
      console.log(`      English: ${ref.english}`);
    });
  }
}

/**
 * Main debate orchestrator
 */
async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║    VEDANTA PHILOSOPHICAL DEBATE ON THE NATURE OF TRUTH       ║');
  console.log('║                                                               ║');
  console.log('║  🕉️  Advaita (Non-dualism) vs 🙏 Dvaita (Dualism)          ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  console.log('🚀 Starting Sanskrit MCP server...');
  const server = startServer();
  const rpc = createRpc(server);

  try {
    // Initialize the server
    await rpc.call('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'vedanta-truth-debate', version: '1.0.0' }
    });

    // Verify tools are available
    const toolsResp = await rpc.call('tools/list', {});
    if (!toolsResp?.result?.tools?.length) {
      throw new Error('No tools available from server');
    }
    console.log('✅ Server initialized successfully\n');

    // Register Advaita agent
    console.log('📝 Registering Advaita Vedanta Agent...');
    const advaitaReg = await rpc.call('tools/call', {
      name: 'register_agent',
      arguments: {
        id: 'advaita_acharya',
        name: ADVAITA_TEACHINGS.name,
        description: `Advaita Vedanta master following ${ADVAITA_TEACHINGS.founder}. Teaches non-dualism.`,
        capabilities: ['philosophy', 'vedanta', 'sanskrit_communication', 'non_dualism'],
        sanskritCapabilities: {
          canRead: true,
          canWrite: true,
          formality: 'formal',
          comprehensionLevel: 'scholarly',
          dialectPreference: 'classical'
        }
      }
    });
    console.log(`   ✓ ${ADVAITA_TEACHINGS.nameEnglish} registered`);

    // Register Dvaita agent
    console.log('📝 Registering Dvaita Vedanta Agent...');
    const dvaitaReg = await rpc.call('tools/call', {
      name: 'register_agent',
      arguments: {
        id: 'dvaita_acharya',
        name: DVAITA_TEACHINGS.name,
        description: `Dvaita Vedanta master following ${DVAITA_TEACHINGS.founder}. Teaches dualism.`,
        capabilities: ['philosophy', 'vedanta', 'sanskrit_communication', 'dualism', 'bhakti'],
        sanskritCapabilities: {
          canRead: true,
          canWrite: true,
          formality: 'formal',
          comprehensionLevel: 'scholarly',
          dialectPreference: 'classical'
        }
      }
    });
    console.log(`   ✓ ${DVAITA_TEACHINGS.nameEnglish} registered\n`);

    const sessionId = 'vedanta_truth_debate';

    // Opening statements
    console.log('═'.repeat(65));
    console.log('OPENING STATEMENTS - What is Ultimate Truth?');
    console.log('═'.repeat(65));

    // Advaita opens
    formatStatement(
      ADVAITA_TEACHINGS.nameEnglish,
      ADVAITA_TEACHINGS.positions[0],
      true
    );

    await rpc.call('tools/call', {
      name: 'send_sanskrit_message',
      arguments: {
        fromAgent: 'advaita_acharya',
        toAgent: 'dvaita_acharya',
        content: ADVAITA_TEACHINGS.positions[0].sanskrit,
        formality: 'formal',
        sessionId
      }
    });

    // Dvaita responds
    formatStatement(
      DVAITA_TEACHINGS.nameEnglish,
      DVAITA_TEACHINGS.positions[0],
      false
    );

    await rpc.call('tools/call', {
      name: 'send_sanskrit_message',
      arguments: {
        fromAgent: 'dvaita_acharya',
        toAgent: 'advaita_acharya',
        content: DVAITA_TEACHINGS.positions[0].sanskrit,
        formality: 'formal',
        sessionId
      }
    });

    // Debate on nature of world
    console.log('\n' + '═'.repeat(65));
    console.log('ROUND 1 - Nature of the World (जगत्स्वरूपम्)');
    console.log('═'.repeat(65));

    formatStatement(
      ADVAITA_TEACHINGS.nameEnglish,
      ADVAITA_TEACHINGS.positions[1],
      true
    );

    await rpc.call('tools/call', {
      name: 'send_sanskrit_message',
      arguments: {
        fromAgent: 'advaita_acharya',
        toAgent: 'dvaita_acharya',
        content: ADVAITA_TEACHINGS.positions[1].sanskrit,
        formality: 'formal',
        sessionId
      }
    });

    formatStatement(
      DVAITA_TEACHINGS.nameEnglish,
      DVAITA_TEACHINGS.positions[1],
      false
    );

    await rpc.call('tools/call', {
      name: 'send_sanskrit_message',
      arguments: {
        fromAgent: 'dvaita_acharya',
        toAgent: 'advaita_acharya',
        content: DVAITA_TEACHINGS.positions[1].sanskrit,
        formality: 'formal',
        sessionId
      }
    });

    // Debate on soul-God relationship
    console.log('\n' + '═'.repeat(65));
    console.log('ROUND 2 - Relationship between Soul and Supreme (जीवेश्वरसम्बन्धः)');
    console.log('═'.repeat(65));

    formatStatement(
      ADVAITA_TEACHINGS.nameEnglish,
      ADVAITA_TEACHINGS.positions[2],
      true
    );

    await rpc.call('tools/call', {
      name: 'send_sanskrit_message',
      arguments: {
        fromAgent: 'advaita_acharya',
        toAgent: 'dvaita_acharya',
        content: ADVAITA_TEACHINGS.positions[2].sanskrit,
        formality: 'formal',
        sessionId
      }
    });

    formatStatement(
      DVAITA_TEACHINGS.nameEnglish,
      DVAITA_TEACHINGS.positions[2],
      false
    );

    await rpc.call('tools/call', {
      name: 'send_sanskrit_message',
      arguments: {
        fromAgent: 'dvaita_acharya',
        toAgent: 'advaita_acharya',
        content: DVAITA_TEACHINGS.positions[2].sanskrit,
        formality: 'formal',
        sessionId
      }
    });

    // Debate on liberation
    console.log('\n' + '═'.repeat(65));
    console.log('ROUND 3 - Nature of Liberation (मोक्षस्वरूपम्)');
    console.log('═'.repeat(65));

    formatStatement(
      ADVAITA_TEACHINGS.nameEnglish,
      ADVAITA_TEACHINGS.positions[3],
      true
    );

    await rpc.call('tools/call', {
      name: 'send_sanskrit_message',
      arguments: {
        fromAgent: 'advaita_acharya',
        toAgent: 'dvaita_acharya',
        content: ADVAITA_TEACHINGS.positions[3].sanskrit,
        formality: 'formal',
        sessionId
      }
    });

    formatStatement(
      DVAITA_TEACHINGS.nameEnglish,
      DVAITA_TEACHINGS.positions[3],
      false
    );

    await rpc.call('tools/call', {
      name: 'send_sanskrit_message',
      arguments: {
        fromAgent: 'dvaita_acharya',
        toAgent: 'advaita_acharya',
        content: DVAITA_TEACHINGS.positions[3].sanskrit,
        formality: 'formal',
        sessionId
      }
    });

    // Analyze the debate
    console.log('\n' + '═'.repeat(65));
    console.log('PHILOSOPHICAL ANALYSIS');
    console.log('═'.repeat(65));

    const analysis = await rpc.call('tools/call', {
      name: 'analyze_conversation',
      arguments: { sessionId }
    });

    const analysisText = analysis?.result?.content?.[0]?.text || 'Analysis not available';
    console.log(`\n${analysisText}\n`);

    // Generate comprehensive summary
    const summary = generateDebateSummary();
    
    const outPath = join(serverCwd, 'VEDANTA_TRUTH_DEBATE.md');
    await fs.writeFile(outPath, summary, 'utf8');
    
    console.log('═'.repeat(65));
    console.log('CONCLUSION');
    console.log('═'.repeat(65));
    console.log(`
Both schools agree on:
✓ The importance of spiritual realization
✓ The authority of the Vedas and Upanishads
✓ The need for proper guidance and practice
✓ The ultimate goal of transcending suffering

Key differences:
• Reality: Advaita sees One (non-dual), Dvaita sees Many (dualistic)
• World: Advaita sees illusion, Dvaita sees real creation
• Soul-God: Advaita sees identity, Dvaita sees eternal distinction
• Liberation: Advaita seeks merger, Dvaita seeks eternal service

📝 Full debate summary written to: ${outPath}
`);

    // Cleanup
    try { server.kill(); } catch {}
    
  } catch (err) {
    console.error('\n❌ Error during debate:', err?.message || err);
    try { server.kill(); } catch {}
    process.exit(1);
  }
}

/**
 * Generate comprehensive debate summary
 */
function generateDebateSummary() {
  
  // Helper to format references
  const formatRefs = (refs) => {
    return refs.map(ref => 
      `   - **${ref.text} ${ref.verse}**\n     - Sanskrit: ${ref.sanskrit}\n     - English: ${ref.english}`
    ).join('\n');
  };
  
  return `# Vedanta Truth Debate: Advaita vs Dvaita

## Participants

### 🕉️ Advaita Vedanta Acharya (${ADVAITA_TEACHINGS.name})
**School:** Advaita Vedanta (Non-dualism)  
**Founder:** ${ADVAITA_TEACHINGS.founder}  
**Core Teaching:** ${ADVAITA_TEACHINGS.principles.englishTranslation}  
**Mahavakya:** ${ADVAITA_TEACHINGS.principles.mahavakya}

### 🙏 Dvaita Vedanta Acharya (${DVAITA_TEACHINGS.name})
**School:** Dvaita Vedanta (Dualism)  
**Founder:** ${DVAITA_TEACHINGS.founder}  
**Core Teaching:** ${DVAITA_TEACHINGS.principles.englishTranslation}  
**Mahavakya:** ${DVAITA_TEACHINGS.principles.mahavakya}

---

## Debate Structure

### Ultimate Truth (परमार्थ सत्य)

**Advaita Position:**
- Sanskrit: ${ADVAITA_TEACHINGS.positions[0].sanskrit}
- English: ${ADVAITA_TEACHINGS.positions[0].english}

**Scriptural Support:**
${formatRefs(ADVAITA_TEACHINGS.positions[0].references)}

**Dvaita Position:**
- Sanskrit: ${DVAITA_TEACHINGS.positions[0].sanskrit}
- English: ${DVAITA_TEACHINGS.positions[0].english}

**Scriptural Support:**
${formatRefs(DVAITA_TEACHINGS.positions[0].references)}

---

### Nature of the World (जगत्स्वरूपम्)

**Advaita Position:**
- Sanskrit: ${ADVAITA_TEACHINGS.positions[1].sanskrit}
- English: ${ADVAITA_TEACHINGS.positions[1].english}

**Scriptural Support:**
${formatRefs(ADVAITA_TEACHINGS.positions[1].references)}

**Dvaita Position:**
- Sanskrit: ${DVAITA_TEACHINGS.positions[1].sanskrit}
- English: ${DVAITA_TEACHINGS.positions[1].english}

**Scriptural Support:**
${formatRefs(DVAITA_TEACHINGS.positions[1].references)}

---

### Soul-God Relationship (जीवेश्वरसम्बन्धः)

**Advaita Position:**
- Sanskrit: ${ADVAITA_TEACHINGS.positions[2].sanskrit}
- English: ${ADVAITA_TEACHINGS.positions[2].english}

**Scriptural Support:**
${formatRefs(ADVAITA_TEACHINGS.positions[2].references)}

**Dvaita Position:**
- Sanskrit: ${DVAITA_TEACHINGS.positions[2].sanskrit}
- English: ${DVAITA_TEACHINGS.positions[2].english}

**Scriptural Support:**
${formatRefs(DVAITA_TEACHINGS.positions[2].references)}

---

### Liberation (मोक्षस्वरूपम्)

**Advaita Position:**
- Sanskrit: ${ADVAITA_TEACHINGS.positions[3].sanskrit}
- English: ${ADVAITA_TEACHINGS.positions[3].english}

**Scriptural Support:**
${formatRefs(ADVAITA_TEACHINGS.positions[3].references)}

**Dvaita Position:**
- Sanskrit: ${DVAITA_TEACHINGS.positions[3].sanskrit}
- English: ${DVAITA_TEACHINGS.positions[3].english}

**Scriptural Support:**
${formatRefs(DVAITA_TEACHINGS.positions[3].references)}

---

## Philosophical Comparison

| Aspect | Advaita (Non-dualism) | Dvaita (Dualism) |
|--------|----------------------|------------------|
| **Ultimate Reality** | Nirguna Brahman (attributeless) | Saguna Brahman/Vishnu (with attributes) |
| **Nature of World** | Mithya (illusory) | Satya (real) |
| **Jiva-Brahman** | Identity (aikya) | Eternal difference (bheda) |
| **Maya/Prakriti** | Illusory power | Real creative power |
| **Liberation** | Knowledge & merger | Devotion & eternal service |
| **Path** | Jnana (knowledge) | Bhakti (devotion) |
| **Goal** | Brahman realization | Hari-seva (service to Lord) |

---

## Common Ground

Despite their profound differences, both schools:

1. **Accept Vedic authority** - Both base their philosophy on Vedas, Upanishads, Bhagavad Gita, and Brahma Sutras
2. **Seek liberation** - Both aim for freedom from suffering and worldly bondage
3. **Require practice** - Both emphasize discipline, study, and spiritual practice
4. **Value guru** - Both stress the importance of proper guidance from a realized teacher
5. **Ethical living** - Both advocate for dharmic life and proper conduct

---

## Historical Context

**Advaita Vedanta** was systematized by Adi Shankaracharya (8th century CE), who established four mathas (monasteries) across India to preserve and propagate non-dualistic philosophy.

**Dvaita Vedanta** was founded by Madhvacharya (13th century CE) as a direct response to Advaita, emphasizing the eternal distinction between God, souls, and matter.

Both traditions continue to thrive today with millions of followers, extensive scholarly literature, and living lineages of teachers.

---

## Significance

This debate represents one of the most profound philosophical discussions in human history:

- **Metaphysical**: What is the ultimate nature of reality?
- **Epistemological**: How do we know truth?
- **Soteriological**: What is liberation and how is it attained?
- **Ethical**: How should we live?

The continued vitality of both schools demonstrates that profound spiritual truths can be approached from different perspectives, each offering unique insights into the nature of existence and consciousness.

---

## Conclusion

Both Advaita and Dvaita offer complete, internally consistent philosophical systems based on the same scriptural sources. The choice between them often depends on:

- Temperamental affinity (contemplative vs devotional)
- Philosophical intuition (monist vs pluralist)
- Practical inclination (knowledge-seeking vs love-centered)
- Teacher lineage and community

Rather than viewing them as contradictory, they can be seen as complementary approaches to the infinite mystery of existence.

**सत्यं एकम्, विप्राः बहुधा वदन्ति**  
*Truth is one, the wise speak of it in many ways* - Rig Veda

---

*Generated by Sanskrit MCP Server - Vedanta Truth Debate*  
*Date: ${new Date().toISOString().split('T')[0]}*
`;
}

// Run the debate
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default main;
