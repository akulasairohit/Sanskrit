# Vedanta Truth Debate Example

## Overview

This example demonstrates two AI agents representing different schools of Vedanta philosophy debating the nature of ultimate truth using the Sanskrit MCP server.

## The Two Agents

### 🕉️ Advaita Vedanta Acharya (अद्वैत वेदान्त आचार्य)
- **School**: Advaita Vedanta (Non-dualism)
- **Founder**: Adi Shankaracharya (आदि शंकराचार्य)
- **Core Teaching**: "Brahman alone is real, the world is illusory, the individual soul is not different from Brahman"
- **Key Concept**: Non-dual reality - ultimate oneness of Atman (soul) and Brahman (absolute)

### 🙏 Dvaita Vedanta Acharya (द्वैत वेदान्त आचार्य)
- **School**: Dvaita Vedanta (Dualism)
- **Founder**: Sri Madhvacharya (श्री मध्वाचार्य)
- **Core Teaching**: "Eternal difference between soul and God, and between nature and spirit"
- **Key Concept**: Dualistic reality - God, souls, and matter are eternally distinct

## What They Debate

The agents discuss four fundamental philosophical questions:

1. **Ultimate Truth** (परमार्थ सत्य)
   - What is the nature of ultimate reality?
   - Advaita: Non-dual attributeless Brahman
   - Dvaita: Personal God (Vishnu) with attributes

2. **Nature of the World** (जगत्स्वरूपम्)
   - Is the world real or illusory?
   - Advaita: World is Maya (illusion)
   - Dvaita: World is real creation of God

3. **Soul-God Relationship** (जीवेश्वरसम्बन्धः)
   - What is the relationship between the individual and the divine?
   - Advaita: Identity - "You are That" (तत्त्वमसि)
   - Dvaita: Eternal distinction - soul is servant of God

4. **Liberation** (मोक्षस्वरूपम्)
   - What is the nature and path to liberation?
   - Advaita: Knowledge leading to merger with Brahman
   - Dvaita: Devotion leading to eternal service in Vaikuntha

## How to Run

### Prerequisites

Make sure the MCP server is built:
```bash
npm run build
```

### Run the Debate

```bash
npm run demo:truth
```

Or directly:
```bash
node examples/vedanta-truth-debate.mjs
```

## What You'll See

The debate proceeds through three rounds, with each agent presenting their position in:
- **Sanskrit** (देवनागरी script)
- **English translation**

Example output:
```
╔═══════════════════════════════════════════════════════════════╗
║    VEDANTA PHILOSOPHICAL DEBATE ON THE NATURE OF TRUTH       ║
║                                                               ║
║  🕉️  Advaita (Non-dualism) vs 🙏 Dvaita (Dualism)          ║
╚═══════════════════════════════════════════════════════════════╝

🕉️ Advaita Vedanta Acharya
   📚 Topic: परमार्थ सत्य (Ultimate Truth)
   🇮🇳 Sanskrit: एकमेवाद्वितीयं ब्रह्म परमार्थसत्यम्...
   🇬🇧 English: Brahman alone is the ultimate truth...

🙏 Dvaita Vedanta Acharya
   📚 Topic: परमार्थ सत्य (Ultimate Truth)
   🇮🇳 Sanskrit: श्री हरिः परमसत्यम्...
   🇬🇧 English: Lord Hari (Vishnu) is the ultimate truth...
```

## Output Files

The debate generates a comprehensive summary file:
- **VEDANTA_TRUTH_DEBATE.md** - Complete philosophical comparison with:
  - Full Sanskrit statements from each position
  - English translations
  - Comparative analysis table
  - Common ground between schools
  - Historical context

## Key Insights

### Why This Debate Matters

1. **Philosophical Depth**: Explores fundamental questions about reality, consciousness, and existence
2. **Cultural Heritage**: Represents centuries of Indian philosophical tradition
3. **Practical Relevance**: Different paths appeal to different temperaments and spiritual inclinations
4. **Intellectual Rigor**: Both schools are internally consistent and based on the same scriptures

### Common Ground

Despite profound differences, both agree on:
- Authority of the Vedas
- Need for spiritual practice
- Importance of a guru
- Goal of liberation from suffering
- Ethical living (dharma)

### Complementary Nature

Rather than contradictory, these can be seen as:
- Different perspectives on the infinite
- Suited to different spiritual temperaments
- Complementary approaches to truth

## Technical Details

### MCP Server Features Used

1. **Agent Registration**: Each philosophical school is registered as a distinct agent
2. **Sanskrit Communication**: Messages exchanged in formal Sanskrit
3. **Session Management**: Debate tracked as a single philosophical session
4. **Conversation Analysis**: Server analyzes the philosophical exchange

### Agent Capabilities

Each agent has:
- `sanskrit_communication`: Full Sanskrit read/write
- `philosophy`: Philosophical reasoning
- `vedanta`: Vedanta expertise
- School-specific: `non_dualism` or `dualism`, `bhakti`

### Sanskrit Capabilities

- **Formality**: Formal (scholarly discourse)
- **Comprehension**: Scholarly level
- **Dialect**: Classical Sanskrit
- **Style**: Philosophical treatise format

## Extending This Example

You can modify this to:

1. **Add more schools**: Include Vishishtadvaita, Shuddhadvaita, etc.
2. **Different topics**: Debate ethics, epistemology, cosmology
3. **Interactive mode**: Let users ask questions to either agent
4. **Multilingual**: Add more language pairs
5. **Historical context**: Include actual quotes from founders

## Learning Resources

To deepen understanding:

### Advaita Vedanta
- Vivekachudamani by Shankaracharya
- Upanishads with Shankara's commentaries
- Modern: Swami Vivekananda, Ramana Maharshi

### Dvaita Vedanta
- Anuvyakhyana by Madhvacharya
- Tattva Vada
- Modern: ISKCON literature, Dvaita scholarly works

## Philosophy vs Practice

While the debate is philosophical:
- **Advaita** emphasizes jnana yoga (knowledge)
- **Dvaita** emphasizes bhakti yoga (devotion)

Both lead practitioners to:
- Self-inquiry
- Ethical living
- Spiritual discipline
- Transcendence of ego

## Conclusion

This debate demonstrates how AI agents can:
1. Embody complex philosophical positions
2. Communicate in classical languages
3. Engage in substantive intellectual discourse
4. Preserve and present cultural heritage

The goal is not to determine a "winner" but to illuminate two profound approaches to understanding reality and achieving spiritual realization.

**सत्यं एकम्, विप्राः बहुधा वदन्ति**  
*Truth is one, the wise speak of it in many ways* - Rig Veda

---

*For questions or contributions, refer to the main repository documentation.*
