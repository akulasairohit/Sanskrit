/**
 * Core agent interface
 */
export interface Agent {
  id: string;
  name: string;
  description?: string;
  capabilities: string[];
  sanskritCapabilities: SanskritCapabilities;
  statistics: AgentStatistics;
  isActive: boolean;
  lastSeen: Date;
}

/**
 * Sanskrit-specific capabilities
 */
export interface SanskritCapabilities {
  canRead: boolean;
  canWrite: boolean;
  dialectPreference?: string;
  formality: 'formal' | 'moderate' | 'casual';
  comprehensionLevel?: 'basic' | 'intermediate' | 'advanced' | 'scholarly';
}

/**
 * Agent usage statistics
 */
export interface AgentStatistics {
  messagesSent: number;
  messagesReceived: number;
  lastActive: Date;
  averageResponseTime: number;
  errorCount: number;
}

/**
 * Sanskrit message structure
 */
export interface SanskritMessage {
  id: string;
  content: string;
  timestamp: Date;
  language: 'sanskrit' | 'english' | 'mixed';
  metadata?: MessageMetadata;
}

/**
 * Message metadata
 */
export interface MessageMetadata {
  formality?: 'formal' | 'moderate' | 'casual';
  context?: string;
  translationConfidence?: number;
  culturalContext?: boolean;
  validationResult?: ValidationResult;
  originalLanguage?: string;
}

/**
 * Validation result structure
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ValidationSuggestion[];
  confidence: number;
  grammaticalAnalysis?: GrammaticalAnalysis;
  grammarPatterns?: {
    sandhi: number;
    samasa: number;
    vibhakti: number;
    dhatu: number;
  };
}

/**
 * Validation error
 */
export interface ValidationError {
  type: string;
  message: string;
  position: number;
  severity: 'low' | 'medium' | 'high';
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  type: string;
  message: string;
  position: number;
  severity: 'low' | 'medium' | 'high';
}

/**
 * Validation suggestion
 */
export interface ValidationSuggestion {
  type: string;
  message: string;
  position: number;
  severity: 'low' | 'medium' | 'high';
}

/**
 * Grammatical analysis
 */
export interface GrammaticalAnalysis {
  words: WordAnalysis[];
  compounds: CompoundAnalysis[];
  sandhiJoints: SandhiAnalysis[];
  meter?: MeterAnalysis;
  parseErrors: string[];
}

/**
 * Word analysis
 */
export interface WordAnalysis {
  word: string;
  stem: string;
  grammaticalInfo: GrammaticalInfo;
  possibleMeanings: string[];
  morphology: MorphologyInfo;
}

/**
 * Grammatical information
 */
export interface GrammaticalInfo {
  partOfSpeech: string;
  case?: string;
  number?: string;
  gender?: string;
  person?: string;
  tense?: string;
  mood?: string;
}

/**
 * Morphology information
 */
export interface MorphologyInfo {
  root: string;
  affixes: string[];
  formation: string;
}

/**
 * Compound analysis
 */
export interface CompoundAnalysis {
  original: string;
  parts: string[];
  type: string;
}

/**
 * Sandhi analysis
 */
export interface SandhiAnalysis {
  position: number;
  words: string[];
  issue: string;
  suggestion?: string;
}

/**
 * Meter analysis
 */
export interface MeterAnalysis {
  syllableCount: number;
  pattern: string;
  knownMeter?: string;
  irregularities: string[];
}

/**
 * Translation options
 */
export interface TranslationOptions {
  includeTransliteration: boolean;
  culturalContext: boolean;
  preserveMetrics: boolean;
  formality: 'formal' | 'moderate' | 'casual';
}

/**
 * Sanskrit validation rules
 */
export interface SanskritValidationRules {
  allowedScripts: string[];
  requireProperSandhi: boolean;
  strictGrammar: boolean;
  allowModernUsage: boolean;
  checkMeter: boolean;
  culturalContext: boolean;
  formalityLevel: 'formal' | 'moderate' | 'casual';
}

/**
 * Agent interaction record
 */
export interface AgentInteraction {
  fromAgent: string;
  toAgent: string;
  message: SanskritMessage;
  translatedMessage?: string;
  type: 'direct' | 'broadcast' | 'response';
  sessionId: string;
  success: boolean;
  responseTime?: number;
  error?: string;
}

/**
 * Communication log entry
 */
export interface CommunicationLog {
  id: string;
  timestamp: Date;
  fromAgent: string;
  toAgent: string;
  message: SanskritMessage;
  translatedMessage?: string;
  communicationType: 'direct' | 'broadcast' | 'response';
  sessionId: string;
  success: boolean;
  responseTime?: number;
  metadata?: {
    messageLength: number;
    translationConfidence?: number;
    culturalContext?: boolean;
    formality?: string;
    validationResult?: ValidationResult;
  };
}

/**
 * Conversation analysis
 */
export interface ConversationAnalysis {
  sessionId: string;
  totalMessages: number;
  participants: string[];
  timespan: {
    start: Date;
    end: Date;
    duration: number;
  };
  messageFlow: MessageFlow[];
  languageStatistics: LanguageStatistics;
  culturalElements: CulturalElements;
  communicationEfficiency: CommunicationEfficiency;
  topicProgression: TopicProgression[];
  formalityTrends: FormalityTrend[];
  translationAccuracy: TranslationAccuracy;
}

/**
 * Message flow analysis
 */
export interface MessageFlow {
  sequence: number;
  fromAgent: string;
  toAgent: string;
  timestamp: Date;
  messageType: string;
  responseTime?: number;
}

/**
 * Language usage statistics
 */
export interface LanguageStatistics {
  sanskritMessages: number;
  englishMessages: number;
  averageMessageLength: number;
  vocabularyRichness: number;
}

/**
 * Cultural elements analysis
 */
export interface CulturalElements {
  religiousReferences: number;
  philosophicalConcepts: number;
  traditionalGreetings: number;
  honorifics: number;
}

/**
 * Communication efficiency metrics
 */
export interface CommunicationEfficiency {
  averageResponseTime: number;
  messageSuccessRate: number;
  translationAccuracy: number;
}

/**
 * Topic progression tracking
 */
export interface TopicProgression {
  sequence: number;
  timestamp: Date;
  topic: string;
  participants: string[];
}

/**
 * Formality trend analysis
 */
export interface FormalityTrend {
  sequence: number;
  timestamp: Date;
  formality: string;
  agent: string;
}

/**
 * Translation accuracy analysis
 */
export interface TranslationAccuracy {
  overallAccuracy: number;
  commonErrors: string[];
  improvementSuggestions: string[];
}

/**
 * Protocol response
 */
export interface ProtocolResponse {
  type: 'success' | 'warning' | 'error';
  message: string;
  suggestions: string[];
  validationResult?: ValidationResult;
  translatedContent?: string;
}

/**
 * Agent registry statistics
 */
export interface RegistryStatistics {
  totalAgents: number;
  activeAgents: number;
  sanskritCapableAgents: number;
  totalMessages: number;
  activeSessions: number;
}