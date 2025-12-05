import asyncio
from sanskrit_mcp.lib.sanskrit_validator import SanskritValidator

async def test_semantics():
    validator = SanskritValidator()
    
    # Test cases for Semantic Network
    # "Rama goes to the forest" (Rama: Agent, Forest: Destination, Goes: Action)
    # "Rama goes by chariot" (Rama: Agent, Chariot: Instrument, Goes: Action)
    test_cases = [
        "रामः वनम् गच्छति",  # Rama goes to forest
        "रामेण गच्छति",      # Goes by Rama (Instrument/Agent in passive, but here testing instrument)
        "रामाय ददाति",      # Gives to Rama (Recipient)
    ]
    
    print("🕉️ Testing Semantic Network Builder...\n")
    
    for text in test_cases:
        print(f"Analyzing: {text}")
        result = await validator.validate_text(text)
        
        found_semantics = False
        if result.suggestions:
            for suggestion in result.suggestions:
                if "Semantic Network" in suggestion or "--[" in suggestion:
                    print(f"  ✅ {suggestion}")
                    found_semantics = True
        
        if not found_semantics:
            print("  ❌ No semantic network built.")
        print()

if __name__ == "__main__":
    asyncio.run(test_semantics())
