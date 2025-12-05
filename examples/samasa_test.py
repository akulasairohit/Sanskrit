import asyncio
from sanskrit_mcp.lib.sanskrit_validator import SanskritValidator

async def test_samasa():
    validator = SanskritValidator()
    
    # Test cases for Samāsa (Compounds)
    test_cases = [
        "राजपुरुषः",     # Tatpurusha (King's man)
        "नीलकमलम्",     # Karmadharaya (Blue lotus)
        "पीताम्बरः",      # Bahuvrihi (Vishnu)
        "रामकृष्णौ",     # Dvandva (Rama and Krishna)
        "गजाननः",       # Bahuvrihi (Ganesha)
        "यथाशक्ति",      # Avyayibhava (According to power)
    ]
    
    print("🕉️ Testing Samāsa (Compound) Analyzer...\n")
    
    for text in test_cases:
        print(f"Analyzing: {text}")
        result = await validator.validate_text(text)
        
        found_samasa = False
        if result.suggestions:
            for suggestion in result.suggestions:
                if "Compound" in suggestion:
                    print(f"  ✅ {suggestion}")
                    found_samasa = True
        
        if not found_samasa:
            print("  ❌ No compound analysis found.")
        print()

if __name__ == "__main__":
    asyncio.run(test_samasa())
