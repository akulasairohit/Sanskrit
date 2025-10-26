# 📚 Sanskrit MCP Examples

This directory contains Python examples demonstrating the Sanskrit Agent Communication System capabilities.

## 🚀 Quick Start

All examples can be run directly without the MCP server:

```bash
# Basic validation and corpus test
python simple_test.py

# Philosophical debate between Advaita and Dvaita schools
python vedanta_debate.py

# Interactive learning session on Gajendra Moksha
python gajendra_moksha.py
```

## 📖 Examples Overview

### 1. simple_test.py
**Basic Validation & Corpus Demo**

Tests core functionality:
- Sanskrit text validation with grammar pattern detection
- Vedic corpus queries with anti-hallucination safeguards
- Traditional commentary integration
- Confidence scoring

**What you'll learn**:
- How to validate Sanskrit text
- Query the Vedic knowledge base
- Detect grammar patterns (sandhi, samāsa, vibhakti, dhātu)
- Handle source attribution and reliability scores

**Run time**: ~2 seconds

---

### 2. vedanta_debate.py
**Philosophical Debate Simulation**

A 3-round debate between Advaita (non-dualism) and Dvaita (dualism) scholars:
- Agent registration and management
- Sanskrit message exchange with validation
- Vedic knowledge queries for supporting arguments
- Statistics tracking and summary generation

**What you'll learn**:
- Multi-agent Sanskrit communication
- Philosophical discourse in classical Sanskrit
- Real-world application of grammar validation
- How anti-hallucination works with source attribution

**Key concepts**: Advaita Vedānta, Dvaita Vedānta, Brahman, Ātman

**Run time**: ~3 seconds

---

### 3. gajendra_moksha.py
**Interactive Learning Session**

Verse-by-verse exploration of the famous Gajendra Moksha story from Śrīmad Bhāgavatam (8.3):
- Three key verses with Sanskrit, transliteration, and translation
- Grammar analysis for each verse
- Cultural and philosophical context
- Traditional commentary from ācāryas
- Key concept explanations (Puruṣārtha, Ekāntī Bhakti, Śaraṇāgati)

**What you'll learn**:
- How to analyze Sanskrit verses systematically
- Integration of traditional commentaries
- Cultural context preservation
- Theological concept explanation

**Key concepts**: Śaraṇāgati (surrender), Puruṣārtha (four goals), Ekāntī Bhakti (pure devotion)

**Run time**: ~2 seconds

---

## 🔧 Technical Details

### Requirements
All examples use:
- `sanskrit_mcp` package (from `src/`)
- Python 3.11+
- No external API keys required for basic testing

### Common Patterns

**Importing modules**:
```python
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))

from sanskrit_mcp.lib.sanskrit_validator import SanskritValidator
from sanskrit_mcp.lib.vedic_corpus_parser import VedicCorpusParser
```

**Validating Sanskrit**:
```python
validator = SanskritValidator()
result = await validator.validate_text("तत्त्वमसि")
print(f"Valid: {result.is_valid}, Confidence: {result.confidence}")
```

**Querying Vedic knowledge**:
```python
corpus = VedicCorpusParser()
result = await corpus.query_vedic_knowledge("Tell me about dharma")
print(f"Found {len(result.passages)} passages")
```

## 📊 Expected Output

All examples should show:
- ✅ 100% validation confidence on authentic Sanskrit
- ✅ Grammar pattern detection (sandhi, samāsa, vibhakti counts)
- ✅ 80-90% confidence on valid Vedic queries
- ✅ Proper source attribution (text, chapter, verse)
- ✅ Traditional commentary when available

## 🎯 Next Steps

After running the examples:
1. **Try the MCP server**: `python -m sanskrit_mcp`
2. **Test with Inspector**: `npx @modelcontextprotocol/inspector`
3. **Modify examples**: Change Sanskrit texts, add new queries
4. **Create your own**: Use examples as templates

## 📚 Archived Examples

Original TypeScript/JavaScript examples are preserved in `../archive/typescript-examples/`:
- `brahma-kadigina-learning.mjs` - Telugu devotional example
- `enhanced-ai-debate.mjs` - Enhanced debate with AI responses
- `live-ai-consciousness-debate.mjs` - Consciousness debate
- `vedanta-roundtable.mjs` - Six-school roundtable
- And more...

These can be ported to Python following the patterns in the current examples.

---

**Happy exploring!** 🕉️
