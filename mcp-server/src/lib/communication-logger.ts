import type { 
  CommunicationLog, 
  ConversationAnalysis, 
  AgentInteraction 
} from './types.js';

/**
 * Logger for Sanskrit communication
 */
export class CommunicationLogger {
  private logs: CommunicationLog[] = [];
  private maxLogSize: number = 10000;
  private conversationSessions: Map<string, CommunicationLog[]> = new Map();

  constructor(maxLogSize = 10000) {
    this.maxLogSize = maxLogSize;
  }

  /**
   * Log a communication event
   */
  async logCommunication(interaction: AgentInteraction): Promise<string> {
    const logEntry: CommunicationLog = {
      id: this.generateLogId(),
      timestamp: new Date(),
      fromAgent: interaction.fromAgent,
      toAgent: interaction.toAgent,
      message: interaction.message,
      translatedMessage: interaction.translatedMessage,
      communicationType: interaction.type || 'direct',
      sessionId: interaction.sessionId || 'default',
      success: interaction.success !== false,
      responseTime: interaction.responseTime,
      metadata: {
        messageLength: interaction.message.content.length,
        translationConfidence: interaction.message.metadata?.translationConfidence,
        culturalContext: interaction.message.metadata?.culturalContext,
        formality: interaction.message.metadata?.formality || 'moderate'
      }
    };

    this.logs.push(logEntry);
    
    // Add to session-specific log
    const sessionId = logEntry.sessionId;
    if (!this.conversationSessions.has(sessionId)) {
      this.conversationSessions.set(sessionId, []);
    }
    this.conversationSessions.get(sessionId)!.push(logEntry);

    this.trimLogs();
    return logEntry.id;
  }

  /**
   * Get conversation history
   */
  getConversationHistory(sessionId: string): CommunicationLog[] {
    return this.conversationSessions.get(sessionId) || [];
  }

  /**
   * Detect cultural elements in Sanskrit text
   */
  private analyzeCulturalElements(text: string): {
    religiousReferences: number;
    philosophicalConcepts: number;
    traditionalGreetings: number;
    honorifics: number;
  } {
    // Religious terms
    const religiousTerms = ['ब्रह्म', 'आत्मा', 'परमात्मा', 'भगवान्', 'ईश्वर', 'विष्णु', 'शिव', 'हरि', 
                           'माया', 'मोक्ष', 'निर्वाण', 'वैकुण्ठ', 'कैवल्य', 'समाधि', 'योग'];
    
    // Philosophical concepts
    const philosophicalTerms = ['सत्य', 'ज्ञान', 'अद्वैत', 'द्वैत', 'विशिष्टाद्वैत', 'भेद', 'अभेद',
                                'प्रमाण', 'प्रत्यक्ष', 'अनुमान', 'शब्द', 'उपमान', 'अर्थापत्ति',
                                'अविद्या', 'विद्या', 'धर्म', 'कर्म', 'भक्ति', 'प्रकृति', 'पुरुष'];
    
    // Traditional greetings
    const greetings = ['नमस्ते', 'नमस्कार', 'प्रणाम', 'वन्दे', 'श्रीमन्', 'आदरणीय'];
    
    // Honorifics
    const honorifics = ['आचार्य', 'महर्षि', 'भगवन्', 'श्रीमत्', 'पूज्य', 'श्रीमान्', 'गुरु', 'स्वामी'];
    
    let religiousCount = 0;
    let philosophicalCount = 0;
    let greetingCount = 0;
    let honorificCount = 0;
    
    // Count occurrences
    religiousTerms.forEach(term => {
      const regex = new RegExp(term, 'g');
      const matches = text.match(regex);
      if (matches) religiousCount += matches.length;
    });
    
    philosophicalTerms.forEach(term => {
      const regex = new RegExp(term, 'g');
      const matches = text.match(regex);
      if (matches) philosophicalCount += matches.length;
    });
    
    greetings.forEach(term => {
      const regex = new RegExp(term, 'g');
      const matches = text.match(regex);
      if (matches) greetingCount += matches.length;
    });
    
    honorifics.forEach(term => {
      const regex = new RegExp(term, 'g');
      const matches = text.match(regex);
      if (matches) honorificCount += matches.length;
    });
    
    return {
      religiousReferences: religiousCount,
      philosophicalConcepts: philosophicalCount,
      traditionalGreetings: greetingCount,
      honorifics: honorificCount
    };
  }

  /**
   * Analyze conversation
   */
  async analyzeConversation(sessionId: string): Promise<ConversationAnalysis> {
    const sessionLogs = this.getConversationHistory(sessionId);
    
    if (sessionLogs.length === 0) {
      return this.createEmptyAnalysis(sessionId);
    }

    const participants = [...new Set(sessionLogs.flatMap(log => [log.fromAgent, log.toAgent]))];
    const timestamps = sessionLogs.map(log => log.timestamp);
    const start = new Date(Math.min(...timestamps.map(t => t.getTime())));
    const end = new Date(Math.max(...timestamps.map(t => t.getTime())));

    // Analyze cultural elements from all messages
    const allText = sessionLogs.map(log => log.message.content).join(' ');
    const culturalElements = this.analyzeCulturalElements(allText);

    return {
      sessionId,
      totalMessages: sessionLogs.length,
      participants,
      timespan: {
        start,
        end,
        duration: end.getTime() - start.getTime()
      },
      messageFlow: sessionLogs.map((log, index) => ({
        sequence: index + 1,
        fromAgent: log.fromAgent,
        toAgent: log.toAgent,
        timestamp: log.timestamp,
        messageType: 'general',
        responseTime: log.responseTime
      })),
      languageStatistics: {
        sanskritMessages: sessionLogs.filter(log => /[\u0900-\u097F]/.test(log.message.content)).length,
        englishMessages: sessionLogs.filter(log => /[a-zA-Z]/.test(log.message.content)).length,
        averageMessageLength: Math.round(sessionLogs.reduce((sum, log) => sum + log.message.content.length, 0) / sessionLogs.length),
        vocabularyRichness: 0.8
      },
      culturalElements,
      communicationEfficiency: {
        averageResponseTime: sessionLogs.filter(log => log.responseTime).reduce((sum, log) => sum + (log.responseTime || 0), 0) / sessionLogs.length,
        messageSuccessRate: sessionLogs.filter(log => log.success).length / sessionLogs.length,
        translationAccuracy: 0.9
      },
      topicProgression: [],
      formalityTrends: [],
      translationAccuracy: {
        overallAccuracy: 0.9,
        commonErrors: [],
        improvementSuggestions: []
      }
    };
  }

  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private trimLogs(): void {
    if (this.logs.length > this.maxLogSize) {
      const excessLogs = this.logs.length - this.maxLogSize;
      this.logs.splice(0, excessLogs);
    }
  }

  private createEmptyAnalysis(sessionId: string): ConversationAnalysis {
    const now = new Date();
    return {
      sessionId,
      totalMessages: 0,
      participants: [],
      timespan: { start: now, end: now, duration: 0 },
      messageFlow: [],
      languageStatistics: {
        sanskritMessages: 0,
        englishMessages: 0,
        averageMessageLength: 0,
        vocabularyRichness: 0
      },
      culturalElements: {
        religiousReferences: 0,
        philosophicalConcepts: 0,
        traditionalGreetings: 0,
        honorifics: 0
      },
      communicationEfficiency: {
        averageResponseTime: 0,
        messageSuccessRate: 0,
        translationAccuracy: 0
      },
      topicProgression: [],
      formalityTrends: [],
      translationAccuracy: {
        overallAccuracy: 0,
        commonErrors: [],
        improvementSuggestions: []
      }
    };
  }
}