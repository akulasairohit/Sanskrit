"""Core type definitions for Sanskrit MCP Server."""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Literal, Optional


class Formality(str, Enum):
    """Formality levels for Sanskrit communication."""
    FORMAL = "formal"
    MODERATE = "moderate"
    CASUAL = "casual"


class ComprehensionLevel(str, Enum):
    """Sanskrit comprehension levels."""
    BASIC = "basic"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    SCHOLARLY = "scholarly"


class Language(str, Enum):
    """Supported languages."""
    SANSKRIT = "sanskrit"
    ENGLISH = "english"
    MIXED = "mixed"
    TELUGU = "telugu"


class Severity(str, Enum):
    """Error/warning severity levels."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


@dataclass
class SanskritCapabilities:
    """Sanskrit-specific capabilities of an agent."""
    can_read: bool
    can_write: bool
    dialect_preference: Optional[str] = None
    formality: Formality = Formality.MODERATE
    comprehension_level: Optional[ComprehensionLevel] = None


@dataclass
class AgentStatistics:
    """Usage statistics for an agent."""
    messages_sent: int = 0
    messages_received: int = 0
    last_active: datetime = field(default_factory=datetime.now)
    average_response_time: float = 0.0
    error_count: int = 0


@dataclass
class Agent:
    """Core agent interface."""
    id: str
    name: str
    capabilities: list[str]
    sanskrit_capabilities: SanskritCapabilities
    description: Optional[str] = None
    statistics: AgentStatistics = field(default_factory=AgentStatistics)
    is_active: bool = True
    last_seen: datetime = field(default_factory=datetime.now)


@dataclass
class GrammarPatterns:
    """Detected Sanskrit grammar patterns."""
    sandhi: int = 0
    samasa: int = 0
    vibhakti: int = 0
    dhatu: int = 0


@dataclass
class ValidationError:
    """Validation error details."""
    type: str
    message: str
    position: int
    severity: Severity


@dataclass
class ValidationWarning:
    """Validation warning details."""
    type: str
    message: str
    position: int
    severity: Severity


@dataclass
class ValidationSuggestion:
    """Validation suggestion details."""
    type: str
    message: str
    position: int
    severity: Severity


@dataclass
class ValidationResult:
    """Result of Sanskrit text validation."""
    is_valid: bool
    errors: list[ValidationError] = field(default_factory=list)
    warnings: list[ValidationWarning] = field(default_factory=list)
    suggestions: list[ValidationSuggestion] = field(default_factory=list)
    confidence: float = 1.0
    grammar_patterns: Optional[GrammarPatterns] = None


@dataclass
class MessageMetadata:
    """Metadata for a Sanskrit message."""
    formality: Optional[Formality] = None
    context: Optional[str] = None
    translation_confidence: Optional[float] = None
    cultural_context: bool = False
    validation_result: Optional[ValidationResult] = None
    original_language: Optional[str] = None


@dataclass
class SanskritMessage:
    """Sanskrit message structure."""
    id: str
    content: str
    timestamp: datetime
    language: Language
    metadata: Optional[MessageMetadata] = None


@dataclass
class ProtocolResponse:
    """Response from protocol operations."""
    type: Literal["success", "warning", "error"]
    message: str
    suggestions: list[str] = field(default_factory=list)
    validation_result: Optional[ValidationResult] = None
    translated_content: Optional[str] = None


@dataclass
class VedicTextReference:
    """Reference to a Vedic text."""
    text: str
    chapter: Optional[int] = None
    verse: Optional[int] = None
    section: Optional[str] = None
    manuscript: Optional[str] = None
    edition: Optional[str] = None


@dataclass
class Commentary:
    """Commentary on a Vedic passage."""
    author: str
    text: str
    date: str
    tradition: str
    reliability: float


@dataclass(frozen=True)
class VedicTextReference:
    """Reference to a Vedic text."""
    text: str
    chapter: Optional[int] = None
    verse: Optional[int] = None
    section: Optional[str] = None
    manuscript: Optional[str] = None
    edition: Optional[str] = None


@dataclass(frozen=True)
class Commentary:
    """Commentary on a Vedic passage."""
    author: str
    text: str
    date: str
    tradition: str
    reliability: float


@dataclass
class VedicPassage:
    """Vedic text passage with translations and context."""
    sanskrit: str
    transliteration: str
    translation: str
    reference: VedicTextReference
    context: str
    commentaries: tuple[Commentary, ...]  # Use tuple instead of list for hashability
    reliability: float
    keywords: tuple[str, ...]  # Use tuple instead of list for hashability
    
    def __hash__(self) -> int:
        """Make VedicPassage hashable."""
        return hash((self.sanskrit, self.reference.text, self.reference.chapter, self.reference.verse))


@dataclass
class QueryResult:
    """Result of querying Vedic knowledge base."""
    query: str
    passages: list[VedicPassage]
    synthesized_answer: str
    sources: list[VedicTextReference]
    confidence: float
    hallucination_risk: Literal["low", "medium", "high"]
    warnings: Optional[list[str]] = None


@dataclass
class TranslationOptions:
    """Options for Sanskrit translation."""
    include_transliteration: bool = True
    cultural_context: bool = True
    preserve_metrics: bool = False
    formality: Formality = Formality.MODERATE


@dataclass
class CommunicationLog:
    """Log entry for agent communication."""
    id: str
    timestamp: datetime
    from_agent: str
    to_agent: str
    message: SanskritMessage
    translated_message: Optional[str]
    communication_type: Literal["direct", "broadcast", "response"]
    session_id: str
    success: bool
    response_time: Optional[float] = None
    metadata: Optional[dict[str, Any]] = None


@dataclass
class RegistryStatistics:
    """Statistics for the agent registry."""
    total_agents: int
    active_agents: int
    sanskrit_capable_agents: int
    total_messages: int
    active_sessions: int
