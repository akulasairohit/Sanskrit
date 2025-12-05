"""
Pāṇinian Grammar Engine for Sanskrit MCP.

This module implements a deterministic rule-based engine based on Pāṇini's Aṣṭādhyāyī.
It moves beyond regex pattern matching to generative rule application.
"""

from dataclasses import dataclass
from typing import List, Optional, Tuple
import re

@dataclass
class Sutra:
    """Represents a Pāṇinian Sūtra (rule)."""
    id: str  # e.g., "6.1.77"
    text: str  # e.g., "iko yaṇaci"
    description: str
    type: str  # "vidhi" (operational), "samjna" (definitional), etc.

@dataclass
class SandhiResult:
    """Result of a Sandhi operation."""
    original: str
    modified: str
    rule_applied: Optional[Sutra]
    confidence: float

class PaniniEngine:
    """
    Deterministic engine implementing Pāṇinian rules.
    Currently focused on Sandhi (Euphonic Combination).
    """
    
    def __init__(self):
        self.rules = self._initialize_rules()
        
    def _initialize_rules(self) -> List[Sutra]:
        """Initialize the database of supported Sūtras."""
        return [
            Sutra("6.1.77", "iko yaṇaci", "ik (i, u, ṛ, ḷ) + ac (vowel) -> yaṇ (y, v, r, l)", "vidhi"),
            Sutra("6.1.87", "ādguṇaḥ", "a/ā + ac (i, u, ṛ, ḷ) -> guṇa (e, o, ar, al)", "vidhi"),
            Sutra("6.1.101", "akaḥ savarṇe dīrghaḥ", "ak + savarṇa (similar) -> dīrgha (long)", "vidhi"),
        ]

    def apply_sandhi(self, term1: str, term2: str) -> SandhiResult:
        """
        Apply Sandhi rules to combine two terms.
        This is a simplified implementation of the rules.
        """
        # Normalize inputs
        t1 = term1.strip()
        t2 = term2.strip()
        
        if not t1 or not t2:
            return SandhiResult(f"{t1} {t2}", f"{t1} {t2}", None, 1.0)

        last_char = t1[-1]
        first_char = t2[0]
        
        # Rule 6.1.101: Akaḥ savarṇe dīrghaḥ (Long vowel sandhi)
        # a/ā + a/ā -> ā
        if last_char in ['अ', 'आ'] and first_char in ['अ', 'आ']:
            return SandhiResult(
                f"{t1} + {t2}",
                t1[:-1] + 'आ' + t2[1:],
                next(r for r in self.rules if r.id == "6.1.101"),
                1.0
            )
        # i/ī + i/ī -> ī
        if last_char in ['इ', 'ई'] and first_char in ['इ', 'ई']:
            return SandhiResult(
                f"{t1} + {t2}",
                t1[:-1] + 'ई' + t2[1:],
                next(r for r in self.rules if r.id == "6.1.101"),
                1.0
            )
            
        # Rule 6.1.77: Iko yaṇaci (Yan sandhi)
        # i/ī + dissimilar vowel -> y
        if last_char in ['इ', 'ई'] and first_char in ['अ', 'आ', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ']:
            return SandhiResult(
                f"{t1} + {t2}",
                t1[:-1] + 'य्' + t2,  # Simplified joining
                next(r for r in self.rules if r.id == "6.1.77"),
                0.95
            )
            
        # Rule 6.1.87: Ādguṇaḥ (Guna sandhi)
        # a/ā + i/ī -> e
        if last_char in ['अ', 'आ'] and first_char in ['इ', 'ई']:
            return SandhiResult(
                f"{t1} + {t2}",
                t1[:-1] + 'ए' + t2[1:],
                next(r for r in self.rules if r.id == "6.1.87"),
                1.0
            )
        # a/ā + u/ū -> o
        if last_char in ['अ', 'आ'] and first_char in ['उ', 'ऊ']:
            return SandhiResult(
                f"{t1} + {t2}",
                t1[:-1] + 'ओ' + t2[1:],
                next(r for r in self.rules if r.id == "6.1.87"),
                1.0
            )

        # Default: No sandhi applied
        return SandhiResult(f"{t1} + {t2}", f"{t1} {t2}", None, 0.0)

    def explain_sandhi(self, text: str) -> List[str]:
        """
        Attempt to explain existing sandhi in text by reversing rules.
        (Heuristic reverse-engineering for validation).
        """
        explanations = []
        
        # Check for Yan Sandhi patterns (y, v, r before vowels)
        # This is a basic heuristic to demonstrate the concept
        if '्य' in text:
            explanations.append(f"Possible Yan Sandhi (6.1.77): 'y' may be derived from 'i' + vowel")
            
        # Check for Guna patterns (e, o)
        if 'े' in text or 'ो' in text:
            explanations.append(f"Possible Guna Sandhi (6.1.87): 'e/o' may be derived from 'a' + vowel")
            
        # Check for Savarna Dirgha patterns (ā, ī, ū)
        if 'ा' in text or 'ी' in text or 'ू' in text:
            explanations.append(f"Possible Savarna Dirgha (6.1.101): Long vowel may be derived from two similar vowels")
            
        return explanations
