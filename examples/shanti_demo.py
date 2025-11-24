import asyncio
import sys
from pathlib import Path

# Add src to path
ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT / "src"))

from sanskrit_mcp.lib.sanskrit_validator import SanskritValidator
from sanskrit_mcp.lib.vedic_corpus_parser import VedicCorpusParser

# 1. The Data: Shanti Mantra broken into lines
# Note: We split the Sandhi (joined words) slightly for easier reading, 
# but keep the grammar intact.
SHANTI_MANTRA = [
    {
        "text": "ॐ सह नाववतु।",
        "translation": "Om. May He protect us both together.",
        "context": "Invocation for protection (Teacher & Student)"
    },
    {
        "text": "सह नौ भुनक्तु।",
        "translation": "May He nourish us both together.",
        "context": "Invocation for nourishment/enjoyment"
    },
    {
        "text": "सह वीर्यं करवावहै।",
        "translation": "May we both work together with great energy.",
        "context": "Commitment to effort"
    },
    {
        "text": "तेजस्वि नावधीतमस्तु मा विद्विषावहै॥",
        "translation": "May our study be vigorous and effective. May we not hate each other.",
        "context": "Prayer for clarity and harmony"
    },
    {
        "text": "ॐ शान्तिः शान्तिः शान्तिः॥",
        "translation": "Om. Peace, Peace, Peace.",
        "context": "Closing invocation for three-fold peace (Divine, Environmental, Personal)"
    }
]

async def analyze_shanti_mantra():
    print("\n" + "="*80)
    print("🕉️  SHANTI MANTRA ANALYSIS (Saha Nāvavatu)")
    print("="*80)
    print("\n📜 Origin: Taittirīya Upaniṣad")
    print("   Theme: Peace between Teacher and Student\n")

    # Initialize validator
    validator = SanskritValidator()
    corpus = VedicCorpusParser()
    
    for i, verse in enumerate(SHANTI_MANTRA, 1):
        print(f"\n{'='*80}")
        print(f"LINE {i}")
        print(f"{'='*80}\n")
        
        print(f"📖 Sanskrit:\n   {verse['text']}\n")
        print(f"🌍 Translation:\n   {verse['translation']}\n")
        
        # Real-time grammar validation
        validation = await validator.validate_text(verse['text'])
        
        print(f"📊 Grammar Validation:")
        print(f"   Status: {'✅ Valid' if validation.is_valid else '❌ Invalid'}")
        print(f"   Confidence: {validation.confidence * 100:.1f}%")
        
        if validation.grammar_patterns:
            gp = validation.grammar_patterns
            print(f"   Patterns Detected:")
            print(f"      • Sandhi (phonetic combinations): {gp.sandhi}")
            print(f"      • Samāsa (compounds): {gp.samasa}")
            print(f"      • Vibhakti (case endings): {gp.vibhakti}")
            print(f"      • Dhātu (verb forms): {gp.dhatu}\n")
        
        # Specific Grammatical Highlight for this mantra:
        if "नाववतु" in verse['text']:
            print("💡 Grammar Highlight: SANDHI & DUAL CASE")
            print("   • 'nāvavatu' is a Sandhi (combination) of:")
            print("     nau (us two) + avatu (may he protect)")
            print("   • 'nau' is the DUAL form (Dvivacana), specific to Sanskrit.")

        elif "करवावहै" in verse['text']:
             print("💡 Grammar Highlight: VERB FORM")
             print("   • 'karavāvahai' (May we two do)")
             print("   • First Person, Dual Number, Imperative Mood (Lot Lakara)")

        elif "शान्तिः" in verse['text']:
            print("💡 Grammar Highlight: THREE-FOLD PEACE")
            print("   • Triple repetition signifies:")
            print("     1. Adhidaivika (Divine realm) - peace from gods/fate")
            print("     2. Adhibhautika (Material realm) - peace from environment/others")
            print("     3. Adhyātmika (Personal realm) - peace from within oneself")

    print("\n" + "="*80)
    print("✅ Analysis Complete!")
    print("="*80)

if __name__ == "__main__":
    asyncio.run(analyze_shanti_mantra())