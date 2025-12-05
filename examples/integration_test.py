import asyncio
import json
from dataclasses import asdict
from sanskrit_mcp.lib.sanskrit_validator import SanskritValidator

async def test_integration():
    validator = SanskritValidator()
    
    # Test sentence: "Rāma goes to the forest"
    text = "रामः वनम् गच्छति"
    
    print(f"🕉️ Testing Integration for: {text}\n")
    
    result = await validator.validate_text(text)
    
    # Check if result has the new fields
    print("Checking result structure...")
    
    if result.semantic_graph:
        print("  ✅ semantic_graph found")
        print(f"     Nodes: {len(result.semantic_graph['nodes'])}")
        print(f"     Edges: {len(result.semantic_graph['edges'])}")
    else:
        print("  ❌ semantic_graph MISSING")
        
    if result.morphology_tree:
        print("  ✅ morphology_tree found")
        print(f"     Words: {len(result.morphology_tree)}")
        # Check structure of first word
        first_word = result.morphology_tree[0]
        if "children" in first_word and len(first_word["children"]) > 0:
             print("     ✅ Tree structure looks valid (has children)")
        else:
             print("     ❌ Tree structure invalid (no children)")
    else:
        print("  ❌ morphology_tree MISSING")

    # Simulate JSON serialization (as done in MCP server)
    try:
        json_output = json.dumps(asdict(result), default=str)
        print("\n  ✅ JSON Serialization successful")
        # print(json_output[:200] + "...") # Print snippet
    except Exception as e:
        print(f"\n  ❌ JSON Serialization FAILED: {e}")

if __name__ == "__main__":
    asyncio.run(test_integration())
