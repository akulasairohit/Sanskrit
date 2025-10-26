"""
Sanskrit MCP Server - Main Entry Point.

Model Context Protocol server for Sanskrit agent communication
with real-time translation and Vedic knowledge grounding.
"""

import asyncio
import logging
from typing import Any

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import (
    TextContent,
    Tool,
    Resource,
)

from .lib.agent_registry import AgentRegistry
from .lib.sanskrit_validator import SanskritValidator
from .lib.vedic_corpus_parser import VedicCorpusParser
from .lib.types import Agent, SanskritCapabilities, Formality

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize core services
agent_registry = AgentRegistry()
sanskrit_validator = SanskritValidator()
vedic_corpus = VedicCorpusParser()

# Create MCP server
app = Server("sanskrit-agent-communication")


@app.list_tools()
async def list_tools() -> list[Tool]:
    """List all available tools."""
    return [
        Tool(
            name="register_agent",
            description="Register a new Sanskrit-capable agent in the system",
            inputSchema={
                "type": "object",
                "properties": {
                    "id": {"type": "string", "description": "Unique agent identifier"},
                    "name": {"type": "string", "description": "Agent display name"},
                    "description": {"type": "string", "description": "Agent description"},
                    "capabilities": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of agent capabilities",
                    },
                    "sanskritCapabilities": {
                        "type": "object",
                        "properties": {
                            "canRead": {"type": "boolean", "default": True},
                            "canWrite": {"type": "boolean", "default": True},
                            "formality": {
                                "type": "string",
                                "enum": ["formal", "moderate", "casual"],
                                "default": "moderate",
                            },
                        },
                    },
                },
                "required": ["id", "name"],
            },
        ),
        Tool(
            name="send_sanskrit_message",
            description="Send a Sanskrit message between agents with validation",
            inputSchema={
                "type": "object",
                "properties": {
                    "fromAgent": {"type": "string"},
                    "toAgent": {"type": "string"},
                    "content": {"type": "string"},
                    "context": {"type": "string"},
                    "formality": {
                        "type": "string",
                        "enum": ["formal", "moderate", "casual"],
                        "default": "moderate",
                    },
                },
                "required": ["fromAgent", "toAgent", "content"],
            },
        ),
        Tool(
            name="translate_sanskrit",
            description="Translate between Sanskrit and English with cultural context",
            inputSchema={
                "type": "object",
                "properties": {
                    "text": {"type": "string"},
                    "direction": {
                        "type": "string",
                        "enum": ["sanskrit-to-english", "english-to-sanskrit"],
                    },
                    "includeTransliteration": {"type": "boolean", "default": False},
                    "culturalContext": {"type": "boolean", "default": False},
                },
                "required": ["text", "direction"],
            },
        ),
        Tool(
            name="get_agent_status",
            description="Get status and statistics for registered agents",
            inputSchema={
                "type": "object",
                "properties": {
                    "agentId": {"type": "string"},
                },
            },
        ),
        Tool(
            name="analyze_conversation",
            description="Analyze conversation patterns and Sanskrit usage",
            inputSchema={
                "type": "object",
                "properties": {
                    "sessionId": {"type": "string"},
                },
                "required": ["sessionId"],
            },
        ),
        Tool(
            name="query_vedic_knowledge",
            description="Query authenticated Vedic texts with anti-hallucination safeguards",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Natural language query about Vedic philosophy"},
                },
                "required": ["query"],
            },
        ),
    ]


@app.call_tool()
async def call_tool(name: str, arguments: dict[str, Any]) -> list[TextContent]:
    """Handle tool calls."""
    try:
        if name == "register_agent":
            return await handle_register_agent(arguments)
        elif name == "send_sanskrit_message":
            return await handle_send_message(arguments)
        elif name == "translate_sanskrit":
            return await handle_translate(arguments)
        elif name == "get_agent_status":
            return await handle_get_status(arguments)
        elif name == "analyze_conversation":
            return await handle_analyze_conversation(arguments)
        elif name == "query_vedic_knowledge":
            return await handle_query_vedic_knowledge(arguments)
        else:
            return [TextContent(type="text", text=f"Unknown tool: {name}")]
    except Exception as e:
        logger.error(f"Error in tool {name}: {e}", exc_info=True)
        return [TextContent(type="text", text=f"Error: {str(e)}")]


async def handle_register_agent(args: dict[str, Any]) -> list[TextContent]:
    """Register a new agent."""
    sanskrit_caps_data = args.get("sanskritCapabilities", {})
    sanskrit_caps = SanskritCapabilities(
        can_read=sanskrit_caps_data.get("canRead", True),
        can_write=sanskrit_caps_data.get("canWrite", True),
        formality=Formality(sanskrit_caps_data.get("formality", "moderate")),
    )

    agent = Agent(
        id=args["id"],
        name=args["name"],
        description=args.get("description"),
        capabilities=args.get("capabilities", []),
        sanskrit_capabilities=sanskrit_caps,
    )

    agent_registry.register_agent(agent)

    return [
        TextContent(
            type="text",
            text=f"✅ Agent registered: {agent.name} (ID: {agent.id})\n"
            f"Sanskrit capabilities: Read={sanskrit_caps.can_read}, Write={sanskrit_caps.can_write}\n"
            f"Formality level: {sanskrit_caps.formality.value}",
        )
    ]


async def handle_send_message(args: dict[str, Any]) -> list[TextContent]:
    """Send a message between agents."""
    from_agent = args["fromAgent"]
    to_agent = args["toAgent"]
    content = args["content"]

    # Validate Sanskrit if message contains Devanagari
    validation_result = await sanskrit_validator.validate_text(content)

    # Record message
    agent_registry.record_message(from_agent, to_agent)

    grammar_info = ""
    if validation_result.grammar_patterns:
        gp = validation_result.grammar_patterns
        grammar_info = f"\n\n📊 Grammar patterns detected:\n"
        grammar_info += f"  • Sandhi: {gp.sandhi}\n"
        grammar_info += f"  • Samāsa: {gp.samasa}\n"
        grammar_info += f"  • Vibhakti: {gp.vibhakti}\n"
        grammar_info += f"  • Dhātu: {gp.dhatu}"

    status = "✅ Valid" if validation_result.is_valid else "⚠️ Has issues"
    confidence = f"{validation_result.confidence * 100:.1f}%"

    return [
        TextContent(
            type="text",
            text=f"📨 Message sent from {from_agent} to {to_agent}\n\n"
            f"Content: {content}\n\n"
            f"Validation: {status} (Confidence: {confidence})"
            f"{grammar_info}",
        )
    ]


async def handle_translate(args: dict[str, Any]) -> list[TextContent]:
    """Translate Sanskrit text."""
    text = args["text"]
    direction = args["direction"]

    # Simple translation placeholder - in production use AI model
    if direction == "sanskrit-to-english":
        result = f"English translation of: {text}\n(Translation service placeholder)"
    else:
        result = f"Sanskrit translation of: {text}\n(Translation service placeholder)"

    return [TextContent(type="text", text=result)]


async def handle_get_status(args: dict[str, Any]) -> list[TextContent]:
    """Get agent status."""
    agent_id = args.get("agentId")

    if agent_id:
        agent = agent_registry.get_agent(agent_id)
        if not agent:
            return [TextContent(type="text", text=f"Agent not found: {agent_id}")]

        stats = agent.statistics
        return [
            TextContent(
                type="text",
                text=f"📊 Agent Status: {agent.name}\n\n"
                f"ID: {agent.id}\n"
                f"Active: {agent.is_active}\n"
                f"Messages sent: {stats.messages_sent}\n"
                f"Messages received: {stats.messages_received}\n"
                f"Last active: {stats.last_active}\n"
                f"Capabilities: {', '.join(agent.capabilities)}",
            )
        ]
    else:
        # Return registry statistics
        stats = agent_registry.get_statistics()
        return [
            TextContent(
                type="text",
                text=f"📊 Registry Statistics\n\n"
                f"Total agents: {stats.total_agents}\n"
                f"Active agents: {stats.active_agents}\n"
                f"Sanskrit-capable: {stats.sanskrit_capable_agents}\n"
                f"Total messages: {stats.total_messages}",
            )
        ]


async def handle_analyze_conversation(args: dict[str, Any]) -> list[TextContent]:
    """Analyze conversation patterns."""
    session_id = args["sessionId"]

    return [
        TextContent(
            type="text",
            text=f"📈 Conversation Analysis for session: {session_id}\n\n"
            "(Analysis placeholder - would show message flow, patterns, etc.)",
        )
    ]


async def handle_query_vedic_knowledge(args: dict[str, Any]) -> list[TextContent]:
    """Query Vedic knowledge base."""
    query = args["query"]

    result = await vedic_corpus.query_vedic_knowledge(query)

    response = f"🕉️ Vedic Knowledge Query Results\n\n"
    response += f"Query: {query}\n\n"
    response += f"{result.synthesized_answer}\n\n"
    response += f"📊 Metrics:\n"
    response += f"  • Confidence: {result.confidence * 100:.1f}%\n"
    response += f"  • Hallucination risk: {result.hallucination_risk}\n"
    response += f"  • Sources found: {len(result.passages)}\n"

    if result.warnings:
        response += f"\n⚠️ Warnings:\n"
        for warning in result.warnings:
            response += f"  • {warning}\n"

    return [TextContent(type="text", text=response)]


@app.list_resources()
async def list_resources() -> list[Resource]:
    """List available resources."""
    return [
        Resource(
            uri="sanskrit://agents",
            name="Registered Agents",
            mimeType="application/json",
            description="List of all registered Sanskrit-capable agents",
        ),
        Resource(
            uri="sanskrit://corpus",
            name="Vedic Corpus",
            mimeType="application/json",
            description="Authenticated Vedic text corpus with 100+ passages",
        ),
        Resource(
            uri="sanskrit://vocabulary",
            name="Sanskrit Vocabulary",
            mimeType="application/json",
            description="Common Sanskrit terms and their meanings",
        ),
    ]


@app.read_resource()
async def read_resource(uri: str) -> str:
    """Read resource contents."""
    if uri == "sanskrit://agents":
        agents = agent_registry.get_all_agents()
        return f"Registered Agents ({len(agents)}):\n" + "\n".join(
            f"  • {a.name} ({a.id})" for a in agents
        )
    elif uri == "sanskrit://corpus":
        stats = vedic_corpus.get_corpus_statistics()
        return f"Vedic Corpus Statistics:\n{stats}"
    elif uri == "sanskrit://vocabulary":
        return "Sanskrit Vocabulary:\n(Vocabulary resource placeholder)"
    else:
        return f"Unknown resource: {uri}"


async def main() -> None:
    """Run the MCP server."""
    logger.info("🕉️ Sanskrit Agent MCP Server starting...")
    logger.info(f"Server Info: {app.name} v1.0.0")
    logger.info("✅ Available Tools: register_agent, send_sanskrit_message, translate_sanskrit, "
                "get_agent_status, analyze_conversation, query_vedic_knowledge")
    logger.info("📚 Available Resources: sanskrit://agents, sanskrit://corpus, sanskrit://vocabulary")
    logger.info("✅ Sanskrit Agent MCP Server running and ready for connections...")

    async with stdio_server() as (read_stream, write_stream):
        await app.run(read_stream, write_stream, app.create_initialization_options())


if __name__ == "__main__":
    asyncio.run(main())
