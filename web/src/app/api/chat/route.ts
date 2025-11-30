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
        else if (lowerMsg.includes("debate") && lowerMsg.includes("agent")) {
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

            if (!GENAI_API_KEY) {
                responseText = "I can help analyze Sanskrit grammar, but the Gemini API key is missing.";
            } else {
                try {
                    const grammarService = new GrammarService(GENAI_API_KEY);
                    const result = await grammarService.analyzeGrammar(message);
                    responseText = result.response;
                    const grammarData = result.grammarData;

                    return NextResponse.json({ response: responseText, tool: toolUsed, grammarData });
                } catch (err) {
                    console.error("Grammar Service Error:", err);
                    responseText = "I encountered an error analyzing the grammar.";
                }
            }
        }
        // 5. Sanskrit Validation (if message contains Devanagari)
        else if (/[\u0900-\u097F]/.test(message)) {
            toolUsed = "send_sanskrit_message";
            const result: any = await mcpClient.callTool("send_sanskrit_message", {
                fromAgent: "user",
                toAgent: "sanskrit_bot",
                content: message,
                context: "user chat",
                formality: "formal"
            });

            // Extract text from MCP response
            let msgText = "";
            if (Array.isArray(result) && result[0]?.text) {
                msgText = result[0].text;
            } else if (result?.content && Array.isArray(result.content) && result.content[0]?.text) {
                msgText = result.content[0].text;
            } else if (typeof result === "string") {
                msgText = result;
            } else {
                msgText = JSON.stringify(result, null, 2);
            }
            responseText = msgText;

            // Construct Grammar Data for Visualization
            // In a real scenario, we would parse the MCP response more robustly or ask MCP for structured data.
            // Here we simulate it based on the input for demonstration if the MCP doesn't return structured data yet.

            // Naive word splitter for demo
            const words = message.split(/\s+/).map((w: string) => ({
                text: w,
                transliteration: "..." // Placeholder, ideally from MCP
            }));

            // Extract grammar info from responseText if possible, or mock for visualization demo
            // The MCP returns text like "Grammar patterns detected: ... Sandhi: ..."

            // For the "analyze" tool, we already parsed the JSON above.
            // For this fallback/auto-detect path, we might not have the detailed JSON unless we ask for it.
            // To keep it simple and consistent, let's try to construct a basic breakdown from the regex matches we had before,
            // OR just rely on the "analyze" tool for the rich visualization.

            // Let's map the old regex-based extraction to the new structure for consistency if the user didn't explicitly ask "analyze"
            // but we still want to show something.

            const sandhiMatch = responseText.match(/Sandhi: (.*?)\n/);
            const samasaMatch = responseText.match(/Samāsa: (.*?)\n/);
            const vibhaktiMatch = responseText.match(/Vibhakti: (.*?)\n/);

            // This is a fallback approximation
            const grammarData = {
                sentence: message,
                breakdown: words.map((w: any) => ({
                    original_text: w.text,
                    split_form: w.text,
                    meaning: "...",
                    category: "other",
                    details: "Detected via MCP"
                }))
            };

            return NextResponse.json({ response: responseText, tool: toolUsed, grammarData });
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
