import type { Agent, SanskritCapabilities, AgentStatistics } from './types.js';

/**
 * Sanskrit-capable AI agent class
 */
export class SanskritAgent implements Agent {
  public id: string;
  public name: string;
  public description?: string;
  public capabilities: string[];
  public sanskritCapabilities: SanskritCapabilities;
  public statistics: AgentStatistics;
  public isActive: boolean;
  public lastSeen: Date;

  constructor(config: {
    id: string;
    name: string;
    description?: string;
    capabilities?: string[];
    sanskritCapabilities?: Partial<SanskritCapabilities>;
  }) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.capabilities = config.capabilities || ['text_processing', 'conversation'];
    
    // Add Sanskrit capabilities
    if (!this.capabilities.includes('sanskrit_communication')) {
      this.capabilities.push('sanskrit_communication');
    }

    this.sanskritCapabilities = {
      canRead: true,
      canWrite: true,
      formality: 'moderate',
      comprehensionLevel: 'intermediate',
      ...config.sanskritCapabilities
    };

    this.statistics = {
      messagesSent: 0,
      messagesReceived: 0,
      lastActive: new Date(),
      averageResponseTime: 0,
      errorCount: 0
    };

    this.isActive = true;
    this.lastSeen = new Date();
  }

  /**
   * Check if agent has a specific capability
   */
  hasCapability(capability: string): boolean {
    return this.capabilities.includes(capability);
  }

  /**
   * Add a capability to the agent
   */
  addCapability(capability: string): void {
    if (!this.hasCapability(capability)) {
      this.capabilities.push(capability);
    }
  }

  /**
   * Remove a capability from the agent
   */
  removeCapability(capability: string): void {
    const index = this.capabilities.indexOf(capability);
    if (index !== -1) {
      this.capabilities.splice(index, 1);
    }
  }

  /**
   * Update Sanskrit capabilities
   */
  updateSanskritCapabilities(updates: Partial<SanskritCapabilities>): void {
    this.sanskritCapabilities = { ...this.sanskritCapabilities, ...updates };
  }

  /**
   * Record a sent message
   */
  recordMessageSent(responseTime?: number): void {
    this.statistics.messagesSent++;
    this.statistics.lastActive = new Date();
    this.lastSeen = new Date();
    
    if (responseTime) {
      // Update rolling average
      const totalMessages = this.statistics.messagesSent + this.statistics.messagesReceived;
      this.statistics.averageResponseTime = 
        (this.statistics.averageResponseTime * (totalMessages - 1) + responseTime) / totalMessages;
    }
  }

  /**
   * Record a received message
   */
  recordMessageReceived(): void {
    this.statistics.messagesReceived++;
    this.statistics.lastActive = new Date();
    this.lastSeen = new Date();
  }

  /**
   * Record an error
   */
  recordError(): void {
    this.statistics.errorCount++;
  }

  /**
   * Mark agent as active
   */
  setActive(active: boolean): void {
    this.isActive = active;
    if (active) {
      this.lastSeen = new Date();
    }
  }

  /**
   * Get agent activity status
   */
  getActivityStatus(): 'active' | 'idle' | 'offline' {
    const now = new Date();
    const timeSinceLastSeen = now.getTime() - this.lastSeen.getTime();
    const minutesSinceLastSeen = timeSinceLastSeen / (1000 * 60);

    if (!this.isActive) {
      return 'offline';
    } else if (minutesSinceLastSeen < 5) {
      return 'active';
    } else {
      return 'idle';
    }
  }

  /**
   * Get formatted statistics
   */
  getFormattedStatistics(): string {
    const activityStatus = this.getActivityStatus();
    const totalMessages = this.statistics.messagesSent + this.statistics.messagesReceived;
    const errorRate = totalMessages > 0 ? 
      Math.round((this.statistics.errorCount / totalMessages) * 100) : 0;

    return `📊 Statistics for ${this.name}:
🆔 ID: ${this.id}
📊 Status: ${activityStatus}
💬 Messages Sent: ${this.statistics.messagesSent}
📨 Messages Received: ${this.statistics.messagesReceived}
⚡ Avg Response Time: ${Math.round(this.statistics.averageResponseTime)}ms
❌ Error Rate: ${errorRate}%
⏰ Last Active: ${this.statistics.lastActive.toLocaleString()}
🕉️ Sanskrit Level: ${this.sanskritCapabilities.comprehensionLevel}
📝 Formality: ${this.sanskritCapabilities.formality}`;
  }

  /**
   * Check if agent can communicate in Sanskrit
   */
  canCommunicateInSanskrit(): boolean {
    return this.sanskritCapabilities.canRead && this.sanskritCapabilities.canWrite;
  }

  /**
   * Get compatibility score with another agent
   */
  getCompatibilityScore(otherAgent: SanskritAgent): number {
    let score = 0;

    // Base compatibility if both can communicate in Sanskrit
    if (this.canCommunicateInSanskrit() && otherAgent.canCommunicateInSanskrit()) {
      score += 50;
    }

    // Formality compatibility
    const formalityLevels = ['casual', 'moderate', 'formal'];
    const thisFormalityIndex = formalityLevels.indexOf(this.sanskritCapabilities.formality);
    const otherFormalityIndex = formalityLevels.indexOf(otherAgent.sanskritCapabilities.formality);
    const formalityDiff = Math.abs(thisFormalityIndex - otherFormalityIndex);
    score += (2 - formalityDiff) * 15; // 30 points for same formality, 15 for adjacent, 0 for opposite

    // Comprehension level compatibility
    const comprehensionLevels = ['basic', 'intermediate', 'advanced', 'scholarly'];
    const thisCompLevel = comprehensionLevels.indexOf(this.sanskritCapabilities.comprehensionLevel || 'intermediate');
    const otherCompLevel = comprehensionLevels.indexOf(otherAgent.sanskritCapabilities.comprehensionLevel || 'intermediate');
    const compDiff = Math.abs(thisCompLevel - otherCompLevel);
    score += (3 - compDiff) * 5; // 15 points for same level, decreasing for differences

    // Shared capabilities
    const sharedCapabilities = this.capabilities.filter(cap => 
      otherAgent.capabilities.includes(cap)
    );
    score += sharedCapabilities.length * 2;

    return Math.min(100, score);
  }

  /**
   * Update agent from configuration
   */
  updateFromConfig(config: Partial<{
    name: string;
    description: string;
    capabilities: string[];
    sanskritCapabilities: Partial<SanskritCapabilities>;
  }>): void {
    if (config.name) this.name = config.name;
    if (config.description) this.description = config.description;
    if (config.capabilities) this.capabilities = config.capabilities;
    if (config.sanskritCapabilities) {
      this.updateSanskritCapabilities(config.sanskritCapabilities);
    }
  }

  /**
   * Convert agent to JSON
   */
  toJSON(): Agent {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      capabilities: [...this.capabilities],
      sanskritCapabilities: { ...this.sanskritCapabilities },
      statistics: { ...this.statistics },
      isActive: this.isActive,
      lastSeen: this.lastSeen
    };
  }

  /**
   * Create agent from JSON
   */
  static fromJSON(data: Agent): SanskritAgent {
    const agent = new SanskritAgent({
      id: data.id,
      name: data.name,
      description: data.description,
      capabilities: data.capabilities,
      sanskritCapabilities: data.sanskritCapabilities
    });

    agent.statistics = data.statistics;
    agent.isActive = data.isActive;
    agent.lastSeen = new Date(data.lastSeen);

    return agent;
  }

  /**
   * Clone the agent
   */
  clone(): SanskritAgent {
    return SanskritAgent.fromJSON(this.toJSON());
  }
}