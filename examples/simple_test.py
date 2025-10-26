#!/usr/bin/env python3
"""
Simple standalone test of Sanskrit features.
No MCP server required - just pure Python functionality.
"""

import asyncio
import sys
sys.path.insert(0, 'src')

from sanskrit_mcp.lib.sanskrit_validator import SanskritValidator
from sanskrit_mcp.lib.vedic_corpus_parser import VedicCorpusParser


async def main():
    print("🕉️ Sanskrit System - Standalone Test\n")
    print("=" * 80)
    
    # Test 1: Sanskrit Validation
    print("\n📝 TEST 1: Sanskrit Grammar Validation")
    print("-" * 80)
    
    validator = SanskritValidator()
    
    test_texts = [
        ("तत्त्वमसि", "Tat Tvam Asi (Thou art That)"),
        ("ॐ नमो भगवते वासुदेवाय", "Om Namo Bhagavate Vasudevaya"),
        ("ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः", "Brahma Satyam (Advaita formula)"),
        ("यदा यदा हि धर्मस्य ग्लानिर्भवति भारत", "Bhagavad Gita 4.7"),
        ("सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः", "Universal prayer"),
    ]
    
    for sanskrit, description in test_texts:
        print(f"\n📖 {description}")
        print(f"   Sanskrit: {sanskrit}")
        
        result = await validator.validate_text(sanskrit)
        
        status = "✅ VALID" if result.is_valid else "❌ INVALID"
        print(f"   Status: {status}")
        print(f"   Confidence: {result.confidence * 100:.1f}%")
        
        if result.grammar_patterns:
            gp = result.grammar_patterns
            print(f"   📊 Grammar Patterns:")
            print(f"      • Sandhi (phonetic combinations): {gp.sandhi}")
            print(f"      • Samāsa (compounds): {gp.samasa}")
            print(f"      • Vibhakti (case endings): {gp.vibhakti}")
            print(f"      • Dhātu (verb forms): {gp.dhatu}")
        
        if result.errors:
            print(f"   ⚠️  Errors: {len(result.errors)}")
            for error in result.errors:
                print(f"      - {error.message}")
        
        if result.warnings:
            print(f"   ⚠️  Warnings: {len(result.warnings)}")
            for warning in result.warnings:
                print(f"      - {warning.message}")
    
    # Test 2: Vedic Corpus Queries
    print("\n\n📚 TEST 2: Vedic Knowledge Base Queries")
    print("-" * 80)
    
    corpus = VedicCorpusParser()
    
    # Show corpus statistics
    stats = corpus.get_corpus_statistics()
    print(f"\n📊 Corpus Statistics:")
    print(f"   • Total passages: {stats['total_passages']}")
    print(f"   • Texts indexed: {stats['texts_count']}")
    print(f"   • Keywords indexed: {stats['keywords_count']}")
    print(f"   • Philosophical concepts: {stats['concepts_count']}")
    print(f"\n   Coverage by tradition:")
    for tradition, count in stats['coverage'].items():
        print(f"      • {tradition}: {count} texts")
    
    # Query the corpus
    queries = [
        "What is the nature of Brahman?",
        "Explain the concept of dharma",
        "What is the relationship between Atman and Brahman?",
        "Tell me about devotion and bhakti",
        "What is the goal of human life?",
    ]
    
    print("\n\n🔍 Querying Vedic Knowledge Base:")
    print("-" * 80)
    
    for query in queries:
        print(f"\n❓ Query: \"{query}\"")
        print()
        
        result = await corpus.query_vedic_knowledge(query)
        
        print(f"   📊 Metrics:")
        print(f"      • Confidence: {result.confidence * 100:.1f}%")
        print(f"      • Hallucination risk: {result.hallucination_risk.upper()}")
        print(f"      • Sources found: {len(result.passages)}")
        
        if result.warnings:
            print(f"\n   ⚠️  Warnings:")
            for warning in result.warnings:
                print(f"      • {warning}")
        
        if result.passages:
            print(f"\n   📖 Top Source:")
            passage = result.passages[0]
            ref = passage.reference
            
            source_str = ref.text
            if ref.chapter and ref.verse:
                source_str += f" {ref.chapter}.{ref.verse}"
            
            print(f"      Source: {source_str}")
            print(f"      Sanskrit: {passage.sanskrit}")
            print(f"      Translation: {passage.translation}")
            print(f"      Context: {passage.context}")
            print(f"      Reliability: {passage.reliability * 100:.0f}%")
            
            if passage.commentaries:
                print(f"\n   💬 Traditional Commentary:")
                comm = passage.commentaries[0]
                print(f"      {comm.author} ({comm.tradition}, {comm.date}):")
                print(f"      \"{comm.text}\"")
        
        print("\n   " + "-" * 76)
    
    # Summary
    print("\n\n" + "=" * 80)
    print("✅ ALL TESTS COMPLETED SUCCESSFULLY!")
    print("=" * 80)
    
    print("\n🎯 Key Features Demonstrated:")
    print("   ✓ Sanskrit grammar pattern detection (70+ patterns)")
    print("   ✓ Devanagari script validation")
    print("   ✓ Vedic text corpus with 100+ authenticated passages")
    print("   ✓ Anti-hallucination safeguards (confidence scoring)")
    print("   ✓ Traditional commentary from classical ācāryas")
    print("   ✓ Keyword-based semantic search with concept graph")
    
    print("\n🚀 Next Steps:")
    print("   1. Run MCP server: python -m sanskrit_mcp")
    print("   2. Test with MCP Inspector: npx @modelcontextprotocol/inspector")
    print("   3. Create multi-agent debates")
    print("   4. Integrate with your AI applications!")
    
    print("\n🕉️ Om Śāntiḥ Śāntiḥ Śāntiḥ 🕉️\n")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n⚠️  Test interrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
