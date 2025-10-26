"""Agent registry for managing Sanskrit-capable agents."""

from datetime import datetime
from typing import Optional

from .types import Agent, RegistryStatistics


class AgentRegistry:
    """Registry for managing Sanskrit-capable agents."""

    def __init__(self) -> None:
        """Initialize empty agent registry."""
        self._agents: dict[str, Agent] = {}
        self._total_messages = 0

    def register_agent(self, agent: Agent) -> None:
        """
        Register a new agent.

        Args:
            agent: Agent to register
        """
        self._agents[agent.id] = agent

    def get_agent(self, agent_id: str) -> Optional[Agent]:
        """
        Get agent by ID.

        Args:
            agent_id: Agent identifier

        Returns:
            Agent if found, None otherwise
        """
        return self._agents.get(agent_id)

    def get_all_agents(self) -> list[Agent]:
        """
        Get all registered agents.

        Returns:
            List of all agents
        """
        return list(self._agents.values())

    def record_message(self, from_agent_id: str, to_agent_id: str) -> None:
        """
        Record a message between agents.

        Args:
            from_agent_id: Sender agent ID
            to_agent_id: Receiver agent ID
        """
        self._total_messages += 1

        # Update sender statistics
        from_agent = self._agents.get(from_agent_id)
        if from_agent:
            from_agent.statistics.messages_sent += 1
            from_agent.statistics.last_active = datetime.now()
            from_agent.last_seen = datetime.now()

        # Update receiver statistics
        to_agent = self._agents.get(to_agent_id)
        if to_agent:
            to_agent.statistics.messages_received += 1
            to_agent.statistics.last_active = datetime.now()
            to_agent.last_seen = datetime.now()

    def get_statistics(self) -> RegistryStatistics:
        """
        Get registry statistics.

        Returns:
            RegistryStatistics with current metrics
        """
        total = len(self._agents)
        active = sum(1 for agent in self._agents.values() if agent.is_active)
        sanskrit_capable = sum(
            1
            for agent in self._agents.values()
            if agent.sanskrit_capabilities.can_read or agent.sanskrit_capabilities.can_write
        )

        return RegistryStatistics(
            total_agents=total,
            active_agents=active,
            sanskrit_capable_agents=sanskrit_capable,
            total_messages=self._total_messages,
            active_sessions=0,  # Placeholder
        )

    def deactivate_agent(self, agent_id: str) -> bool:
        """
        Deactivate an agent.

        Args:
            agent_id: Agent ID to deactivate

        Returns:
            True if agent was deactivated, False if not found
        """
        agent = self._agents.get(agent_id)
        if agent:
            agent.is_active = False
            return True
        return False

    def activate_agent(self, agent_id: str) -> bool:
        """
        Activate an agent.

        Args:
            agent_id: Agent ID to activate

        Returns:
            True if agent was activated, False if not found
        """
        agent = self._agents.get(agent_id)
        if agent:
            agent.is_active = True
            agent.last_seen = datetime.now()
            return True
        return False
