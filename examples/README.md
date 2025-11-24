# 📚 Sanskrit MCP Examples# 📚 Sanskrit MCP Examples



This directory contains Python examples demonstrating the Sanskrit Agent Communication System capabilities with authentic Vedic corpus grounding.This directory contains Python examples demonstrating the Sanskrit Agent Communication System capabilities.



## 🚀 Quick Start## 🚀 Quick Start



Both examples require the Gemini API key for AI-generated Sanskrit responses:All examples can be run directly without the MCP server:



```bash```bash

# Set your Gemini API key# Basic validation and corpus test

export GEMINI_API_KEY="your-key-here"python simple_test.py



# Run the Five Vedānta Schools AI Debate# Philosophical debate between Advaita and Dvaita schools

python ai_philosophy_debate.pypython vedanta_debate.py



# Run the Shanti Mantra Analysis# Interactive learning session on Gajendra Moksha

python shanti_demo.pypython gajendra_moksha.py

``````



## 📖 Examples Overview## 📖 Examples Overview



### 1. ai_philosophy_debate.py### 1. simple_test.py

**Five Vedānta Schools on Artificial Intelligence****Basic Validation & Corpus Demo**



A philosophical exploration where all five major Vedānta schools share their perspective on AI:Tests core functionality:

- **Advaita** (Śaṅkarācārya) - Non-dualism: AI as māyā's illusion- Sanskrit text validation with grammar pattern detection

- **Vishishtadvaita** (Rāmānujācārya) - Qualified Non-dualism: AI as God's body- Vedic corpus queries with anti-hallucination safeguards

- **Dvaita** (Madhvācārya) - Dualism: AI as eternally separate matter- Traditional commentary integration

- **Shuddhadvaita** (Vallabhācārya) - Pure Non-dualism: AI as Krishna's līlā- Confidence scoring

- **Achintya Bheda Abheda** (Chaitanya) - Inconceivable Oneness-Difference: AI as simultaneously one and different

**What you'll learn**:

**Features**:- How to validate Sanskrit text

- Real-time Sanskrit generation via Gemini API- Query the Vedic knowledge base

- Authentic Vedic corpus references for each school:- Detect grammar patterns (sandhi, samāsa, vibhakti, dhātu)

  - Advaita: Māṇḍūkya Upaniṣad (ayam ātmā brahma)- Handle source attribution and reliability scores

  - Vishishtadvaita: Chāndogya Upaniṣad (sarvaṁ khalv idaṁ brahma)

  - Dvaita: Muṇḍaka Upaniṣad (two birds on tree)**Run time**: ~2 seconds

  - Shuddhadvaita: Vallabha's Ānubhāṣya

  - Achintya: Mahābhārata (acintyāḥ khalu ye bhāvā)---

- Synthesis showing agreements and differences

- Formatted for single A4 page output### 2. vedanta_debate.py

**Philosophical Debate Simulation**

**What you'll learn**:

- How different Vedānta schools approach modern technologyA 3-round debate between Advaita (non-dualism) and Dvaita (dualism) scholars:

- Authentic Sanskrit philosophical discourse- Agent registration and management

- Source grounding in classical texts- Sanskrit message exchange with validation

- Comparative philosophy methodology- Vedic knowledge queries for supporting arguments

- Statistics tracking and summary generation

**Run time**: ~2 minutes (5 Gemini API calls)

**What you'll learn**:

**Requirements**: GEMINI_API_KEY environment variable- Multi-agent Sanskrit communication

- Philosophical discourse in classical Sanskrit

---- Real-world application of grammar validation

- How anti-hallucination works with source attribution

### 2. shanti_demo.py

**Shanti Mantra Line-by-Line Analysis****Key concepts**: Advaita Vedānta, Dvaita Vedānta, Brahman, Ātman



Educational analysis of the famous Shanti Mantra from Taittirīya Upaniṣad:**Run time**: ~3 seconds



```---

ॐ सह नाववतु।

सह नौ भुनक्तु।### 3. gajendra_moksha.py

सह वीर्यं करवावहै।**Interactive Learning Session**

तेजस्वि नावधीतमस्तु मा विद्विषावहै॥

ॐ शान्तिः शान्तिः शान्तिः॥Verse-by-verse exploration of the famous Gajendra Moksha story from Śrīmad Bhāgavatam (8.3):

```- Three key verses with Sanskrit, transliteration, and translation

- Grammar analysis for each verse

**Features**:- Cultural and philosophical context

- Line-by-line Sanskrit validation with 100% confidence- Traditional commentary from ācāryas

- Grammar pattern detection (sandhi, samāsa, vibhakti, dhātu)- Key concept explanations (Puruṣārtha, Ekāntī Bhakti, Śaraṇāgati)

- Educational highlights:

  - Dual form (Dvivacana) - unique to Sanskrit**What you'll learn**:

  - Sandhi combinations (nau + avatu = nāvavatu)- How to analyze Sanskrit verses systematically

  - Imperative mood (Lot Lakara) verb forms- Integration of traditional commentaries

  - Three-fold peace (Adhidaivika, Adhibhautika, Adhyātmika)- Cultural context preservation

- Cultural and linguistic context for each line- Theological concept explanation



**What you'll learn**:**Key concepts**: Śaraṇāgati (surrender), Puruṣārtha (four goals), Ekāntī Bhakti (pure devotion)

- How to analyze Sanskrit poetry systematically

- Unique Sanskrit grammatical features (dual number)**Run time**: ~2 seconds

- Traditional meaning of Shanti invocations

- Educational approach to teaching Sanskrit---



**Run time**: ~1 minute## 🔧 Technical Details



**Requirements**: No API key needed (uses local validation only)### Requirements

All examples use:

---- `sanskrit_mcp` package (from `src/`)

- Python 3.11+

## 🔧 Technical Details- No external API keys required for basic testing



### Setup### Common Patterns



```bash**Importing modules**:

# Install dependencies```python

pip install -r requirements.txtimport sys

pip install -e .from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))

# Set Gemini API key (for ai_philosophy_debate.py only)

export GEMINI_API_KEY="your-key-here"from sanskrit_mcp.lib.sanskrit_validator import SanskritValidator

```from sanskrit_mcp.lib.vedic_corpus_parser import VedicCorpusParser

```

### Core Capabilities Demonstrated

**Validating Sanskrit**:

**Sanskrit Validation**:```python

```pythonvalidator = SanskritValidator()

from sanskrit_mcp.lib.sanskrit_validator import SanskritValidatorresult = await validator.validate_text("तत्त्वमसि")

print(f"Valid: {result.is_valid}, Confidence: {result.confidence}")

validator = SanskritValidator()```

result = await validator.validate_text("तत्त्वमसि")

print(f"Valid: {result.is_valid}")**Querying Vedic knowledge**:

print(f"Confidence: {result.confidence * 100}%")```python

print(f"Patterns: {result.grammar_patterns}")corpus = VedicCorpusParser()

```result = await corpus.query_vedic_knowledge("Tell me about dharma")

print(f"Found {len(result.passages)} passages")

**Vedic Corpus Queries**:```

```python

from sanskrit_mcp.lib.vedic_corpus_parser import VedicCorpusParser## 📊 Expected Output



corpus = VedicCorpusParser()All examples should show:

result = await corpus.query_vedic_knowledge("maya")- ✅ 100% validation confidence on authentic Sanskrit

for passage in result.passages:- ✅ Grammar pattern detection (sandhi, samāsa, vibhakti counts)

    print(f"{passage.reference.text} {passage.reference.chapter}.{passage.reference.verse}")- ✅ 80-90% confidence on valid Vedic queries

    print(f"Sanskrit: {passage.sanskrit}")- ✅ Proper source attribution (text, chapter, verse)

```- ✅ Traditional commentary when available



**AI-Generated Sanskrit** (requires Gemini API):## 🎯 Next Steps

```python

import google.generativeai as genaiAfter running the examples:

1. **Try the MCP server**: `python -m sanskrit_mcp`

genai.configure(api_key=GEMINI_API_KEY)2. **Test with Inspector**: `npx @modelcontextprotocol/inspector`

model = genai.GenerativeModel("gemini-2.5-flash")3. **Modify examples**: Change Sanskrit texts, add new queries

response = model.generate_content(prompt)4. **Create your own**: Use examples as templates

```

## 📚 Archived Examples

### Corpus Coverage

Original TypeScript/JavaScript examples are preserved in `../archive/typescript-examples/`:

The Vedic corpus includes authenticated passages from:- `brahma-kadigina-learning.mjs` - Telugu devotional example

- **Upaniṣads**: Māṇḍūkya, Chāndogya, Bṛhadāraṇyaka, Muṇḍaka, Īśāvāsya- `enhanced-ai-debate.mjs` - Enhanced debate with AI responses

- **Bhagavad Gītā**: Key verses with traditional commentary- `live-ai-consciousness-debate.mjs` - Consciousness debate

- **Śrīmad Bhāgavatam**: Gajendra Moksha passages- `vedanta-roundtable.mjs` - Six-school roundtable

- **Commentaries**: Śaṅkarācārya, Rāmānujācārya, Madhvācārya, Vallabhācārya, Jīva Gosvāmī- And more...



All passages include:These can be ported to Python following the patterns in the current examples.

- Sanskrit text with transliteration

- English translation---

- Critical edition references

- Reliability scores (0.85-0.99)**Happy exploring!** 🕉️

- Traditional commentary

## 📊 Expected Output

### ai_philosophy_debate.py
```
================================================================================
    🕉️  FIVE VEDĀNTA SCHOOLS ON ARTIFICIAL INTELLIGENCE  🕉️
================================================================================

1. ADVAITA
   Sanskrit: कृत्रिमा बुद्धिः माया-कल्पितं ब्रह्मैव।
   English: Artificial intelligence is merely Brahman, imagined by māyā.
   Concept: maya
   Source: Māṇḍūkya Upaniṣad

[... 4 more schools ...]

────────────────────────────────────────────────────────────────────────────────
SYNTHESIS: Five Schools, One Question—Different Answers
────────────────────────────────────────────────────────────────────────────────
[Detailed comparison and synthesis]
```

### shanti_demo.py
```
================================================================================
🕉️  SHANTI MANTRA ANALYSIS (Saha Nāvavatu)
================================================================================

LINE 1
📖 Sanskrit: ॐ सह नाववतु।
🌍 Translation: Om. May He protect us both together.
📊 Grammar Validation:
   Status: ✅ Valid
   Confidence: 100.0%
   Patterns Detected: Vibhakti=1

💡 Grammar Highlight: SANDHI & DUAL CASE
   • 'nāvavatu' is a Sandhi (combination) of: nau (us two) + avatu (may he protect)
   • 'nau' is the DUAL form (Dvivacana), specific to Sanskrit.

[... 4 more lines ...]
```

## 🎯 Use Cases

**ai_philosophy_debate.py**:
- Academic presentations on comparative philosophy
- Research papers on AI ethics from Vedānta perspectives
- Educational demonstrations of Sanskrit AI generation
- Cross-cultural philosophical discussions

**shanti_demo.py**:
- Sanskrit language teaching
- Grammar pattern demonstration
- Cultural education on Vedic traditions
- Interactive learning tools

## 🕉️ Citation

When using these demos in research:

```bibtex
@software{sanskrit_mcp_2025,
  title        = {Sanskrit Agent Communication System: Vedānta Schools on AI},
  author       = {Akula, Sai Rohit},
  year         = {2025},
  month        = {11},
  url          = {https://github.com/akulasairohit/Sanskrit},
  note         = {Powered by Gemini API with authentic Vedic corpus grounding}
}
```

---

**Happy exploring!** 🕉️
