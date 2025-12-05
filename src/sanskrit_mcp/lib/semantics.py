"""
Semantic Network Builder for Sanskrit MCP.

This module implements Briggs' vision of mapping Sanskrit syntax to Semantic Nets.
It uses morphological analysis to extract Kāraka (semantic roles) and builds
a knowledge graph centered around the Kriyā (Action).
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional
from .morphology import MorphologicalAnalyzer, MorphAnalysis

@dataclass
class SemanticNode:
    """A node in the semantic network (Concept)."""
    id: str
    label: str
    type: str  # "action", "object", "agent", etc.
    metadata: Dict[str, str] = field(default_factory=dict)

@dataclass
class SemanticEdge:
    """An edge in the semantic network (Relation)."""
    source_id: str
    target_id: str
    relation: str  # e.g., "agent", "object", "instrument"
    metadata: Dict[str, str] = field(default_factory=dict)

@dataclass
class SemanticGraph:
    """A semantic network graph."""
    nodes: List[SemanticNode] = field(default_factory=list)
    edges: List[SemanticEdge] = field(default_factory=list)

    def add_node(self, node: SemanticNode):
        self.nodes.append(node)

    def add_edge(self, edge: SemanticEdge):
        self.edges.append(edge)

    def to_json(self):
        return {
            "nodes": [vars(n) for n in self.nodes],
            "edges": [vars(e) for e in self.edges]
        }

class SanskritSemanticParser:
    """
    Parses Sanskrit text into Semantic Networks.
    """

    def __init__(self):
        self.morph_analyzer = MorphologicalAnalyzer()

    def parse_sentence(self, text: str) -> SemanticGraph:
        """
        Parse a Sanskrit sentence into a semantic graph.
        """
        graph = SemanticGraph()
        words = text.split()
        
        action_node = None
        participant_nodes = []

        # 1. Analyze all words
        for word in words:
            analyses = self.morph_analyzer.analyze(word)
            if not analyses:
                continue
            
            # Heuristic: Take the first valid analysis
            # In a real system, we would handle ambiguity
            analysis = analyses[0]
            
            if analysis.category == "verb":
                # Found the Action (Kriyā)
                node = SemanticNode(
                    id=f"action_{word}",
                    label=f"{analysis.stem} ({word})",
                    type="Action",
                    metadata=analysis.attributes
                )
                graph.add_node(node)
                action_node = node
                
            elif analysis.category == "noun":
                # Found a Participant (Kāraka)
                role = self.morph_analyzer.get_semantic_role(analysis)
                # Extract simple role name (e.g., "Kartā (Agent/Subject)" -> "agent")
                simple_role = self._simplify_role(role)
                
                node = SemanticNode(
                    id=f"entity_{word}",
                    label=f"{analysis.stem} ({word})",
                    type="Entity",
                    metadata={
                        "role": role,
                        **analysis.attributes
                    }
                )
                graph.add_node(node)
                participant_nodes.append((node, simple_role))

        # 2. Link Participants to Action
        if action_node:
            for node, role in participant_nodes:
                edge = SemanticEdge(
                    source_id=action_node.id,
                    target_id=node.id,
                    relation=role
                )
                graph.add_edge(edge)
        
        return graph

    def _simplify_role(self, full_role: str) -> str:
        """Convert full Kāraka description to simple relation label."""
        if "Kartā" in full_role: return "agent"
        if "Karma" in full_role: return "object"
        if "Karaṇa" in full_role: return "instrument"
        if "Sampradāna" in full_role: return "recipient"
        if "Apādāna" in full_role: return "source"
        if "Adhikaraṇa" in full_role: return "location"
        if "Sambandha" in full_role: return "related_to"
        return "unknown_relation"
