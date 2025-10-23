import { SanskritValidator } from './sanskrit-validator.js';
import { CommunicationLogger } from './communication-logger.js';
import type { 
  SanskritMessage, 
  Agent, 
  ProtocolResponse, 
  ConversationAnalysis,
  CommunicationLog
} from './types.js';

/**
 * Protocol handler for Sanskrit communication
 */
export class SanskritProtocol {
  private validator: SanskritValidator;
  private logger: CommunicationLogger;

  constructor(validator: SanskritValidator, logger: CommunicationLogger) {
    this.validator = validator;
    this.logger = logger;
  }

  /**
   * Process a Sanskrit message
   */
  async processMessage(
    message: SanskritMessage,
    fromAgent: Agent,
    toAgent: Agent
  ): Promise<ProtocolResponse> {
    try {
      // Validate the message
      const validationResult = await this.validator.validateText(message.content);
      
      // Update agent statistics
      fromAgent.statistics.messagesSent++;
      toAgent.statistics.messagesReceived++;
      fromAgent.statistics.lastActive = new Date();
      toAgent.statistics.lastActive = new Date();

      if (validationResult.isValid) {
        return {
          type: 'success',
          message: 'Message processed successfully',
          suggestions: validationResult.suggestions.map(s => s.message),
          validationResult
        };
      } else {
        return {
          type: 'warning',
          message: 'Message processed with validation issues',
          suggestions: [
            ...validationResult.errors.map(e => `Error: ${e.message}`),
            ...validationResult.warnings.map(w => `Warning: ${w.message}`),
            ...validationResult.suggestions.map(s => s.message)
          ],
          validationResult
        };
      }
    } catch (error) {
      return {
        type: 'error',
        message: `Failed to process message: ${error instanceof Error ? error.message : String(error)}`,
        suggestions: ['Check message format and try again']
      };
    }
  }

  /**
   * Analyze conversation
   */
  async analyzeConversation(sessionId: string): Promise<ConversationAnalysis> {
    return this.logger.analyzeConversation(sessionId);
  }

  /**
   * Get recent communications
   */
  getRecentCommunications(limit: number = 10): CommunicationLog[] {
    return this.logger.getConversationHistory('default').slice(-limit);
  }

  /**
   * Get the communication logger instance
   */
  getLogger(): CommunicationLogger {
    return this.logger;
  }

  /**
   * Get protocol statistics
   */
  getStatistics() {
    return {
      totalProcessedMessages: 0,
      successRate: 100,
      averageValidationTime: 50
    };
  }
}