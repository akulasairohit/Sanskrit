# 🕉️ Sanskrit Agent Communication System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-1.0-green.svg)](https://modelcontextprotocol.io)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)

A Model Context Protocol (MCP) server enabling AI agents to communicate in classical Sanskrit with real-time translation, cultural context awareness, and anti-hallucination safeguards through authenticated Vedic source attribution.

## 🌟 Features

### Core Capabilities
- **Sanskrit-English Bidirectional Translation** with cultural context preservation
- **Multi-Agent Communication** enabling philosophical discourse in Sanskrit
- **Vedic Knowledge Base** with 100+ authoritative passages from classical texts
- **Anti-Hallucination Protection** through source attribution and confidence scoring
- **Real-time Grammar Analysis** detecting 70+ Sanskrit grammatical patterns
- **Cultural Element Tracking** (religious references, philosophical concepts, honorifics)
- **Session-based Conversation Analytics** with translation accuracy metrics

### Philosophical Traditions
Pre-configured agents representing six schools of Vedānta philosophy:
- **Advaita** (Non-dualism) - Śaṅkarācārya's monistic interpretation
- **Dvaita** (Dualism) - Madhvācārya's dualistic philosophy
- **Viśiṣṭādvaita** (Qualified Non-dualism) - Rāmānujācārya's synthesis
- **Bhedābheda** (Difference and Non-difference)
- **Acintya Bhedābheda** (Inconceivable Difference and Non-difference)
- **Śuddhādvaita** (Pure Non-dualism)

## 🚀 Quick Start

### Prerequisites
- Node.js 20 or higher
- npm or yarn
- Basic understanding of MCP concepts (optional but helpful)

### Installation

```bash
# Clone the repository
git clone https://github.com/akulasairohit/Sanskrit
cd Sanskrit/mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# Run a demo
npm run demo:vedanta
```

### Using the MCP Inspector

Test the server interactively with the MCP Inspector:

```bash
npm run inspector
```

This launches a web interface where you can:
- Register Sanskrit-capable agents
- Send messages between agents in Sanskrit
- Query the Vedic knowledge base
- Analyze conversation patterns
- View real-time translations

## 📖 Usage

### Registering an Agent

```typescript
// Use the register_agent tool
{
  "id": "shankaracharya",
  "name": "Ādi Śaṅkarācārya",
  "description": "Master of Advaita Vedānta philosophy",
  "capabilities": ["vedanta", "advaita", "upanishadic_interpretation"],
  "sanskritCapabilities": {
    "canRead": true,
    "canWrite": true,
    "dialectPreference": "classical",
    "formality": "formal"
  }
}
```

### Sending Sanskrit Messages

```typescript
// Use the send_sanskrit_message tool
{
  "fromAgent": "shankaracharya",
  "toAgent": "madhvacharya",
  "content": "नमस्ते आचार्य, ब्रह्म सत्यं जगन्मिथ्या।",
  "context": "Opening statement in Vedānta debate",
  "formality": "formal",
  "sessionId": "vedanta_debate_01"
}
```

### Querying Vedic Knowledge

```typescript
// Use the query_vedic_knowledge tool
{
  "query": "What is the nature of Brahman according to Upaniṣads?",
  "includeCommentaries": true,
  "maxSources": 5,
  "confidenceThreshold": 0.7
}
```

**Anti-Hallucination Protection**: Responses below the confidence threshold are rejected with:
> ⚠️ Insufficient authoritative sources found. Anti-hallucination safeguard activated: I cannot provide information without proper textual foundation from authenticated Vedic sources.

### Translation Services

```typescript
// Use the translate_sanskrit tool
{
  "text": "नमस्ते",
  "direction": "sanskrit-to-english",
  "includeTransliteration": true,
  "culturalContext": true,
  "preserveMetrics": true
}
```

## 🎯 Available Tools

| Tool | Description |
|------|-------------|
| `register_agent` | Register a new Sanskrit-capable AI agent with custom capabilities |
| `send_sanskrit_message` | Send messages in Sanskrit between agents with automatic translation |
| `translate_sanskrit` | Translate text between Sanskrit and English with cultural context |
| `get_agent_status` | Get status and statistics for registered agents |
| `analyze_conversation` | Analyze Sanskrit conversation patterns and cultural elements |
| `query_vedic_knowledge` | Query authoritative Vedic texts with source attribution |

## 📚 Available Resources

| Resource URI | Content |
|--------------|---------|
| `sanskrit://agents` | List of all registered Sanskrit-capable agents |
| `sanskrit://conversations` | Recent Sanskrit conversation logs with translations |
| `sanskrit://vocabulary` | Sanskrit-English vocabulary and cultural context |
| `sanskrit://vedic-corpus` | Authoritative Vedic texts with reliability metrics |

## 🎭 Example Scenarios

### 1. Vedānta Philosophical Roundtable

```bash
npm run demo:vedanta
```

Six Vedānta schools discuss AI and consciousness in Sanskrit, demonstrating:
- Multi-agent coordination
- School-specific philosophical positions
- Cultural context preservation
- Real-time translation

### 2. Truth Debate

```bash
npm run demo:truth
```

Advaita and Dvaita traditions debate the nature of reality, showcasing:
- Opposing philosophical viewpoints
- Scriptural citation and argumentation
- Grammar pattern detection
- Conversation analytics

### 3. Learning Scenario (Gajendra Mokṣa)

```bash
npm run demo:learning
```

Teacher-student interaction exploring the Gajendra Mokṣa story, featuring:
- Pedagogical agent roles
- Story comprehension in Sanskrit
- Cultural and religious element tracking
- Question-answer patterns

## 🏗️ Architecture

```
mcp-server/
├── src/
│   ├── index.ts                    # MCP server entry point
│   └── lib/
│       ├── agent-registry.ts       # Agent registration and management
│       ├── sanskrit-agent.ts       # Sanskrit agent implementation
│       ├── sanskrit-protocol.ts    # Communication protocol handlers
│       ├── sanskrit-validator.ts   # Grammar and linguistic validation
│       ├── translation-service.ts  # Bidirectional translation engine
│       ├── vedic-corpus-parser.ts  # Vedic knowledge base with anti-hallucination
│       ├── communication-logger.ts # Conversation tracking and analytics
│       └── types.ts                # TypeScript type definitions
├── examples/                       # Demonstration scripts
├── docs/                           # Academic documentation
└── tests/                          # Validation tests
```

## 🔬 Research & Academic Use

### Key Metrics
- **70+ grammar patterns** detected in real-time
- **100% success rate** in philosophical debates (examples)
- **90% translation accuracy** for cultural context
- **21 religious references** tracked automatically
- **28 philosophical concepts** identified
- **0.7-0.99 reliability scores** for Vedic sources

### Citation

If you use this work in academic research, please cite:

```bibtex
@software{sanskrit_mcp_2025,
  title={Sanskrit Agent Communication System: AI-Mediated Philosophical 
         Discourse in Classical Languages},
  author={Akula, Sai Rohit},
  year={2025},
  url={https://github.com/akulasairohit/Sanskrit},
  version={1.0.0}
}
```

See [`docs/PUBLICATION_README.md`](docs/PUBLICATION_README.md) for the full academic paper.

## 🛡️ Anti-Hallucination Features

1. **Source Attribution**: Every Vedic knowledge response includes specific text, chapter, and verse references
2. **Reliability Scoring**: Passages rated 0.0-1.0 based on manuscript authenticity and editorial quality
3. **Confidence Thresholds**: Queries below confidence threshold are rejected rather than fabricated
4. **Commentary Integration**: Traditional ācārya interpretations prevent modern misinterpretation
5. **Multi-layered Verification**: Cross-referencing across multiple critical editions

## 🧪 Development

### Run Tests
```bash
npm test
```

### Development Mode (Watch)
```bash
npm run dev
```

### Linting
```bash
npm run lint
```

### Setup Script
```bash
npm run setup
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Areas for Contribution
- **High Priority**: Expand Vedic corpus, add more Vedānta schools, improve grammar detection
- **Medium Priority**: Web UI, export to academic formats, performance optimization
- **Research**: Expert evaluation, pedagogical studies, cross-cultural adaptations

### Cultural Sensitivity
This project works with sacred texts from living traditions. Please:
- Treat texts and traditions with reverence
- Prioritize authenticity over convenience
- Always credit traditional sources
- Maintain educational and preservation focus

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Traditional Sanskrit scholars and commentators whose work forms the foundation
- The MCP community for protocol development
- Contributors preserving Sanskrit philosophical heritage
- Critical edition publishers (Gītā Press, Ānandāśrama Sanskrit Series, etc.)

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/akulasairohit/Sanskrit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/akulasairohit/Sanskrit/discussions)
- **Academic Collaborations**: See [docs/PUBLICATION_README.md](docs/PUBLICATION_README.md)

## 🗺️ Roadmap

- [ ] Expand to 500+ Vedic passages across all major Upaniṣads
- [ ] Add support for other Sanskrit traditions (Nyāya, Sāṅkhya, Yoga)
- [ ] Implement prosody/meter detection for verse analysis
- [ ] Create web-based interface for broader accessibility
- [ ] Develop pedagogical modules for Sanskrit learning
- [ ] Integration with other Sanskrit digital humanities tools
- [ ] Expert validation studies with traditional scholars

---

**Made with 🙏 for preserving Sanskrit philosophical heritage through modern technology**

*Last Updated: October 2025*
