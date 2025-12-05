import asyncio
from sanskrit_mcp.lib.sanskrit_validator import SanskritValidator

async def test_morphology():
    validator = SanskritValidator()
    
    # Test cases with expected Morphology
    test_cases = [
        "रामेण",   # Rama + ena (Instr. Sing.)
        "गच्छति",  # Gam + ti (3rd Sing.)
        "रामाय",   # Rama + aya (Dat. Sing.)
        "वनात्",   # Vana + at (Abl. Sing.)
    ]
    
    print("🕉️ Testing Morphological Analyzer...\n")
    
    for text in test_cases:
        print(f"Analyzing: {text}")
        result = await validator.validate_text(text)
        
        found_morph = False
        if result.suggestions:
            for suggestion in result.suggestions:
                if "Morphology" in suggestion:
                    print(f"  ✅ {suggestion}")
                    found_morph = True
        
        if not found_morph:
            print("  ❌ No morphological analysis found.")
        print()

if __name__ == "__main__":
    asyncio.run(test_morphology())
