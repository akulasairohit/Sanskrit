#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  ListToolsRequestSchema,
  CallToolRequestSchema,
  CallToolRequest,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ReadResourceRequest
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { 
  AgentRegistry, 
  TranslationService, 
  SanskritProtocol, 
  SanskritValidator,
  CommunicationLogger
} from './lib/index.js';
import VedicCorpusParser from './lib/vedic-corpus-parser.js';

import type {
  Agent,
  SanskritMessage,
  AgentInteraction
} from './lib/types.js';

// Initialize core services
const agentRegistry = new AgentRegistry();
const translationService = new TranslationService();
const vedicCorpus = new VedicCorpusParser();
const sanskritProtocol = new SanskritProtocol(
  new SanskritValidator(),
  new CommunicationLogger()
);

// Create MCP server
const server = new Server(
  {
    name: 'sanskrit-agent-communication',
    version: '1.0.0',
    description: 'MCP server for Sanskrit agent communication with real-time translation'
  },
  {
    capabilities: {
      tools: {},
      resources: {}
    }
  }
);

// Tool schemas (Zod for validation)
const RegisterAgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  capabilities: z.array(z.string()).optional(),
  sanskritCapabilities: z.object({
    canRead: z.boolean().default(true),
    canWrite: z.boolean().default(true),
    dialectPreference: z.string().optional(),
    formality: z.enum(['formal', 'moderate', 'casual']).default('moderate')
  }).optional()
});

// JSON Schemas for MCP Inspector (what the Inspector expects to render forms)
const RegisterAgentJSONSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    capabilities: { type: 'array', items: { type: 'string' } },
    sanskritCapabilities: {
      type: 'object',
      additionalProperties: false,
      properties: {
        canRead: { type: 'boolean', default: true },
        canWrite: { type: 'boolean', default: true },
        dialectPreference: { type: 'string' },
        formality: { type: 'string', enum: ['formal', 'moderate', 'casual'], default: 'moderate' }
      }
    }
  },
  required: ['id', 'name']
} as const;

const SendSanskritMessageSchema = z.object({
  fromAgent: z.string(),
  toAgent: z.string(),
  content: z.string(),
  context: z.string().optional(),
  formality: z.enum(['formal', 'moderate', 'casual']).default('moderate'),
  sessionId: z.string().optional()
});

const SendSanskritMessageJSONSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    fromAgent: { type: 'string' },
    toAgent: { type: 'string' },
    content: { type: 'string' },
    context: { type: 'string' },
    formality: { type: 'string', enum: ['formal', 'moderate', 'casual'], default: 'moderate' },
    sessionId: { type: 'string' }
  },
  required: ['fromAgent', 'toAgent', 'content']
} as const;

const TranslateSanskritSchema = z.object({
  text: z.string(),
  direction: z.enum(['sanskrit-to-english', 'english-to-sanskrit']),
  includeTransliteration: z.boolean().default(false),
  culturalContext: z.boolean().default(false),
  preserveMetrics: z.boolean().default(true)
});

const TranslateSanskritJSONSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    text: { type: 'string' },
    direction: { type: 'string', enum: ['sanskrit-to-english', 'english-to-sanskrit'] },
    includeTransliteration: { type: 'boolean', default: false },
    culturalContext: { type: 'boolean', default: false },
    preserveMetrics: { type: 'boolean', default: true }
  },
  required: ['text', 'direction']
} as const;

const GetAgentStatusSchema = z.object({
  agentId: z.string().optional()
});

const GetAgentStatusJSONSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    agentId: { type: 'string' }
  }
} as const;

const AnalyzeConversationSchema = z.object({
  sessionId: z.string()
});

const AnalyzeConversationJSONSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    sessionId: { type: 'string' }
  },
  required: ['sessionId']
} as const;

const QueryVedicKnowledgeSchema = z.object({
  query: z.string(),
  includeCommentaries: z.boolean().default(true),
  maxSources: z.number().min(1).max(10).default(5),
  confidenceThreshold: z.number().min(0).max(1).default(0.6)
});

const QueryVedicKnowledgeJSONSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    query: { type: 'string' },
    includeCommentaries: { type: 'boolean', default: true },
    maxSources: { type: 'number', minimum: 1, maximum: 10, default: 5 },
    confidenceThreshold: { type: 'number', minimum: 0, maximum: 1, default: 0.6 }
  },
  required: ['query']
} as const;

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'register_agent',
      description: 'Register a new Sanskrit-capable AI agent',
      inputSchema: RegisterAgentJSONSchema as any
    },
    {
      name: 'send_sanskrit_message',
      description: 'Send a message in Sanskrit between agents with automatic translation',
      inputSchema: SendSanskritMessageJSONSchema as any
    },
    {
      name: 'translate_sanskrit',
      description: 'Translate text between Sanskrit and English with cultural context',
      inputSchema: TranslateSanskritJSONSchema as any
    },
    {
      name: 'get_agent_status',
      description: 'Get status and statistics for registered agents',
      inputSchema: GetAgentStatusJSONSchema as any
    },
    {
      name: 'analyze_conversation',
      description: 'Analyze Sanskrit conversation patterns and cultural elements',
      inputSchema: AnalyzeConversationJSONSchema as any
    },
    {
      name: 'query_vedic_knowledge',
      description: 'Query authoritative Vedic texts with source attribution (anti-hallucination)',
      inputSchema: QueryVedicKnowledgeJSONSchema as any
    }
  ]
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'register_agent': {
        const parsed = RegisterAgentSchema.parse(args);
        const agent = await agentRegistry.registerAgent(parsed);
        return {
          content: [{
            type: 'text',
            text: `Successfully registered agent: ${agent.name} (ID: ${agent.id})\nCapabilities: ${agent.capabilities.join(', ')}\nSanskrit Support: Read=${agent.sanskritCapabilities.canRead}, Write=${agent.sanskritCapabilities.canWrite}`
          }]
        };
      }

      case 'send_sanskrit_message': {
        const parsed = SendSanskritMessageSchema.parse(args);
        
        // Validate agents exist
        const fromAgent = agentRegistry.getAgent(parsed.fromAgent);
        const toAgent = agentRegistry.getAgent(parsed.toAgent);
        
        if (!fromAgent || !toAgent) {
          throw new Error(`Agent not found: ${!fromAgent ? parsed.fromAgent : parsed.toAgent}`);
        }

        // Create Sanskrit message
        const message: SanskritMessage = {
          id: `msg_${Date.now()}`,
          content: parsed.content,
          timestamp: new Date(),
          language: 'sanskrit',
          metadata: {
            formality: parsed.formality,
            context: parsed.context
          }
        };

        // Process through Sanskrit protocol
        const response = await sanskritProtocol.processMessage(
          message,
          fromAgent,
          toAgent
        );

        // Translate for user understanding
        const translation = await translationService.sanskritToEnglish(
          parsed.content,
          { 
            culturalContext: true,
            includeTransliteration: true
          }
        );

        // Log the interaction
        const interaction: AgentInteraction = {
          fromAgent: parsed.fromAgent,
          toAgent: parsed.toAgent,
          message,
          translatedMessage: translation,
          type: 'direct',
          sessionId: parsed.sessionId || 'default',
          success: true,
          responseTime: Date.now() - message.timestamp.getTime()
        };

        // Actually log it to the communication logger
        await sanskritProtocol.getLogger().logCommunication(interaction);

        return {
          content: [{
            type: 'text',
            text: `✉️ Sanskrit Message Sent\n\n📤 From: ${fromAgent.name}\n📥 To: ${toAgent.name}\n\n🕉️ Sanskrit: ${parsed.content}\n🌍 English: ${translation}\n\n📊 Protocol Response: ${response.type}\n${response.suggestions.length > 0 ? '\n💡 Suggestions:\n' + response.suggestions.join('\n') : ''}`
          }]
        };
      }

      case 'translate_sanskrit': {
        const parsed = TranslateSanskritSchema.parse(args);
        
        let result: string;
        if (parsed.direction === 'sanskrit-to-english') {
          result = await translationService.sanskritToEnglish(parsed.text, {
            includeTransliteration: parsed.includeTransliteration,
            culturalContext: parsed.culturalContext
          });
        } else {
          result = await translationService.englishToSanskrit(parsed.text, {
            preserveMetrics: parsed.preserveMetrics
          });
        }

        return {
          content: [{
            type: 'text',
            text: `🔤 Translation (${parsed.direction})\n\n📝 Original: ${parsed.text}\n✨ Translated: ${result}`
          }]
        };
      }

      case 'get_agent_status': {
        const parsed = GetAgentStatusSchema.parse(args);
        
        if (parsed.agentId) {
          const agent = agentRegistry.getAgent(parsed.agentId);
          if (!agent) {
            throw new Error(`Agent not found: ${parsed.agentId}`);
          }

          return {
            content: [{
              type: 'text',
              text: `🤖 Agent Status: ${agent.name}\n\n🆔 ID: ${agent.id}\n📝 Description: ${agent.description || 'No description'}\n🛠️ Capabilities: ${agent.capabilities.join(', ')}\n🕉️ Sanskrit: Read=${agent.sanskritCapabilities.canRead}, Write=${agent.sanskritCapabilities.canWrite}\n📊 Messages Sent: ${agent.statistics.messagesSent}\n📨 Messages Received: ${agent.statistics.messagesReceived}\n⏱️ Last Active: ${agent.statistics.lastActive.toLocaleString()}`
            }]
          };
        } else {
          const allAgents = agentRegistry.getAllAgents();
          const stats = agentRegistry.getStatistics();
          
          return {
            content: [{
              type: 'text',
              text: `📊 Agent Registry Status\n\n👥 Total Agents: ${stats.totalAgents}\n🕉️ Sanskrit Capable: ${stats.sanskritCapableAgents}\n💬 Total Messages: ${stats.totalMessages}\n🎯 Active Sessions: ${stats.activeSessions}\n\n🤖 Registered Agents:\n${allAgents.map((agent: Agent) => `• ${agent.name} (${agent.id}) - ${agent.capabilities.join(', ')}`).join('\n')}`
            }]
          };
        }
      }

      case 'analyze_conversation': {
        const parsed = AnalyzeConversationSchema.parse(args);
        const analysis = await sanskritProtocol.analyzeConversation(parsed.sessionId);
        
        return {
          content: [{
            type: 'text',
            text: `📈 Conversation Analysis (Session: ${parsed.sessionId})\n\n💬 Total Messages: ${analysis.totalMessages}\n👥 Participants: ${analysis.participants.join(', ')}\n⏱️ Duration: ${Math.round(analysis.timespan.duration / 1000)}s\n🕉️ Sanskrit Messages: ${analysis.languageStatistics.sanskritMessages}\n🌍 English Messages: ${analysis.languageStatistics.englishMessages}\n📊 Success Rate: ${Math.round(analysis.communicationEfficiency.messageSuccessRate * 100)}%\n🎯 Translation Accuracy: ${Math.round(analysis.translationAccuracy.overallAccuracy * 100)}%\n\n🏛️ Cultural Elements:\n• Religious References: ${analysis.culturalElements.religiousReferences}\n• Philosophical Concepts: ${analysis.culturalElements.philosophicalConcepts}\n• Traditional Greetings: ${analysis.culturalElements.traditionalGreetings}\n• Honorifics: ${analysis.culturalElements.honorifics}`
          }]
        };
      }

      case 'query_vedic_knowledge': {
        const parsed = QueryVedicKnowledgeSchema.parse(args);
        const result = await vedicCorpus.queryVedicKnowledge(parsed.query);
        
        if (result.confidence < parsed.confidenceThreshold) {
          return {
            content: [{
              type: 'text',
              text: `⚠️ Query: "${parsed.query}"\n\n❌ Insufficient authoritative sources found (confidence: ${Math.round(result.confidence * 100)}% < ${Math.round(parsed.confidenceThreshold * 100)}%)\n\n🛡️ Anti-hallucination safeguard activated: I cannot provide information without proper textual foundation from authenticated Vedic sources.\n\n💡 Try rephrasing your query with more specific Sanskrit terms or philosophical concepts.`
            }]
          };
        }

        let response = `🕉️ **Vedic Knowledge Query: "${result.query}"**\n\n`;
        response += `📊 **Confidence:** ${Math.round(result.confidence * 100)}% | **Risk:** ${result.hallucinationRisk}\n\n`;
        response += `${result.synthesizedAnswer}\n\n`;
        
        if (result.warnings && result.warnings.length > 0) {
          response += `⚠️ **Warnings:**\n${result.warnings.map(w => `• ${w}`).join('\n')}\n\n`;
        }
        
        response += `📚 **Sources Referenced:**\n`;
        result.sources.slice(0, parsed.maxSources).forEach((source, i) => {
          response += `${i + 1}. ${source.text}`;
          if (source.chapter && source.verse) {
            response += ` ${source.chapter}.${source.verse}`;
          }
          if (source.edition) {
            response += ` (${source.edition})`;
          }
          response += '\n';
        });

        return {
          content: [{
            type: 'text',
            text: response
          }]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `❌ Error: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
});

// Register resources
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: 'sanskrit://agents',
      name: 'Registered Sanskrit Agents',
      description: 'List of all registered Sanskrit-capable agents',
      mimeType: 'application/json'
    },
    {
      uri: 'sanskrit://conversations',
      name: 'Sanskrit Conversations',
      description: 'Recent Sanskrit conversation logs with translations',
      mimeType: 'application/json'
    },
    {
      uri: 'sanskrit://vocabulary',
      name: 'Sanskrit Vocabulary',
      description: 'Sanskrit-English vocabulary and cultural context',
      mimeType: 'application/json'
    },
    {
      uri: 'sanskrit://vedic-corpus',
      name: 'Vedic Knowledge Base',
      description: 'Authoritative Vedic texts with source attribution and reliability metrics',
      mimeType: 'application/json'
    }
  ]
}));

// Handle resource reads
server.setRequestHandler(ReadResourceRequestSchema, async (request: ReadResourceRequest) => {
  const { uri } = request.params;

  switch (uri) {
    case 'sanskrit://agents':
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            agents: agentRegistry.getAllAgents(),
            statistics: agentRegistry.getStatistics()
          }, null, 2)
        }]
      };

    case 'sanskrit://conversations':
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            recentLogs: sanskritProtocol.getRecentCommunications(10),
            statistics: sanskritProtocol.getStatistics()
          }, null, 2)
        }]
      };

    case 'sanskrit://vocabulary':
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            cacheStats: translationService.getCacheStats(),
            culturalNotes: {
              "dharma": "Righteousness, duty, law, and natural order - fundamental concept in Indian philosophy",
              "karma": "Action and its consequences across lifetimes - law of cause and effect",
              "yoga": "Union/connection - spiritual practice for self-realization",
              "namaste": "Traditional greeting meaning 'I bow to you' - recognizing the divine in others"
            }
          }, null, 2)
        }]
      };

    case 'sanskrit://vedic-corpus':
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            corpusStatistics: vedicCorpus.getCorpusStatistics(),
            description: "Authoritative Vedic knowledge base with anti-hallucination safeguards",
            features: [
              "Source attribution for every statement",
              "Reliability scoring based on manuscript tradition",
              "Commentary integration from traditional ācāryas",
              "Confidence-based response filtering",
              "Multi-layered verification system"
            ],
            usage: "Use the 'query_vedic_knowledge' tool to access this corpus with full source citations"
          }, null, 2)
        }]
      };

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// Transport setup
async function main() {
  const transport = new StdioServerTransport();
  
  // Enhanced logging for MCP Inspector
  console.error('🕉️ Sanskrit Agent MCP Server starting...');
  console.error('📊 Server Info:', {
    name: 'sanskrit-agent-communication',
    version: '1.0.0',
    description: 'MCP server for Sanskrit agent communication with real-time translation'
  });
  console.error('🛠️ Available Tools: register_agent, send_sanskrit_message, translate_sanskrit, get_agent_status, analyze_conversation, query_vedic_knowledge');
  console.error('📚 Available Resources: sanskrit://agents, sanskrit://conversations, sanskrit://vocabulary, sanskrit://vedic-corpus');
  
  await server.connect(transport);
  console.error('✅ Sanskrit Agent MCP Server running and ready for connections...');
  console.error('🔍 Use MCP Inspector to test: npx @modelcontextprotocol/inspector');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}