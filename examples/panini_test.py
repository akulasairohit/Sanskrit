import asyncio
from sanskrit_mcp.lib.sanskrit_validator import SanskritValidator

async def test_panini():
    validator = SanskritValidator()
    
    # Test cases with expected Sandhi
    test_cases = [
        "गजानन",  # Gaja + Anana (Savarna Dirgha)
        "रमेश",   # Rama + Isha (Guna)
        "यद्यपि", # Yadi + Api (Yan)
    ]
    
    print("🕉️ Testing Pāṇinian Rule Engine...\n")
    
    for text in test_cases:
        print(f"Analyzing: {text}")
        result = await validator.validate_text(text)
        
        if result.suggestions:
            print("  ✅ Pāṇinian Explanations found:")
            for suggestion in result.suggestions:
                print(f"    - {suggestion}")
        else:
            print("  ❌ No explanations found.")
        print()

if __name__ == "__main__":
    asyncio.run(test_panini())
