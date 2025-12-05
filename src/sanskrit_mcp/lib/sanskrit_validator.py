"""Sanskrit text validation with grammar pattern detection."""

import re
from typing import Optional

from .types import (
    GrammarPatterns,
    Severity,
    ValidationError,
    ValidationResult,
    ValidationWarning,
)
from .panini import PaniniEngine
from .morphology import MorphologicalAnalyzer
from .semantics import SanskritSemanticParser
from .samasa import SamasaAnalyzer


class SanskritValidator:
    """Validator for Sanskrit text and grammar."""

    # Sandhi patterns (phonetic combinations)
    SANDHI_PATTERNS = [
        re.compile(r'[ाेौ]ऽ'),  # vowel sandhi with avagraha
        re.compile(r'त्य'),  # dental-palatal sandhi
        re.compile(r'स्य'),  # sibilant sandhi
        re.compile(r'श्च'),  # palatal sandhi
        re.compile(r'त्त'),  # dental gemination
        re.compile(r'च्च'),  # palatal gemination
        re.compile(r'द्य'),  # dental-semi-vowel
        re.compile(r'ञ्च'),  # nasal-palatal
    ]

    # Vibhakti patterns (case endings)
    VIBHAKTI_PATTERNS = [
        re.compile(r'[ाःंम्]$'),  # Nominative/Accusative endings
        re.compile(r'[ेः]$'),  # Ablative/Genitive
        re.compile(r'ाय$'),  # Dative
        re.compile(r'ात्$'),  # Ablative
        re.compile(r'स्य$'),  # Genitive
        re.compile(r'[िीुूृे]$'),  # Various case endings
    ]

    # Dhatu patterns (verb roots)
    DHATU_PATTERNS = [
        re.compile(r'ति$'),  # 3rd person singular present
        re.compile(r'न्ति$'),  # 3rd person plural present
        re.compile(r'[तन]्त$'),  # past participle
        re.compile(r'त्वा$'),  # gerund
        re.compile(r'त्य$'),  # gerund (Vedic)
        re.compile(r'स्य(ति|न्ति)$'),  # future tense
    ]

    # Compound indicators
    SAMASA_ENDINGS = [
        re.compile(r'त्वम्$'),  # abstract noun suffix
        re.compile(r'ता$'),  # abstract noun suffix
    ]

    def __init__(self) -> None:
        """Initialize validator with default rules."""
        self.allowed_scripts = ["devanagari", "iast", "itrans"]
        self.require_proper_sandhi = True
        self.strict_grammar = False
        self.allow_modern_usage = True
        self.panini_engine = PaniniEngine()
        self.morph_analyzer = MorphologicalAnalyzer()
        self.semantic_parser = SanskritSemanticParser()
        self.samasa_analyzer = SamasaAnalyzer()

    async def validate_text(self, text: str) -> ValidationResult:
        """
        Validate Sanskrit text.

        Args:
            text: Sanskrit text to validate

        Returns:
            ValidationResult with errors, warnings, and pattern analysis
        """
        result = ValidationResult(
            is_valid=True,
            errors=[],
            warnings=[],
            suggestions=[],
            confidence=1.0,
            grammar_patterns=GrammarPatterns(),
        )

        # Normalize text
        normalized_text = self._normalize_text(text)

        # Check for invalid characters
        invalid_chars = self._find_invalid_characters(normalized_text)
        if invalid_chars:
            result.errors.append(
                ValidationError(
                    type="invalid_characters",
                    message=f"Invalid characters: {', '.join(invalid_chars)}",
                    position=0,
                    severity=Severity.HIGH,
                )
            )

        # Check script consistency
        if self._has_mixed_scripts(normalized_text):
            result.warnings.append(
                ValidationWarning(
                    type="mixed_scripts",
                    message="Text contains mixed scripts",
                    position=0,
                    severity=Severity.MEDIUM,
                )
            )

        # Detect Sanskrit grammar patterns
        result.grammar_patterns = self._detect_grammar_patterns(normalized_text)

        # Add Pāṇinian explanations
        panini_explanations = self.panini_engine.explain_sandhi(normalized_text)
        for explanation in panini_explanations:
            result.suggestions.append(explanation)

        # Add Morphological Analysis
        words = normalized_text.split()
        for word in words:
            analyses = self.morph_analyzer.analyze(word)
            for analysis in analyses:
                role = self.morph_analyzer.get_semantic_role(analysis)
                if analysis.category == "noun":
                    result.suggestions.append(
                        f"Morphology ({word}): {analysis.stem} + {analysis.suffix} "
                        f"[{analysis.attributes['case']} {analysis.attributes['number']}] -> Role: {role}"
                    )
                elif analysis.category == "verb":
                    result.suggestions.append(
                        f"Morphology ({word}): {analysis.stem} + {analysis.suffix} "
                        f"[{analysis.attributes['person']} {analysis.attributes['number']}]"
                    )

        # Build Semantic Graph
        semantic_graph = self.semantic_parser.parse_sentence(normalized_text)
        if semantic_graph.nodes and semantic_graph.edges:
            result.semantic_graph = semantic_graph.to_json()
            result.suggestions.append("--- Semantic Network (Kāraka) ---")
            for edge in semantic_graph.edges:
                # Find labels
                source = next(n for n in semantic_graph.nodes if n.id == edge.source_id)
                target = next(n for n in semantic_graph.nodes if n.id == edge.target_id)
                result.suggestions.append(f"{source.label} --[{edge.relation}]--> {target.label}")

        # Add Samāsa Analysis
        words = normalized_text.split()
        for word in words:
            samasa_result = self.samasa_analyzer.analyze(word)
            if samasa_result:
                result.suggestions.append(
                    f"Compound ({word}): {samasa_result.compound_type} -> "
                    f"{' + '.join(samasa_result.constituents)} ({samasa_result.meaning_structure})"
                )

        # Build Morphology Tree
        result.morphology_tree = self._build_morphology_tree(normalized_text)

        # Calculate confidence
        result.confidence = self._calculate_confidence(result)
        result.is_valid = len(result.errors) == 0

        return result

    def _build_morphology_tree(self, text: str) -> list[dict]:
        """Build hierarchical morphology tree for visualization."""
        trees = []
        words = text.split()
        
        for i, word in enumerate(words):
            analyses = self.morph_analyzer.analyze(word)
            if not analyses:
                continue
                
            # Take first analysis for visualization
            analysis = analyses[0]
            
            # Root Node (The Word)
            word_node = {
                "id": f"word-{i}",
                "label": f"{word}",
                "type": "word",
                "details": f"{analysis.category.title()}",
                "children": []
            }
            
            # Stem Node (Prakṛti)
            stem_node = {
                "id": f"stem-{i}",
                "label": f"{analysis.stem}",
                "type": "stem",
                "details": "Prakṛti (Base)",
                "children": []
            }
            
            # Suffix Node (Pratyaya)
            suffix_details = []
            for k, v in analysis.attributes.items():
                suffix_details.append(f"{k}: {v}")
            
            suffix_node = {
                "id": f"suffix-{i}",
                "label": f"{analysis.suffix}",
                "type": "suffix",
                "details": ", ".join(suffix_details),
                "children": []
            }
            
            word_node["children"] = [stem_node, suffix_node]
            trees.append(word_node)
            
        return trees

    def _normalize_text(self, text: str) -> str:
        """Normalize text using Unicode NFC normalization."""
        import unicodedata

        return unicodedata.normalize("NFC", text.strip())

    def _find_invalid_characters(self, text: str) -> list[str]:
        """Find characters not in valid script ranges."""
        # Valid ranges
        devanagari = re.compile(r'[\u0900-\u097F]')
        latin = re.compile(r'[a-zA-Z]')
        numbers = re.compile(r'[0-9]')
        whitespace_punct = re.compile(r'[\s।॥]')

        invalid_chars: list[str] = []
        for char in text:
            if not any(
                pattern.match(char)
                for pattern in [devanagari, latin, numbers, whitespace_punct]
            ):
                if char not in invalid_chars:
                    invalid_chars.append(char)

        return invalid_chars

    def _has_mixed_scripts(self, text: str) -> bool:
        """Check if text mixes Devanagari and Latin scripts."""
        has_devanagari = bool(re.search(r'[\u0900-\u097F]', text))
        has_latin = bool(re.search(r'[a-zA-Z]', text))
        return has_devanagari and has_latin

    def _detect_grammar_patterns(self, text: str) -> GrammarPatterns:
        """
        Detect Sanskrit grammar patterns in text.

        Returns:
            GrammarPatterns with counts of various grammatical features
        """
        patterns = GrammarPatterns()

        # Count sandhi occurrences
        for pattern in self.SANDHI_PATTERNS:
            matches = pattern.findall(text)
            patterns.sandhi += len(matches)

        # Split into words for word-level analysis
        words = re.split(r'[\s।॥]+', text)
        words = [w for w in words if w]  # Remove empty strings

        # Count samasa (compounds)
        for word in words:
            # Heuristic: long words likely compounds
            if len(word) > 8 and re.match(r'[\u0900-\u097F]{8,}', word):
                patterns.samasa += 1

            # Check specific compound endings
            for pattern in self.SAMASA_ENDINGS:
                if pattern.search(word):
                    patterns.samasa += 1
                    break

        # Count vibhakti (case endings)
        for word in words:
            for pattern in self.VIBHAKTI_PATTERNS:
                if pattern.search(word):
                    patterns.vibhakti += 1
                    break

        # Count dhatu (verb forms)
        for word in words:
            for pattern in self.DHATU_PATTERNS:
                if pattern.search(word):
                    patterns.dhatu += 1
                    break

        return patterns

    def _calculate_confidence(self, result: ValidationResult) -> float:
        """Calculate confidence score based on validation results."""
        confidence = 1.0
        confidence -= len(result.errors) * 0.2
        confidence -= len(result.warnings) * 0.1
        return max(0.0, min(1.0, confidence))
