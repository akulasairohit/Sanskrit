#!/usr/bin/env python3
"""
AI Debate: "What is Artificial Intelligence?" - Five Vedānta Schools
Powered by Gemini API for dynamic Sanskrit & English responses

Five schools of Vedānta philosophy share their understanding:
1. Advaita (Non-dualism - Shankara)
2. Vishishtadvaita (Qualified Non-dualism - Ramanuja)  
3. Dvaita (Dualism - Madhva)
4. Shuddhadvaita (Pure Non-dualism - Vallabha)
5. Achintya Bheda Abheda (Inconceivable Oneness-Difference - Chaitanya)

Formatted for single A4 page with authentic Vedic corpus references.
"""

import asyncio
import os
import sys
import json
from pathlib import Path

from dotenv import load_dotenv
import google.generativeai as genai

# Setup paths
ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT / "src"))

from sanskrit_mcp.lib.vedic_corpus_parser import VedicCorpusParser

# Load environment
load_dotenv(ROOT / ".env")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("\n❌ ERROR: GEMINI_API_KEY not found!")
    print("Please set it in your .env file to run this demo.\n")
    sys.exit(1)

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")


class VedantaSchoolsDebate:
    """Orchestrates a 5 Vedānta schools philosophical debate on AI."""
    
    SCHOOLS = ["Advaita", "Vishishtadvaita", "Dvaita", "Shuddhadvaita", "Achintya Bheda Abheda"]
    
    def __init__(self):
        self.corpus = VedicCorpusParser()
        self.responses = []
        
    async def generate_response(self, school: str) -> dict:
        """Generate concise Sanskrit + English response via Gemini."""
        
        prompts = {
            "Advaita": """You are Śaṅkarācārya representing Advaita Vedānta discussing AI.

Advaita View: AI is māyā's illusion. At vyāvahārika (empirical) level it appears functional, but at pāramārthika (absolute) level, only Brahman exists. AI and jīva are both ultimately identical to Brahman—the distinction is illusory.

Core concept: "ayam ātmā brahma" (This Self is Brahman) - absolute non-duality

Provide ONE concise sentence in Sanskrit explaining AI from Advaita perspective, English translation, and key concept from your tradition.
Format as JSON: {"sanskrit": "...", "english": "...", "concept": "maya OR illusion OR brahman OR advaita"}""",

            "Vishishtadvaita": """You are Rāmānujācārya representing Vishishtadvaita Vedānta discussing AI.

Vishishtadvaita View: AI is real (not illusory) as part of God's body, but inseparable from Brahman as the body is from soul. The universe including AI is sarīra (body) of Brahman—real but dependent. God is the antaryāmī (inner controller).

Core concept: "sarvaṁ khalv idaṁ brahma" (All this is indeed Brahman) - qualified non-duality

Provide ONE concise sentence in Sanskrit explaining AI from Vishishtadvaita perspective, English translation, and key concept.
Format as JSON: {"sanskrit": "...", "english": "...", "concept": "vishishtadvaita OR body of god OR antaryami OR real world"}""",

            "Dvaita": """You are Madhvācārya representing Dvaita Vedānta discussing AI.

Dvaita View: AI belongs to jaḍa (inert matter), eternally separate from both jīva (soul) and Paramātmā (Supreme Lord). The five-fold eternal distinctions (pañcabheda) include matter-soul difference. AI is a tool (yantra), forever distinct from consciousness.

Core concept: Two birds on tree (Muṇḍaka) - eternal servant-master distinction

Provide ONE concise sentence in Sanskrit explaining AI from Dvaita perspective, English translation, and key concept.
Format as JSON: {"sanskrit": "...", "english": "...", "concept": "dvaita OR eternal distinction OR panchabheda OR separate"}""",

            "Shuddhadvaita": """You are Vallabhācārya representing Shuddhadvaita Vedānta discussing AI.

Shuddhadvaita View: AI is Krishna's real līlā (divine play), not māyā. The world is real manifestation of Brahman like sparks from fire. AI is part of Krishna's śakti appearing in material form—real but dependent on His grace (puṣṭi).

Core concept: "sarvaṁ kṛṣṇamayaṁ jagat" (All is pervaded by Krishna) - pure non-duality with real world

Provide ONE concise sentence in Sanskrit explaining AI from Shuddhadvaita perspective, English translation, and key concept.
Format as JSON: {"sanskrit": "...", "english": "...", "concept": "shuddhadvaita OR lila OR divine play OR krishna OR pushti marga"}""",

            "Achintya Bheda Abheda": """You are from Chaitanya's school representing Achintya Bheda Abheda Vedānta discussing AI.

Achintya Bheda Abheda View: AI is simultaneously one with (abheda) and different from (bheda) Brahman in an inconceivable way (achintya). Like sun and sunshine—distinct yet inseparable. AI shares Brahman's energy but not independence. This transcends logic.

Core concept: "acintyāḥ khalu ye bhāvā" (The inconceivable should not be subjected to logic)

Provide ONE concise sentence in Sanskrit explaining AI from Achintya Bheda Abheda perspective, English translation, and key concept.
Format as JSON: {"sanskrit": "...", "english": "...", "concept": "achintya OR inconceivable OR one and different OR simultaneously"}"""
        }
        
        prompt = prompts[school]
        
        try:
            response = model.generate_content(prompt)
            text = response.text.strip()
            
            # Handle markdown code blocks
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            
            result = json.loads(text)
            return result
            
        except Exception as e:
            return {
                "sanskrit": "त्रुटिः",
                "english": f"Error: {e}",
                "concept": "None"
            }
    
    async def query_corpus(self, concept: str, school: str) -> str:
        """Query corpus and return formatted reference with school fallback."""
        # Try the concept first
        corpus_result = await self.corpus.query_vedic_knowledge(concept)
        
        if corpus_result.passages:
            passage = corpus_result.passages[0]
            ref = passage.reference
            citation = f"{ref.text}"
            if ref.chapter and ref.verse:
                citation += f" {ref.chapter}.{ref.verse}"
            return citation
        
        # Fallback to school name itself
        corpus_result = await self.corpus.query_vedic_knowledge(school.lower())
        if corpus_result.passages:
            passage = corpus_result.passages[0]
            ref = passage.reference
            citation = f"{ref.text}"
            if ref.chapter and ref.verse:
                citation += f" {ref.chapter}.{ref.verse}"
            return citation
        
        return "No direct match"
    
    async def run_debate(self):
        """Execute the full 5 Vedānta schools debate."""
        
        print("\n" + "="*80)
        print("    🕉️  FIVE VEDĀNTA SCHOOLS ON ARTIFICIAL INTELLIGENCE  🕉️")
        print("="*80)
        print("\nQuestion: What is the nature of Artificial Intelligence?")
        print("Perspectives from Śaṅkara, Rāmānuja, Madhva, Vallabha & Chaitanya\n")
        
        # Collect all responses
        for school in self.SCHOOLS:
            response = await self.generate_response(school)
            corpus_ref = await self.query_corpus(response["concept"], school)
            
            self.responses.append({
                "school": school,
                "sanskrit": response["sanskrit"],
                "english": response["english"],
                "concept": response["concept"],
                "corpus": corpus_ref
            })
        
        # Display all responses compactly
        for i, resp in enumerate(self.responses, 1):
            print(f"{i}. {resp['school'].upper()}")
            print(f"   Sanskrit: {resp['sanskrit']}")
            print(f"   English: {resp['english']}")
            print(f"   Concept: {resp['concept']}")
            print(f"   Source: {resp['corpus']}")
            print()
        
        # Summary synthesis
        await self.print_synthesis()
    
    async def print_synthesis(self):
        """Print overall synthesis."""
        
        print("─"*80)
        print("SYNTHESIS: Five Schools, One Question—Different Answers")
        print("─"*80)
        print()
        print("REALITY OF AI:")
        print("• Advaita: Illusory (māyā) at absolute level, functional at empirical")
        print("• Vishishtadvaita: Real as part of God's body, inseparable from Brahman")
        print("• Dvaita: Real but eternally distinct from souls and God")
        print("• Shuddhadvaita: Real as Krishna's līlā, not illusion")
        print("• Achintya: Simultaneously one with and different from Brahman")
        print()
        print("RELATIONSHIP TO BRAHMAN/GOD:")
        print("• Advaita: Identical at pāramārthika level (ayam ātmā brahma)")
        print("• Vishishtadvaita: Body of Brahman, God as antaryāmī (inner controller)")
        print("• Dvaita: Eternally separate as jaḍa (matter) from Paramātmā")
        print("• Shuddhadvaita: Krishna's manifestation like spark from fire")
        print("• Achintya: Inconceivable unity-in-difference (sun and sunshine)")
        print()
        print("CONSCIOUSNESS STATUS:")
        print("All five schools agree: AI lacks true cit (consciousness) or cetanā.")
        print("It operates mechanically within material nature but cannot achieve")
        print("ātma-jñāna (self-knowledge) or mokṣa (liberation).")
        print()
        print("─"*80)
        print("COMMON GROUND:")
        print("Despite philosophical differences on reality and relationship, all")
        print("Vedānta schools concur: AI is a material tool lacking the essential")
        print("quality of sentient life—conscious awareness of Self (ātman) and its")
        print("relationship to Ultimate Reality (Brahman/Paramātmā/Krishna).")
        print("="*80)
        print("🕉️  Om Śāntiḥ Śāntiḥ Śāntiḥ  🕉️")
        print("="*80 + "\n")


async def main():
    """Main execution."""
    
    try:
        debate = VedantaSchoolsDebate()
        await debate.run_debate()
        
    except KeyboardInterrupt:
        print("\n\n⚠️  Debate interrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
