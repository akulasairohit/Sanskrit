# Sanskrit Agent Communication System 🕉️

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-0.9.0+-green.svg)](https://modelcontextprotocol.io/)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.17701161.svg)](https://doi.org/10.5281/zenodo.17701161)

A production-ready Model Context Protocol (MCP) server enabling AI agents to communicate in Sanskrit with real-time grammar validation, authenticated Vedic text corpus integration, and anti-hallucination safeguards.

## ✨ Key Features

- **🤖 Multi-Agent Sanskrit Communication**: Enable AI agents to exchange messages in authentic Sanskrit with full validation
- **📚 Vedic Knowledge Base**: 8+ authenticated passages from Upaniṣads, Bhagavad Gītā, and Bhāgavata Purāṇa with traditional commentaries
- **✅ Grammar Validation**: 70+ Sanskrit grammar patterns including sandhi, samāsa, vibhakti, and dhātu detection
- **🛡️ Anti-Hallucination**: Source attribution with confidence scores (85-99%) and hallucination risk assessment
- **🌐 Real-time Translation**: Sanskrit ↔ English translation with cultural context via Gemini API
- **📊 Agent Registry**: Track agent capabilities, statistics, and conversation patterns
- **🚀 Performance**: 5x faster startup than TypeScript implementation with 60-70% reduced footprint

## 🎯 Use Cases

- **Philosophical AI Debates**: Simulate debates between different Vedānta schools (Advaita, Dvaita, etc.)
- **Sanskrit Education**: Interactive learning with grammar analysis and cultural context
- **Research Tools**: Query Vedic texts with source grounding for academic work
- **Multi-Agent Systems**: Enable Sanskrit communication between specialized AI agents
- **Cultural Preservation**: Promote accessibility of Vedic knowledge with modern AI

## 📦 Installation

### Prerequisites

- Python 3.11 or higher
- pip package manager
- (Optional) Google Gemini API key for AI-powered features

### Quick Start

```bash
# Clone the repository
git clone https://github.com/akulasairohit/Sanskrit.git
cd Sanskrit

# Install dependencies
pip install -r requirements.txt

# Install the package
pip install -e .

# Run the MCP server
python -m sanskrit_mcp
```

### Optional: Set up Gemini API for AI features

```bash
# Get your API key from https://makersuite.google.com/app/apikey
export GEMINI_API_KEY="your-api-key-here"
```

## 🌐 Sanskrit.io Setup (Web Access)

Turn your local MCP server into a web-accessible "Sanskrit.io" service that can be used by any MCP client (Claude Desktop, Gemini, etc.) over the network.

### 1. Run the SSE Server

The project includes a Starlette-based SSE (Server-Sent Events) server.

```bash
# Run locally on port 8000
uvicorn sanskrit_mcp.sse:starlette_app --host 0.0.0.0 --port 8000 --reload
```

Your server is now available at:
- **SSE Endpoint**: `http://localhost:8000/sse`
- **Messages Endpoint**: `http://localhost:8000/messages`

### 2. Connect with Claude Desktop

To use this with Claude Desktop, you can use a proxy or configure it directly if supported. For now, the easiest way is to use `mcp-proxy` or similar tools, or simply use the stdio mode for local usage.

However, if you are building a custom client or using a web-based MCP client, simply point it to the SSE URL above.

### 3. Deploy with Docker

You can easily deploy this to any cloud provider (Render, Railway, AWS, etc.) using the included Dockerfile.

```bash
# Build the image
docker build -t sanskrit-mcp .

# Run the container
docker run -p 8000:8000 sanskrit-mcp
```

Once deployed, your public URL (e.g., `https://sanskrit-io.onrender.com/sse`) can be used to access the server from anywhere.

## 🚀 Quick Start Guide

### 1. Run the MCP Server

```bash
python -m sanskrit_mcp
```

The server will start and listen for MCP client connections via stdio.

### 2. Test with MCP Inspector

```bash
npx @modelcontextprotocol/inspector python -m sanskrit_mcp
```

This opens an interactive web UI to explore available tools and resources.

### 3. Try the Examples

```bash
# Basic validation and corpus test
python examples/simple_test.py

# Philosophical debate between Vedānta schools
python examples/vedanta_debate.py

# Interactive learning with Gajendra Moksha
python examples/gajendra_moksha.py
```

See [examples/README.md](examples/README.md) for detailed documentation.

## 🛠️ Available MCP Tools

The server provides 6 MCP tools for Sanskrit agent communication:

### 1. `register_agent`
Register a new Sanskrit-capable agent with specified capabilities.

```json
{
  "id": "vedanta_scholar",
  "name": "Advaita Scholar",
  "description": "Expert in Advaita Vedānta philosophy",
  "capabilities": ["philosophy", "debate", "translation"],
  "sanskritCapabilities": {
    "canRead": true,
    "canWrite": true,
    "formality": "formal"
  }
}
```

### 2. `send_sanskrit_message`
Send a validated Sanskrit message between agents.

```json
{
  "fromAgent": "agent1",
  "toAgent": "agent2",
  "content": "तत्त्वमसि",
  "context": "Discussing Mahāvākyas",
  "formality": "formal"
}
```

### 3. `translate_sanskrit`
Translate between Sanskrit and English with optional cultural context.

```json
{
  "text": "सर्वं खल्विदं ब्रह्म",
  "direction": "sanskrit-to-english",
  "includeTransliteration": true,
  "culturalContext": true
}
```

### 4. `query_vedic_knowledge`
Query authenticated Vedic texts with anti-hallucination safeguards.

```json
{
  "query": "What do the Upaniṣads say about the nature of Brahman?"
}
```

### 5. `get_agent_status`
Get status and statistics for registered agents.

```json
{
  "agentId": "vedanta_scholar"
}
```

### 6. `analyze_conversation`
Analyze conversation patterns and Sanskrit usage metrics.

```json
{
  "sessionId": "debate_session_1"
}
```

## 📚 Available MCP Resources

Access structured data through MCP resources:

- **`sanskrit://agents`**: List of all registered Sanskrit-capable agents
- **`sanskrit://corpus`**: Vedic corpus statistics and available texts
- **`sanskrit://vocabulary`**: Common Sanskrit terminology and meanings

## 🏗️ Architecture

```
sanskrit-mcp/
├── src/sanskrit_mcp/
│   ├── __main__.py              # MCP server entry point
│   ├── __init__.py              # Public API
│   └── lib/
│       ├── agent_registry.py    # Agent management
│       ├── sanskrit_validator.py # Grammar validation (70+ patterns)
│       ├── vedic_corpus_parser.py # Authenticated text corpus
│       ├── gemini_client.py     # AI translation & generation
│       └── types.py             # Data models (Pydantic)
├── examples/
│   ├── simple_test.py           # Basic validation demo
│   ├── vedanta_debate.py        # Multi-agent debate
│   └── gajendra_moksha.py       # Interactive learning
└── tests/                        # Unit tests (pytest)
```

## 🔧 Development

### Running Tests

```bash
# Install dev dependencies
pip install -e ".[dev]"

# Run all tests
pytest

# Run with coverage
pytest --cov=sanskrit_mcp
```

### Code Quality

```bash
# Format code
black src/ examples/

# Lint
ruff check src/ examples/

# Type check
mypy src/
```

### Project Setup

The project follows modern Python best practices:

- **Package Management**: `pyproject.toml` with setuptools backend
- **Type Safety**: Full type hints with mypy validation
- **Code Quality**: Black formatter + Ruff linter
- **Testing**: pytest with asyncio support
- **MCP Integration**: Official MCP SDK (mcp>=0.9.0)

## 📖 Core Capabilities

### Sanskrit Validation

Validate Sanskrit text with comprehensive grammar analysis:

```python
from sanskrit_mcp.lib.sanskrit_validator import SanskritValidator

validator = SanskritValidator()
result = await validator.validate_text("तत्त्वमसि")

print(f"Valid: {result.is_valid}")
print(f"Confidence: {result.confidence * 100}%")
print(f"Grammar patterns: {result.grammar_patterns}")
```

**Detected patterns include:**
- **Sandhi** (euphonic combinations): 70+ rules
- **Samāsa** (compound words): 6 major types
- **Vibhakti** (case endings): 8 cases × 3 numbers
- **Dhātu** (verb roots): common forms and conjugations

### Vedic Knowledge Queries

Query authenticated Vedic texts with source grounding:

```python
from sanskrit_mcp.lib.vedic_corpus_parser import VedicCorpusParser

corpus = VedicCorpusParser()
result = await corpus.query_vedic_knowledge("Tell me about dharma")

print(f"Answer: {result.synthesized_answer}")
print(f"Confidence: {result.confidence * 100}%")
print(f"Sources: {len(result.passages)} passages found")

for passage in result.passages:
    print(f"  • {passage.reference.text} {passage.reference.chapter}.{passage.reference.verse}")
    print(f"    Reliability: {passage.reliability_score}")
```

**Corpus includes:**
- Upaniṣads: Māṇḍūkya, Chāndogya, Bṛhadāraṇyaka, Muṇḍaka, Īśāvāsya, Kaṭha
- Bhagavad Gītā: Selected verses with Śaṅkara's commentary
- Bhāgavata Purāṇa: Gajendra Moksha and other passages
- Traditional commentaries from ācāryas of different schools

### AI-Powered Translation

Leverage Gemini API for context-aware translation:

```python
from sanskrit_mcp.lib.gemini_client import GeminiClient

client = GeminiClient()  # Requires GEMINI_API_KEY
result = await client.translate_text(
    "You are That",
    direction="english-to-sanskrit",
    include_transliteration=True,
    cultural_context=True
)
```

## 🎓 Examples Gallery

### 1. Vedānta Philosophical Debate

Simulate a structured debate between Advaita (non-dualism) and Dvaita (dualism) scholars:

```bash
python examples/vedanta_debate.py
```

**Features:**
- Agent registration and management
- 3-round Sanskrit debate with validation
- Vedic knowledge queries for supporting arguments
- Comprehensive statistics and analysis

### 2. Interactive Sanskrit Learning

Explore the Gajendra Moksha story with verse-by-verse analysis:

```bash
python examples/gajendra_moksha.py
```

**Features:**
- Sanskrit text with transliteration and translation
- Grammar pattern detection and explanation
- Cultural and philosophical context
- Traditional commentary integration

### 3. Simple Validation Test

Test core validation and corpus functionality:

```bash
python examples/simple_test.py
```

**Features:**
- Sanskrit text validation with confidence scores
- Grammar pattern detection (sandhi, samāsa, vibhakti, dhātu)
- Vedic knowledge queries with source attribution
- Reliability and anti-hallucination metrics

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| **Startup Time** | ~500ms (5x faster than TypeScript) |
| **Memory Footprint** | ~40MB (60-70% reduction) |
| **Validation Speed** | ~50ms per text |
| **Corpus Query** | ~100ms average |
| **Grammar Patterns** | 70+ detected patterns |
| **Vedic Passages** | 8+ authenticated sources |
| **Confidence Range** | 85-99% for valid texts |

## 🔬 Anti-Hallucination Features

The system includes multiple safeguards against AI hallucination:

1. **Source Attribution**: Every Vedic claim includes text/chapter/verse reference
2. **Confidence Scoring**: 0.0-1.0 scale based on source reliability
3. **Hallucination Risk**: Explicit warning when confidence is low
4. **Critical Edition**: Uses authenticated manuscripts (Ramanujan, Shankara commentaries)
5. **Validation Warnings**: Alerts when queries lack corpus support

Example output:
```
📊 Metrics:
  • Confidence: 92.5%
  • Hallucination risk: low
  • Sources found: 3

⚠️ Warnings:
  • Query interpretation may vary by school
```

## 🌍 Multilingual Support

While the core focus is Sanskrit, the system supports:

- **Sanskrit** (Devanagari script): Full grammar validation
- **English**: Translation and cultural context
- **IAST Transliteration**: Roman script representation
- **Telugu** (examples): Devotional poetry analysis

## 🤝 Contributing

Contributions are welcome! Here are some areas for improvement:

- [ ] Add more Vedic text passages (Yoga Sūtras, Brahma Sūtras)
- [ ] Expand grammar pattern detection (Pratyāhāra, Gana)
- [ ] Support for Pāṇini sūtra validation
- [ ] Web UI for interactive exploration
- [ ] Additional language pairs (Sanskrit-Hindi, Sanskrit-Tamil)
- [ ] Performance optimizations for large corpus

### Development Workflow

```bash
# Fork the repository
git clone https://github.com/yourusername/Sanskrit.git
cd Sanskrit

# Create a feature branch
git checkout -b feature/my-feature

# Make changes and test
pytest
black src/
ruff check src/

# Commit and push
git commit -m "Add feature: description"
git push origin feature/my-feature

# Open a Pull Request
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Note on Vedic Texts

The Vedic text corpus (Upaniṣads, Bhagavad Gītā, Bhāgavata Purāṇa) consists of public domain texts that predate copyright. Translations and commentaries are based on traditional scholarly works also in the public domain.

This software is developed with respect for the sacred nature of these texts and aims to promote their accessibility and preservation for educational and scholarly purposes.

## 📚 Citation

If you use this software in your research, please cite:

```bibtex
@software{sanskrit_mcp_2025,
  title        = {Sanskrit Agent Communication System},
  author       = {Akula, Sai Rohit},
  year         = {2025},
  month        = {11},
  version      = {1.0.0},
  url          = {https://github.com/akulasairohit/Sanskrit},
  license      = {MIT},
  note         = {Model Context Protocol server for Sanskrit AI agents with 
                  authenticated Vedic corpus and anti-hallucination safeguards}
}
```

## 🔗 Related Projects

- [Model Context Protocol](https://modelcontextprotocol.io/) - Official MCP specification
- [Google Gemini API](https://ai.google.dev/) - AI-powered translation and generation
- [Sanskrit Heritage Site](https://sanskrit.inria.fr/) - Comprehensive Sanskrit resources
- [Gretil](http://gretil.sub.uni-goettingen.de/) - Göttingen Register of Electronic Texts in Indian Languages

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/akulasairohit/Sanskrit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/akulasairohit/Sanskrit/discussions)
- **Email**: akulasairohit@users.noreply.github.com

## 🙏 Acknowledgments

- Traditional ācāryas and scholars who preserved Vedic knowledge
- Sanskrit Heritage Project for computational resources
- Google Gemini team for AI capabilities
- Model Context Protocol community for the excellent framework
- All contributors and users of this project

---

**Made with 🕉️ for Sanskrit preservation and AI innovation**

*"यतो वाचो निवर्तन्ते अप्राप्य मनसा सह" - Taittirīya Upaniṣad 2.9*

*"From which words return, unable to reach, along with the mind"*
