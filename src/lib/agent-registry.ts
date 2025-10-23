import { SanskritAgent } from './sanskrit-agent.js';
import type { Agent, RegistryStatistics } from './types.js';

/**
 * Registry for managing Sanskrit-capable AI agents
 */
export class AgentRegistry {
  private agents: Map<string, SanskritAgent> = new Map();
  private sessionMessages: Map<string, number> = new Map();

  /**
   * Register a new agent
   */
  async registerAgent(config: {
    id: string;
    name: string;
    description?: string;
    capabilities?: string[];
    sanskritCapabilities?: any;
  }): Promise<SanskritAgent> {
    if (this.agents.has(config.id)) {
      throw new Error(`Agent with ID ${config.id} already exists`);
    }

    const agent = new SanskritAgent(config);
    this.agents.set(config.id, agent);
    
    return agent;
  }

  /**
   * Get agent by ID
   */
  getAgent(id: string): SanskritAgent | undefined {
    return this.agents.get(id);
  }

  /**
   * Get all registered agents
   */
  getAllAgents(): SanskritAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Find agents by capability
   */
  findAgentsByCapability(capability: string): SanskritAgent[] {
    return this.getAllAgents().filter(agent => 
      agent.hasCapability(capability)
    );
  }

  /**
   * Get Sanskrit-capable agents
   */
  getSanskritCapableAgents(): SanskritAgent[] {
    return this.getAllAgents().filter(agent => 
      agent.canCommunicateInSanskrit()
    );
  }

  /**
   * Remove agent
   */
  removeAgent(id: string): boolean {
    return this.agents.delete(id);
  }

  /**
   * Update agent activity
   */
  updateAgentActivity(id: string): void {
    const agent = this.getAgent(id);
    if (agent) {
      agent.setActive(true);
    }
  }

  /**
   * Get registry statistics
   */
  getStatistics(): RegistryStatistics {
    const allAgents = this.getAllAgents();
    const activeAgents = allAgents.filter(agent => agent.isActive);
    const sanskritCapable = allAgents.filter(agent => agent.canCommunicateInSanskrit());
    
    const totalMessages = allAgents.reduce((sum, agent) => 
      sum + agent.statistics.messagesSent + agent.statistics.messagesReceived, 0
    );

    const activeSessions = this.sessionMessages.size;

    return {
      totalAgents: allAgents.length,
      activeAgents: activeAgents.length,
      sanskritCapableAgents: sanskritCapable.length,
      totalMessages,
      activeSessions
    };
  }

  /**
   * Record message for session
   */
  recordSessionMessage(sessionId: string): void {
    const current = this.sessionMessages.get(sessionId) || 0;
    this.sessionMessages.set(sessionId, current + 1);
  }

  /**
   * Get compatible agents for communication
   */
  getCompatibleAgents(agentId: string, minCompatibility: number = 70): SanskritAgent[] {
    const sourceAgent = this.getAgent(agentId);
    if (!sourceAgent) return [];

    return this.getAllAgents()
      .filter(agent => agent.id !== agentId)
      .filter(agent => sourceAgent.getCompatibilityScore(agent) >= minCompatibility)
      .sort((a, b) => 
        sourceAgent.getCompatibilityScore(b) - sourceAgent.getCompatibilityScore(a)
      );
  }
}