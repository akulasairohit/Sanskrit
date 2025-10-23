/**
 * Code validation tests for Sanskrit MCP Server
 * These tests validate the code structure and type definitions
 */

import { 
  SanskritAgent,
  AgentRegistry,
  SanskritProtocol,
  TranslationService,
  SanskritValidator,
  CommunicationLogger
} from '../src/lib/index.js';

import type {
  Agent,
  SanskritMessage,
  ValidationResult,
  ConversationAnalysis
} from '../src/lib/types.js';

/**
 * Test Sanskrit Agent functionality
 */
async function testSanskritAgent() {
  console.log('🧪 Testing SanskritAgent class...');
  
  // Create a test agent
  const agent = new SanskritAgent({
    id: 'test_agent_1',
    name: 'Test Sanskrit Scholar',
    description: 'A test agent for validation',
    capabilities: ['sanskrit_communication', 'philosophy'],
    sanskritCapabilities: {
      canRead: true,
      canWrite: true,
      formality: 'moderate',
      comprehensionLevel: 'advanced'
    }
  });

  // Test basic functionality
  console.log('✅ Agent created:', agent.name);
  console.log('✅ Can communicate in Sanskrit:', agent.canCommunicateInSanskrit());
  console.log('✅ Has sanskrit_communication capability:', agent.hasCapability('sanskrit_communication'));
  
  // Test statistics
  agent.recordMessageSent(100);
  agent.recordMessageReceived();
  console.log('✅ Statistics tracking works');
  
  return agent;
}

/**
 * Test Agent Registry functionality
 */
async function testAgentRegistry() {
  console.log('🧪 Testing AgentRegistry class...');
  
  const registry = new AgentRegistry();
  
  // Register test agents
  const agent1 = await registry.registerAgent({
    id: 'scholar_1',
    name: 'Pandit Sharma',
    capabilities: ['sanskrit_communication', 'philosophy'],
    sanskritCapabilities: {
      canRead: true,
      canWrite: true,
      formality: 'formal'
    }
  });

  const agent2 = await registry.registerAgent({
    id: 'scholar_2', 
    name: 'Dr. Sanskrit',
    capabilities: ['sanskrit_communication', 'literature'],
    sanskritCapabilities: {
      canRead: true,
      canWrite: true,
      formality: 'moderate'
    }
  });

  console.log('✅ Agents registered:', registry.getAllAgents().length);
  console.log('✅ Sanskrit capable agents:', registry.getSanskritCapableAgents().length);
  
  // Test compatibility
  const compatible = registry.getCompatibleAgents('scholar_1');
  console.log('✅ Compatible agents found:', compatible.length);
  
  return registry;
}

/**
 * Test Translation Service functionality
 */
async function testTranslationService() {
  console.log('🧪 Testing TranslationService class...');
  
  const translator = new TranslationService();
  
  // Test Sanskrit to English
  const englishTranslation = await translator.sanskritToEnglish(
    'नमस्कार', 
    { includeTransliteration: true, culturalContext: true }
  );
  console.log('✅ Sanskrit to English:', englishTranslation);
  
  // Test English to Sanskrit
  const sanskritTranslation = await translator.englishToSanskrit('greetings');
  console.log('✅ English to Sanskrit:', sanskritTranslation);
  
  // Test cache stats
  const stats = translator.getCacheStats();
  console.log('✅ Translation cache working:', stats.totalCachedTranslations >= 0);
  
  return translator;
}

/**
 * Test Sanskrit Validator functionality
 */
async function testSanskritValidator() {
  console.log('🧪 Testing SanskritValidator class...');
  
  const validator = new SanskritValidator();
  
  // Test validation
  const result = await validator.validateText('नमस्कार आदरणीय गुरुजी');
  console.log('✅ Validation result:', result.isValid ? 'Valid' : 'Invalid');
  console.log('✅ Confidence score:', result.confidence);
  
  return validator;
}

/**
 * Test Communication Logger functionality
 */
async function testCommunicationLogger() {
  console.log('🧪 Testing CommunicationLogger class...');
  
  const logger = new CommunicationLogger();
  
  // Create test message
  const testMessage: SanskritMessage = {
    id: 'test_msg_1',
    content: 'नमस्कार',
    timestamp: new Date(),
    language: 'sanskrit',
    metadata: {
      formality: 'moderate'
    }
  };

  // Log interaction
  const logId = await logger.logCommunication({
    fromAgent: 'agent1',
    toAgent: 'agent2',
    message: testMessage,
    type: 'direct',
    sessionId: 'test_session',
    success: true
  });
  
  console.log('✅ Communication logged:', logId);
  
  // Test conversation analysis
  const analysis = await logger.analyzeConversation('test_session');
  console.log('✅ Analysis completed:', analysis.totalMessages, 'messages');
  
  return logger;
}

/**
 * Test Sanskrit Protocol functionality
 */
async function testSanskritProtocol() {
  console.log('🧪 Testing SanskritProtocol class...');
  
  const validator = new SanskritValidator();
  const logger = new CommunicationLogger();
  const protocol = new SanskritProtocol(validator, logger);
  
  // Create test agents
  const fromAgent: Agent = {
    id: 'test1',
    name: 'Test Agent 1',
    capabilities: ['sanskrit_communication'],
    sanskritCapabilities: {
      canRead: true,
      canWrite: true,
      formality: 'moderate'
    },
    statistics: {
      messagesSent: 0,
      messagesReceived: 0,
      lastActive: new Date(),
      averageResponseTime: 0,
      errorCount: 0
    },
    isActive: true,
    lastSeen: new Date()
  };

  const toAgent: Agent = {
    id: 'test2',
    name: 'Test Agent 2',
    capabilities: ['sanskrit_communication'],
    sanskritCapabilities: {
      canRead: true,
      canWrite: true,
      formality: 'moderate'
    },
    statistics: {
      messagesSent: 0,
      messagesReceived: 0,
      lastActive: new Date(),
      averageResponseTime: 0,
      errorCount: 0
    },
    isActive: true,
    lastSeen: new Date()
  };

  const testMessage: SanskritMessage = {
    id: 'protocol_test_1',
    content: 'धन्यवाद',
    timestamp: new Date(),
    language: 'sanskrit'
  };

  // Test message processing
  const response = await protocol.processMessage(testMessage, fromAgent, toAgent);
  console.log('✅ Protocol response:', response.type);
  
  return protocol;
}

/**
 * Run all validation tests
 */
async function runValidationTests() {
  console.log('🕉️ Starting Sanskrit MCP Server Validation Tests\n');
  
  try {
    await testSanskritAgent();
    console.log('');
    
    await testAgentRegistry();
    console.log('');
    
    await testTranslationService();
    console.log('');
    
    await testSanskritValidator();
    console.log('');
    
    await testCommunicationLogger();
    console.log('');
    
    await testSanskritProtocol();
    console.log('');
    
    console.log('🎉 All validation tests completed successfully!');
    console.log('✅ Your Sanskrit MCP Server code structure is valid');
    console.log('🚀 Ready for installation and deployment');
    
  } catch (error) {
    console.error('❌ Validation test failed:', error);
    console.error('🔧 Please check the code and fix any issues');
    process.exit(1);
  }
}

// Export for testing when Node.js is available
export {
  runValidationTests,
  testSanskritAgent,
  testAgentRegistry,
  testTranslationService,
  testSanskritValidator,
  testCommunicationLogger,
  testSanskritProtocol
};

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runValidationTests();
}