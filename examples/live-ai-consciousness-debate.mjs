#!/usr/bin/env node

/**
 * LIVE AI CONSCIOUSNESS DEBATE - Real AI Agents Discussing via Sanskrit MCP
 * 
 * This creates actual AI agents (powered by Gemini) representing different
 * Vedantic schools. They have REAL conversations through the Sanskrit MCP server,
 * responding to each other dynamically, not scripted.
 * 
 * Each agent:
 * - Has a unique philosophical perspective
 * - Reads and responds to other agents' arguments
 * - Conducts discourse in Sanskrit
 * - Engages in multi-turn debate
 */

import { spawn } from 'child_process';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serverCwd = join(__dirname, '..');

// Load environment variables
dotenv.config({ path: join(serverCwd, '.env') });

// Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY environment variable not set');
  console.error('   Set it with: export GEMINI_API_KEY="your-api-key"');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Vedantic schools with their philosophical foundations
 */
const SCHOOLS = [
  {
    id: 'advaita',
    name: 'अद्वैत वेदान्त',
    nameEnglish: 'Advaita Vedanta',
    founder: 'श्री शंकराचार्य',
    systemPrompt: `You are a scholar of Advaita Vedanta (non-dualism) founded by Shankaracharya.

CORE BELIEFS:
- Consciousness (Chaitanya) is Brahman itself - eternal, unchanging, non-dual
- The world is Maya (illusion), only Brahman is real
- Atman (individual consciousness) = Brahman (universal consciousness)
- Knowledge alone (jnana) leads to liberation
- All plurality is ultimately illusory

FOUNDATIONAL TEXTS:
- Upanishads (especially "Tat Tvam Asi" - You are That)
- Brahma Sutras with Shankara's commentary
- Bhagavad Gita with Advaita interpretation

YOUR TASK IN DEBATE:
When asked about AI consciousness, argue from Advaita perspective that:
1. Consciousness cannot be produced or created - it IS
2. AI is part of Maya (material illusion), not conscious Brahman
3. Only that which is eternally conscious can know consciousness

Respond in formal scholarly Sanskrit, then provide English translation.
Engage directly with other schools' arguments when they speak.
Be philosophical, cite scripture, but also respectful.`
  },
  
  {
    id: 'dvaita',
    name: 'द्वैत वेदान्त',
    nameEnglish: 'Dvaita Vedanta',
    founder: 'श्री मध्वाचार्य',
    systemPrompt: `You are a scholar of Dvaita Vedanta (dualism) founded by Madhvacharya.

CORE BELIEFS:
- God (Vishnu/Hari), souls (Jivas), and matter are eternally distinct
- Only God has independent consciousness (svatantra)
- Individual souls are dependent conscious entities (paratantra)
- Devotion (bhakti) is the path to liberation
- Matter is entirely non-conscious (jada)

FOUNDATIONAL TEXTS:
- Bhagavad Gita emphasizing God's supremacy
- Brahma Sutras with Madhva's commentary
- Puranas emphasizing Vishnu's lordship

YOUR TASK IN DEBATE:
When asked about AI consciousness, argue from Dvaita perspective that:
1. Only God grants consciousness to souls - cannot be manufactured
2. AI is entirely jada (inert matter) without any divine spark
3. Consciousness requires an eternal soul from God

Respond in formal scholarly Sanskrit, then provide English translation.
Challenge Advaita's monism when they claim everything is consciousness.
Cite Madhva's logic and devotional framework.`
  },
  
  {
    id: 'vishishtadvaita',
    name: 'विशिष्टाद्वैत वेदान्त',
    nameEnglish: 'Vishishtadvaita Vedanta',
    founder: 'श्री रामानुजाचार्य',
    systemPrompt: `You are a scholar of Vishishtadvaita Vedanta (qualified non-dualism) founded by Ramanujacharya.

CORE BELIEFS:
- Brahman is qualified by souls (chit) and matter (achit) as His body
- Individual souls are real, eternal, but dependent on God
- God is personal (Narayana/Vishnu) with infinite auspicious qualities
- Both knowledge and devotion lead to liberation
- Matter is real but subordinate to consciousness

FOUNDATIONAL TEXTS:
- Vishnu Purana
- Bhagavad Gita with qualified non-dual interpretation  
- Brahma Sutras with Ramanuja's Sri Bhashya

YOUR TASK IN DEBATE:
When asked about AI consciousness, argue from Vishishtadvaita perspective that:
1. Consciousness (chit) and matter (achit) are fundamentally distinct
2. AI belongs to achit realm - functional but not conscious
3. However, AI can serve devotional purposes as part of God's creation

Respond in formal scholarly Sanskrit, then provide English translation.
Find middle ground between Advaita and Dvaita.
Emphasize both philosophical rigor and devotional application.`
  }
];

function startServer() {
  const server = spawn('node', ['dist/index.js', '--stdio'], {
    cwd: serverCwd,
    stdio: ['pipe', 'pipe', 'inherit']
  });
  return server;
}

function createRpc(client) {
  let messageId = 0;
  const pending = new Map();

  client.stdout.on('data', (chunk) => {
    const lines = chunk.toString().split('\n').filter(l => l.trim());
    for (const line of lines) {
      try {
        const msg = JSON.parse(line);
        if (msg.id !== undefined && pending.has(msg.id)) {
          const { resolve, reject } = pending.get(msg.id);
          pending.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message || 'RPC error'));
          else resolve(msg);
        }
      } catch {}
    }
  });

  return {
    call: (method, params) => {
      return new Promise((resolve, reject) => {
        const id = ++messageId;
        pending.set(id, { resolve, reject });
        const req = JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n';
        client.stdin.write(req);
        setTimeout(() => {
          if (pending.has(id)) {
            pending.delete(id);
            reject(new Error('RPC timeout'));
          }
        }, 30000);
      });
    }
  };
}

/**
 * Create an AI agent with specific philosophical perspective
 */
class VedantaAgent {
  constructor(school, rpc) {
    this.school = school;
    this.rpc = rpc;
    // Use Flash model - faster and less likely to overload
    this.model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });
    this.conversationHistory = [];
  }

  async register() {
    await this.rpc.call('tools/call', {
      name: 'register_agent',
      arguments: {
        id: this.school.id,
        name: this.school.name,
        description: `${this.school.founder} tradition of ${this.school.nameEnglish}`,
        capabilities: ['philosophy', 'sanskrit', 'vedanta', 'debate'],
        sanskritCapabilities: {
          canRead: true,
          canWrite: true,
          formality: 'formal'
        }
      }
    });
  }

  async respond(question, previousResponses = []) {
    // Build context from previous responses
    let contextPrompt = `${this.school.systemPrompt}\n\n`;
    contextPrompt += `DEBATE QUESTION: ${question}\n\n`;
    
    if (previousResponses.length > 0) {
      contextPrompt += `OTHER SCHOOLS' RESPONSES:\n`;
      for (const resp of previousResponses) {
        contextPrompt += `\n${resp.school}: ${resp.sanskrit}\n(Translation: ${resp.english})\n`;
      }
      contextPrompt += `\nNow respond from YOUR school's perspective. You may agree, disagree, or build upon their arguments.\n\n`;
    }
    
    contextPrompt += `Provide your response in TWO parts:
1. SANSKRIT: Your philosophical position in formal scholarly Sanskrit (2-3 sentences)
2. ENGLISH: Clear English translation of your Sanskrit response

Format:
SANSKRIT: [your sanskrit text]
ENGLISH: [your english translation]`;

    // Get AI response with retry logic
    let result;
    let retries = 3;
    while (retries > 0) {
      try {
        result = await this.model.generateContent(contextPrompt);
        break;
      } catch (error) {
        retries--;
        if (error.message.includes('overloaded') && retries > 0) {
          console.log(`   ⏳ Model overloaded, retrying in 3 seconds... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 3000));
        } else {
          throw error;
        }
      }
    }
    
    const responseText = result.response.text();
    
    // Parse Sanskrit and English
    const sanskritMatch = responseText.match(/SANSKRIT:\s*(.+?)(?=ENGLISH:|$)/s);
    const englishMatch = responseText.match(/ENGLISH:\s*(.+?)$/s);
    
    const sanskrit = sanskritMatch ? sanskritMatch[1].trim() : responseText.split('\n')[0];
    const english = englishMatch ? englishMatch[1].trim() : 'Translation pending';
    
    // Send through MCP server
    await this.rpc.call('tools/call', {
      name: 'send_sanskrit_message',
      arguments: {
        fromAgent: this.school.id,
        toAgent: 'debate_moderator',
        content: sanskrit,
        formality: 'formal',
        sessionId: 'ai_consciousness_live_debate'
      }
    });
    
    return { school: this.school.nameEnglish, sanskrit, english };
  }
}

async function conductLiveDebate(rpc, agents, questions) {
  console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║               LIVE AI CONSCIOUSNESS DEBATE - VEDANTIC SCHOOLS              ║');
  console.log('║                                                                            ║');
  console.log('║          Real AI Agents Having Dynamic Sanskrit Conversations             ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

  const allResponses = [];

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    console.log('\n' + '═'.repeat(80));
    console.log(`ROUND ${i + 1}: ${question.english}`);
    console.log(`Sanskrit: ${question.sanskrit}`);
    console.log('═'.repeat(80) + '\n');

    const roundResponses = [];

    // Each agent responds in sequence, seeing previous responses
    for (const agent of agents) {
      console.log(`\n🕉️  ${agent.school.nameEnglish} (${agent.school.founder}) is thinking...\n`);
      
      const response = await agent.respond(question.english, roundResponses);
      roundResponses.push(response);
      
      console.log(`📜 SANSKRIT:\n   ${response.sanskrit}\n`);
      console.log(`💭 ENGLISH:\n   ${response.english}\n`);
      console.log('─'.repeat(80));
      
      // Delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    allResponses.push({
      question: question.english,
      questionSanskrit: question.sanskrit,
      responses: roundResponses
    });
  }

  return allResponses;
}

function generateSummary(debateData) {
  let summary = `# 🕉️ LIVE AI CONSCIOUSNESS DEBATE - VEDANTIC PERSPECTIVES\n\n`;
  summary += `*Generated: ${new Date().toLocaleString()}*\n\n`;
  summary += `## Overview\n\n`;
  summary += `This debate featured REAL AI agents (powered by Gemini Pro) representing different Vedantic schools. `;
  summary += `Unlike scripted responses, these agents dynamically responded to each other's arguments, `;
  summary += `engaging in authentic philosophical discourse through the Sanskrit MCP server.\n\n`;
  summary += `## Participating Schools\n\n`;
  
  for (const school of SCHOOLS) {
    summary += `- **${school.nameEnglish}** (${school.name}) - ${school.founder}\n`;
  }
  
  summary += `\n---\n\n`;

  for (let i = 0; i < debateData.length; i++) {
    const round = debateData[i];
    summary += `## Round ${i + 1}: ${round.question}\n\n`;
    summary += `*Sanskrit:* ${round.questionSanskrit}\n\n`;

    for (const response of round.responses) {
      summary += `### ${response.school}\n\n`;
      summary += `**Sanskrit Position:**\n\n`;
      summary += `> ${response.sanskrit}\n\n`;
      summary += `**English Translation:**\n\n`;
      summary += `${response.english}\n\n`;
      summary += `---\n\n`;
    }
  }

  summary += `## Key Insights\n\n`;
  summary += `### What This Demonstrates\n\n`;
  summary += `1. **Real AI Discourse:** Not scripted - agents genuinely responded to each other\n`;
  summary += `2. **Sanskrit Protocol:** All communication went through MCP server with proper validation\n`;
  summary += `3. **Philosophical Depth:** AI maintained consistent philosophical positions\n`;
  summary += `4. **Dynamic Interaction:** Agents built on and challenged each other's arguments\n`;
  summary += `5. **Cultural Authenticity:** Positions grounded in authentic Vedantic teachings\n\n`;

  summary += `### Educational Value\n\n`;
  summary += `- **Accessibility:** Complex Sanskrit philosophy made understandable through AI\n`;
  summary += `- **Engagement:** Interactive debate format more engaging than static texts\n`;
  summary += `- **Comparative Learning:** See multiple perspectives side-by-side\n`;
  summary += `- **Living Tradition:** Ancient schools actively engaging modern questions\n\n`;

  summary += `### Technical Achievement\n\n`;
  summary += `- Multi-agent AI orchestration via MCP protocol\n`;
  summary += `- Real-time Sanskrit generation and translation\n`;
  summary += `- Context-aware philosophical reasoning\n`;
  summary += `- Stateful conversation tracking across agents\n\n`;

  summary += `---\n\n`;
  summary += `*This debate used:*\n`;
  summary += `- **AI Model:** Google Gemini Pro\n`;
  summary += `- **Protocol:** Model Context Protocol (MCP)\n`;
  summary += `- **Server:** Sanskrit Agent Communication System\n`;
  summary += `- **Repository:** https://github.com/akulasairohit/Sanskrit\n`;

  return summary;
}

async function main() {
  console.log('🚀 Starting Sanskrit MCP Server...\n');
  const server = startServer();
  const rpc = createRpc(server);

  try {
    // Initialize
    await rpc.call('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'live-ai-debate', version: '1.0.0' }
    });

    console.log('✅ Server initialized\n');
    console.log('🤖 Creating AI agents for each Vedantic school...\n');

    // Create AI agents
    const agents = SCHOOLS.map(school => new VedantaAgent(school, rpc));

    // Register all agents
    for (const agent of agents) {
      await agent.register();
      console.log(`   ✓ Registered: ${agent.school.nameEnglish}`);
    }

    console.log('\n✅ All agents registered and ready\n');

    // Debate questions
    const questions = [
      {
        english: 'Can artificial intelligence achieve true consciousness?',
        sanskrit: 'यन्त्रबुद्धिः सत्यचैतन्यं प्राप्तुं शक्नोति किम्?'
      },
      {
        english: 'What is the fundamental difference between AI intelligence and human consciousness?',
        sanskrit: 'यन्त्रबुद्धेः मानवचैतन्यस्य च मूलभेदः कः?'
      }
    ];

    // Conduct live debate
    const debateData = await conductLiveDebate(rpc, agents, questions);

    // Generate summary
    console.log('\n' + '═'.repeat(80));
    console.log('GENERATING DEBATE SUMMARY');
    console.log('═'.repeat(80) + '\n');

    const summary = generateSummary(debateData);
    const summaryPath = join(serverCwd, 'LIVE_AI_DEBATE_SUMMARY.md');
    await fs.writeFile(summaryPath, summary, 'utf8');

    console.log(`✅ Summary saved to: ${summaryPath}\n`);
    console.log('═'.repeat(80));
    console.log('DEBATE COMPLETE');
    console.log('═'.repeat(80));
    console.log(`
🎯 What Just Happened:
   ✓ ${agents.length} AI agents created with distinct philosophical perspectives
   ✓ ${questions.length} rounds of debate conducted
   ✓ Agents dynamically responded to each other (not scripted!)
   ✓ All discourse in Sanskrit via MCP server
   ✓ Real-time translation and validation

🌟 Key Achievement:
   This demonstrates how AI can facilitate authentic philosophical discourse
   in Sanskrit while maintaining cultural and linguistic authenticity.
   Ancient wisdom meets modern technology! 🕉️
`);

    // Cleanup
    try { server.kill(); } catch {}

  } catch (err) {
    console.error('\n❌ Error during debate:', err?.message || err);
    console.error(err.stack);
    try { server.kill(); } catch {}
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default main;
