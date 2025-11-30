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

    async analyzeGrammar(message: string): Promise<GrammarAnalysisResult> {
        try {
            const prompt = `
                Analyze the Sanskrit grammar of the following request: "${message}".
                
                1. Provide a clear, educational explanation in markdown.
                2. AT THE END, provide a JSON block wrapped in \`\`\`json ... \`\`\` with the following structure for visualization:
                {
                    "sentence": "${message}",
                    "breakdown": [
                        {
                            "original_text": "The specific substring from the original text (e.g., 'Rāmaḥ')",
                            "split_form": "The grammatically split form (e.g., 'Rāmaḥ')",
                            "meaning": "English meaning",
                            "category": "noun" | "verb" | "indeclinable" | "compound" | "other",
                            "details": "Grammar details (e.g., 'Nom. Sg. Masc.')"
                        }
                    ]
                }
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
