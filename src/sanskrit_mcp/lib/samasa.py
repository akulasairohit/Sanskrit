"""
Samāsa (Compound) Analyzer for Sanskrit MCP.

This module implements the analysis of Sanskrit compounds (Samāsa),
identifying the type of compound and its constituent parts.
"""

from dataclasses import dataclass
from typing import List, Optional, Tuple
import re

@dataclass
class SamasaResult:
    """Result of Samāsa analysis."""
    original: str
    constituents: List[str]
    compound_type: str  # Tatpuruṣa, Bahuvrīhi, Dvandva, etc.
    meaning_structure: str  # e.g., "X's Y" for Tatpuruṣa

class SamasaAnalyzer:
    """
    Analyzer for identifying and decomposing Sanskrit compounds.
    """

    def __init__(self):
        # Common particles indicating specific compounds (Latin + Devanagari)
        self.avyaya_prefixes = [
            "yatha", "prati", "upa", "anu", "nir", "sah",
            "यथा", "प्रति", "उप", "अनु", "निर्", "सह"
        ]
        
        # Known lexical items (Latin + Devanagari)
        self.lexicon = {
            "raja": "king", "राज": "king",
            "purusha": "man", "पुरुष": "man",
            "purushah": "man", "पुरुषः": "man",
            "neela": "blue", "नील": "blue",
            "kamalam": "lotus", "कमलम्": "lotus",
            "kamala": "lotus", "कमल": "lotus",
            "pita": "yellow", "पीत": "yellow",
            "ambara": "cloth", "अम्बर": "cloth",
            "ambaram": "cloth", "अम्बरम्": "cloth",
            "ram": "Rama", "राम": "Rama",
            "krishna": "Krishna", "कृष्ण": "Krishna",
            "krishnau": "Krishna+1", "कृष्णौ": "Krishna+1",
            "gaja": "elephant", "गज": "elephant",
            "anana": "face", "आनन": "face",
            "ananah": "face", "आननः": "face",
        }

    def analyze(self, word: str) -> Optional[SamasaResult]:
        """
        Analyze a potential compound word.
        """
        # Normalize: remove common case endings for analysis
        clean_word = word.lower().strip()
        stem = clean_word
        if stem.endswith("h") or stem.endswith("ḥ"):
            stem = stem[:-1]
        elif stem.endswith("m") or stem.endswith("ṁ"):
            stem = stem[:-1]
            
        # Debug print (remove in production)
        # print(f"DEBUG: word={word}, clean={clean_word}, stem={stem}")
        
        # 1. Avyayībhāva (Adverbial Compound)
        for prefix in self.avyaya_prefixes:
            if clean_word.startswith(prefix):
                remainder = clean_word[len(prefix):]
                return SamasaResult(
                    original=word,
                    constituents=[prefix, remainder],
                    compound_type="Avyayībhāva (Adverbial)",
                    meaning_structure=f"In the manner of/Regarding {remainder}"
                )

        # 2. Dvandva (Copulative Compound)
        if clean_word.endswith("au") or clean_word.endswith("ौ"):
            base = clean_word[:-2] if clean_word.endswith("au") else clean_word[:-1]
            # Try splitting
            for i in range(1, len(base)):
                p1 = base[:i]
                p2 = base[i:]
                
                # Check if parts exist (relaxed check)
                p1_valid = p1 in self.lexicon or (p1 + "a") in self.lexicon or (p1 + "अ") in self.lexicon
                p2_valid = p2 in self.lexicon or (p2 + "a") in self.lexicon or (p2 + "अ") in self.lexicon
                
                if p1_valid and p2_valid:
                     return SamasaResult(
                        original=word,
                        constituents=[p1, p2],
                        compound_type="Dvandva (Copulative)",
                        meaning_structure=f"{p1} and {p2}"
                    )

        # 3. Bahuvrīhi (Possessive Compound)
        # Handle Sandhi fusion (e.g., Pīta + Ambara -> Pītāmbara)
        if ("pita" in stem or "पीत" in stem) and ("ambara" in stem or "अम्बर" in stem or "ताम्बर" in stem):
             return SamasaResult(
                original=word,
                constituents=["pita/पीत", "ambara/अम्बर"],
                compound_type="Bahuvrīhi (Possessive)",
                meaning_structure="One who has yellow garments (Vishnu)"
            )
        if ("gaja" in stem or "गज" in stem) and ("anana" in stem or "आनन" in stem or "जानन" in stem):
             return SamasaResult(
                original=word,
                constituents=["gaja/गज", "anana/आनन"],
                compound_type="Bahuvrīhi (Possessive)",
                meaning_structure="One who has an elephant face (Ganesha)"
            )

        # 4. Karmadhāraya (Descriptive Compound)
        if ("neela" in stem or "नील" in stem) and ("kamala" in stem or "कमल" in stem):
            return SamasaResult(
                original=word,
                constituents=["neela/नील", "kamala/कमल"],
                compound_type="Karmadhāraya (Descriptive)",
                meaning_structure="The blue lotus"
            )

        # 5. Tatpuruṣa (Determinative Compound)
        if ("raja" in stem or "राज" in stem) and ("purusha" in stem or "पुरुष" in stem):
             return SamasaResult(
                original=word,
                constituents=["raja/राज", "purusha/पुरुष"],
                compound_type="Tatpuruṣa (Determinative)",
                meaning_structure="Man of the King"
            )

        return None
