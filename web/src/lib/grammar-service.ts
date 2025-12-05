import { GoogleGenerativeAI } from "@google/generative-ai";

export interface GrammarAnalysisResult {
    response: string;
    grammarData?: any;
}

export class GrammarService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    }

    async analyzeGrammar(message: string, pythonContext?: any): Promise<GrammarAnalysisResult> {
        try {
            let contextStr = "";
            if (pythonContext && Object.keys(pythonContext).length > 0) {
                contextStr = `\nHere is some preliminary rule-based analysis to help you (use this to ensure accuracy): ${JSON.stringify(pythonContext)}`;
            }

            const prompt = `
                Analyze the Sanskrit grammar of the following text: "${message}".${contextStr}
                
                1. Provide a clear, educational explanation in markdown.
                2. AT THE END, provide a JSON block wrapped in \`\`\`json ... \`\`\` with the following structure for visualization:
                {
                    "sentence": "${message}",
                    "breakdown": [
                        {
                            "original_text": "substring",
                            "split_form": "split form",
                            "meaning": "meaning",
                            "category": "noun" | "verb" | "indeclinable" | "compound" | "other",
                            "details": "grammar details"
                        }
                    ],
                    "graph": {
                        "nodes": [
                            { "id": "unique_id", "position": { "x": 0, "y": 0 }, "data": { "label": "Label" }, "style": { "background": "color", "color": "white", "borderRadius": "8px", "padding": "10px" } }
                        ],
                        "edges": [
                            { "id": "e1", "source": "source_id", "target": "target_id", "label": "Relation (e.g. Karta)", "animated": true }
                        ]
                    },
                    "morphology_tree": {
                        "id": "root",
                        "label": "${message}",
                        "type": "word",
                        "details": "Sentence",
                        "children": [
                            { "id": "child1", "label": "Word1", "type": "word", "details": "Grammar", "children": [] }
                        ]
                    }
                }
                
                For the graph: Create a Karaka (semantic) dependency graph. Nodes are words/concepts, edges are relations (Karta, Karma, etc.).
                For the morphology_tree: Create a hierarchical breakdown (Prakriti-Pratyaya) for the main words.
            `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const fullText = response.text();

            // Extract JSON
            const jsonMatch = fullText.match(/```json\n([\s\S]*?)\n```/);
            let grammarData = null;
            let responseText = fullText;

            if (jsonMatch) {
                try {
                    grammarData = JSON.parse(jsonMatch[1]);
                    // Remove the JSON block from the visible response
                    responseText = fullText.replace(/```json\n[\s\S]*?\n```/, "").trim();
                } catch (e) {
                    console.error("Failed to parse grammar JSON", e);
                }
            }

            return { response: responseText, grammarData };

        } catch (err) {
            console.error("Gemini Grammar Analysis Error:", err);
            throw new Error("Failed to analyze grammar");
        }
    }
}
