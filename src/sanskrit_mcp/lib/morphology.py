"""
Morphological Analyzer for Sanskrit MCP.

This module decomposes Sanskrit words into their constituent parts:
- Prakṛti (Stem/Root)
- Pratyaya (Suffix)
- Vibhakti (Case)
- Vacana (Number)
- Liṅga (Gender)

It implements the 'subanta' (nominal) and 'tiṅanta' (verbal) analysis.
"""

from dataclasses import dataclass
from typing import List, Optional, Dict

@dataclass
class MorphAnalysis:
    """Result of morphological analysis."""
    original: str
    stem: str
    suffix: str
    category: str  # "noun", "verb", "indeclinable"
    attributes: Dict[str, str]  # e.g., {"case": "3", "number": "1", "gender": "m"}
    meaning: Optional[str] = None

class MorphologicalAnalyzer:
    """
    Analyzer for decomposing Sanskrit words.
    Currently focuses on common Noun (Subanta) and Verb (Tiṅanta) patterns.
    """

    def __init__(self):
        # Basic database of endings (sup-pratyaya)
        # Format: ending -> (case, number)
        # Simplified for 'a' ending masculine (Rama-shabda)
        self.ram_shabda_endings = {
            "ः": {"case": "Nominative", "number": "Singular"},     # Rāmaḥ
            "ौ": {"case": "Nominative", "number": "Dual"},         # Rāmau
            "ाः": {"case": "Nominative", "number": "Plural"},      # Rāmāḥ
            "म्": {"case": "Accusative", "number": "Singular"},    # Rāmam
            "ेन": {"case": "Instrumental", "number": "Singular"},  # Devena
            "ेण": {"case": "Instrumental", "number": "Singular"},  # Rāmeṇa (Natva)
            "ाय": {"case": "Dative", "number": "Singular"},        # Rāmāya
            "ात्": {"case": "Ablative", "number": "Singular"},     # Rāmāt
            "स्य": {"case": "Genitive", "number": "Singular"},     # Rāmasya
            "े": {"case": "Locative", "number": "Singular"},       # Rāme
        }
        
        # Basic verb endings (tiṅ-pratyaya) - Parasmaipada Present
        self.verb_endings = {
            "ति": {"person": "3rd", "number": "Singular"},  # Gacchati
            "तः": {"person": "3rd", "number": "Dual"},      # Gacchataḥ
            "न्ति": {"person": "3rd", "number": "Plural"},  # Gacchanti
            "सि": {"person": "2nd", "number": "Singular"},  # Gacchasi
            "मि": {"person": "1st", "number": "Singular"},  # Gacchāmi
        }

    def analyze(self, word: str) -> List[MorphAnalysis]:
        """
        Analyze a word and return possible morphological decompositions.
        """
        analyses = []
        word = word.strip()
        
        # 1. Check Noun Patterns (Subanta)
        for ending, attrs in self.ram_shabda_endings.items():
            if word.endswith(ending):
                stem = word[:-len(ending)]
                # Heuristic: If stem ends in 'a' (implicit) or consonant
                # For 'a' ending masculine, we often need to add 'a' back
                # e.g. Rāmāt -> Rāma
                if ending == "ात्":
                    stem += "a"
                elif ending == "स्य":
                    stem += "a"
                elif ending == "ः":
                    stem += "a"
                
                analyses.append(MorphAnalysis(
                    original=word,
                    stem=stem,
                    suffix=ending,
                    category="noun",
                    attributes={
                        "gender": "Masculine (likely)",
                        **attrs
                    }
                ))

        # 2. Check Verb Patterns (Tiṅanta)
        for ending, attrs in self.verb_endings.items():
            if word.endswith(ending):
                stem = word[:-len(ending)]
                analyses.append(MorphAnalysis(
                    original=word,
                    stem=stem,
                    suffix=ending,
                    category="verb",
                    attributes={
                        "tense": "Present (Laṭ)",
                        **attrs
                    }
                ))

        return analyses

    def get_semantic_role(self, analysis: MorphAnalysis) -> str:
        """Map grammatical case to semantic role (Kāraka)."""
        if analysis.category != "noun":
            return "Action/Process"
            
        case = analysis.attributes.get("case")
        roles = {
            "Nominative": "Kartā (Agent/Subject)",
            "Accusative": "Karma (Object)",
            "Instrumental": "Karaṇa (Instrument)",
            "Dative": "Sampradāna (Recipient/Purpose)",
            "Ablative": "Apādāna (Source/Separation)",
            "Genitive": "Sambandha (Relation - non-Kāraka)",
            "Locative": "Adhikaraṇa (Locus/Location)",
        }
        return roles.get(case, "Unknown")
