"""Sanskrit MCP Server - Model Context Protocol for Sanskrit agent communication."""

__version__ = "1.0.0"
__author__ = "Sai Rohit Akula"

from .lib.types import (
    Agent,
    SanskritCapabilities,
    SanskritMessage,
    ValidationResult,
)

__all__ = [
    "Agent",
    "SanskritCapabilities", 
    "SanskritMessage",
    "ValidationResult",
]
