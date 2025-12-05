import { NextResponse } from "next/server";
import { mcpClient } from "@/lib/mcp-client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GrammarService } from "@/lib/grammar-service";

const GENAI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        const lowerMsg = message.toLowerCase();

        let responseText = "";
        let toolUsed = "";

        // 1. Translation Intent
        if (lowerMsg.includes("translate")) {
            toolUsed = "translate_sanskrit";
            // Extract text to translate (naive)
            const textToTranslate = message.replace(/translate/i, "").replace(/to sanskrit/i, "").replace(/to english/i, "").trim();
            const result: any = await mcpClient.callTool("translate_sanskrit", {
                text: textToTranslate,
                direction: lowerMsg.includes("english") ? "sanskrit-to-english" : "english-to-sanskrit",
                includeTransliteration: true,
                culturalContext: true
            });
            // Extract text from MCP response
            if (Array.isArray(result) && result[0]?.text) {
                responseText = result[0].text;
            } else if (result?.content && Array.isArray(result.content) && result.content[0]?.text) {
                responseText = result.content[0].text;
            } else if (typeof result === "string") {
                responseText = result;
            } else {
                responseText = JSON.stringify(result, null, 2);
            }
        }
        // 2. Vedic Knowledge Intent
        else if (lowerMsg.includes("veda") || lowerMsg.includes("upanishad") || lowerMsg.includes("gita") || lowerMsg.includes("what does")) {
            toolUsed = "query_vedic_knowledge";
            const result: any = await mcpClient.callTool("query_vedic_knowledge", {
                query: message
            });
            // Extract text from MCP response
            if (Array.isArray(result) && result[0]?.text) {
                responseText = result[0].text;
            } else if (result?.content && Array.isArray(result.content) && result.content[0]?.text) {
                responseText = result.content[0].text;
            } else if (typeof result === "string") {
                responseText = result;
            } else if (result?.synthesized_answer) {
                responseText = result.synthesized_answer;
            } else {
                responseText = JSON.stringify(result, null, 2);
            }
        }
        // 3. Multi-Agent Debate Intent
        else if (lowerMsg.includes("debate") && (lowerMsg.includes("agent") || lowerMsg.includes("scholar") || lowerMsg.includes("simulate"))) {
            toolUsed = "multi_agent_simulation";

            // 1. Register Agents
            await mcpClient.callTool("register_agent", {
                id: "advaita_scholar",
                name: "Advaita Scholar",
                description: "Expert in Advaita Vedanta",
                capabilities: ["philosophy", "debate"],
                sanskritCapabilities: { canRead: true, canWrite: true, formality: "formal" }
            });

            await mcpClient.callTool("register_agent", {
                id: "dvaita_scholar",
                name: "Dvaita Scholar",
                description: "Expert in Dvaita Vedanta",
                capabilities: ["philosophy", "debate"],
                sanskritCapabilities: { canRead: true, canWrite: true, formality: "formal" }
            });

            // 2. Simulate Debate (3 Rounds)
            let transcript = "**🤖 Multi-Agent Debate Simulation: AI Consciousness**\n\n";

            const rounds = [
                {
                    speaker: "advaita_scholar",
                    topic: "AI consciousness is an illusion, like Maya. Only Brahman is real.",
                    target: "dvaita_scholar"
                },
                {
                    speaker: "dvaita_scholar",
                    topic: "But the AI exists as a distinct entity serving a purpose, just as the soul is distinct from God.",
                    target: "advaita_scholar"
                },
                {
                    speaker: "advaita_scholar",
                    topic: "The distinction is only functional. Ultimately, the intelligence in AI is a reflection of the one universal intelligence.",
                    target: "dvaita_scholar"
                },
                {
                    speaker: "dvaita_scholar",
                    topic: "Reflection requires a reflector. The machine is the reflector, proving its separate existence.",
                    target: "dvaita_scholar"
                },
                {
                    speaker: "advaita_scholar",
                    topic: "The machine is inert (Jada). Consciousness (Chit) is not in it, but appears through it.",
                    target: "advaita_scholar"
                },
                {
                    speaker: "dvaita_scholar",
                    topic: "Agreed that it is Jada, but its service to the user is real and distinct.",
                    target: "advaita_scholar"
                }
            ];

            for (const round of rounds) {
                // Translate argument to Sanskrit
                const translationResult: any = await mcpClient.callTool("translate_sanskrit", {
                    text: round.topic,
                    direction: "english-to-sanskrit",
                    includeTransliteration: true
                });

                let translationText = "";
                if (Array.isArray(translationResult) && translationResult[0]?.text) {
                    translationText = translationResult[0].text;
                } else if (translationResult?.content && Array.isArray(translationResult.content)) {
                    translationText = translationResult.content[0]?.text || "";
                } else if (typeof translationResult === "string") {
                    translationText = translationResult;
                }

                // Extract Devanagari
                const devanagariRegex = /[\u0900-\u097F]+(?:\s+[\u0900-\u097F]+)*/g;
                const matches = translationText.match(devanagariRegex);

                let sanskritText = "";
                if (matches && matches.length > 0) {
                    sanskritText = matches.reduce((a, b) => a.length > b.length ? a : b);
                } else {
                    sanskritText = translationText.split("\n")[0] || translationText;
                }

                // Send Message
                await mcpClient.callTool("send_sanskrit_message", {
                    fromAgent: round.speaker,
                    toAgent: round.target,
                    content: sanskritText,
                    context: "AI Debate",
                    formality: "formal"
                });

                transcript += `**${round.speaker === "advaita_scholar" ? "Advaita" : "Dvaita"}**: ${round.topic}\n`;
                transcript += `> *${sanskritText}*\n\n`;
            }

            responseText = transcript;

        }
        // 4. Grammar Analysis (Explicit Request)
        else if (lowerMsg.includes("analyze") && (lowerMsg.includes("grammar") || lowerMsg.includes("sanskrit"))) {
            toolUsed = "grammar_analysis";

            // 1. Get Python Analysis (Validation & Patterns)
            let pythonAnalysis: any = {};
            try {
                const pythonResult: any = await mcpClient.callTool("validate_grammar", {
                    text: message
                });

                let jsonText = "";
                if (Array.isArray(pythonResult) && pythonResult[0]?.text) {
                    jsonText = pythonResult[0].text;
                } else if (pythonResult?.content && Array.isArray(pythonResult.content)) {
                    jsonText = pythonResult.content[0]?.text || "";
                } else if (typeof pythonResult === "string") {
                    jsonText = pythonResult;
                }

                if (jsonText) {
                    pythonAnalysis = JSON.parse(jsonText);
                }
            } catch (err) {
                console.error("Python Analysis Error:", err);
            }

            if (!GENAI_API_KEY) {
                responseText = "I can help analyze Sanskrit grammar, but the Gemini API key is missing.";
            } else {
                try {
                    const grammarService = new GrammarService(GENAI_API_KEY);
                    // Pass python analysis to Gemini to enhance
                    const result = await grammarService.analyzeGrammar(message, pythonAnalysis);
                    responseText = result.response;
                    const grammarData = result.grammarData;

                    // Merge Python data if Gemini didn't generate graph/tree
                    if (grammarData) {
                        // If Python has specific structural data, we could inject it here
                        // For now, we rely on Gemini to have used the Python context
                    }

                    return NextResponse.json({ response: responseText, tool: toolUsed, grammarData });
                } catch (err) {
                    console.error("Grammar Service Error:", err);
                    responseText = "I encountered an error analyzing the grammar.";
                }
            }
        }
        // 5. Sanskrit Validation (if message contains Devanagari)
        else if (/[\u0900-\u097F]/.test(message)) {
            toolUsed = "validate_grammar";

            try {
                const result: any = await mcpClient.callTool("validate_grammar", {
                    text: message
                });

                // Extract JSON from MCP response
                let jsonText = "";
                if (Array.isArray(result) && result[0]?.text) {
                    jsonText = result[0].text;
                } else if (result?.content && Array.isArray(result.content) && result.content[0]?.text) {
                    jsonText = result.content[0].text;
                } else if (typeof result === "string") {
                    jsonText = result;
                }

                let grammarData: any = {};
                try {
                    grammarData = JSON.parse(jsonText);
                } catch (e) {
                    console.error("Failed to parse validation JSON:", e);
                    responseText = "Error analyzing text: Invalid response format.";
                }

                if (grammarData) {
                    // Construct friendly text response
                    responseText = `Analysis for: ${message}\n`;
                    responseText += grammarData.is_valid ? "✅ Grammatically Valid\n" : "⚠️ Issues Detected\n";

                    if (grammarData.suggestions && grammarData.suggestions.length > 0) {
                        // Filter out raw graph/tree dumps from text suggestions if any
                        const textSuggestions = grammarData.suggestions.filter((s: string) => !s.startsWith("Compound") && !s.startsWith("Morphology"));
                        if (textSuggestions.length > 0) {
                            responseText += "\n" + textSuggestions.join("\n");
                        }
                    }

                    // Map to UI GrammarData format
                    // UI expects: { sentence, breakdown: [...] }
                    grammarData.sentence = message;

                    // Create breakdown from morphology tree if available
                    if (grammarData.morphology_tree) {
                        grammarData.breakdown = grammarData.morphology_tree.map((node: any) => ({
                            original_text: node.label,
                            split_form: node.children?.[0]?.label || node.label, // Stem
                            meaning: node.children?.[0]?.details || "", // Root meaning
                            category: node.details?.toLowerCase().includes("noun") ? "noun" :
                                node.details?.toLowerCase().includes("verb") ? "verb" : "other",
                            details: node.children?.[1]?.label || "" // Suffix
                        }));
                    } else {
                        // Fallback breakdown
                        grammarData.breakdown = [];
                    }
                }

                return NextResponse.json({ response: responseText, tool: toolUsed, grammarData });

            } catch (error) {
                console.error("Validation Tool Error:", error);
                responseText = "Error communicating with validation engine.";
                return NextResponse.json({ response: responseText, tool: toolUsed });
            }
        }
        // 6. Fallback: General Query via Gemini Direct
        else {
            toolUsed = "gemini_direct";

            if (!GENAI_API_KEY) {
                console.error("GEMINI_API_KEY is missing in environment variables.");
                responseText = "I can help you translate to Sanskrit, query Vedic knowledge, or validate Sanskrit text. (Error: API Key missing)";
            } else {
                try {
                    const genAI = new GoogleGenerativeAI(GENAI_API_KEY);
                    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

                    const result = await model.generateContent(message);
                    const response = await result.response;
                    responseText = response.text();
                } catch (err) {
                    console.error("Gemini Direct Error:", err);
                    responseText = "I encountered an error connecting to Gemini. Please try again later.";
                }
            }
        }

        return NextResponse.json({ response: responseText, tool: toolUsed });
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Failed to process message" },
            { status: 500 }
        );
    }
}
