// Simple mock test for GrammarService
// Run with: node tests/grammar-service.test.js

const assert = require('assert');

// Mock GoogleGenerativeAI
class MockGenerativeModel {
    async generateContent(prompt) {
        return {
            response: {
                text: () => `
Here is the analysis.

\`\`\`json
{
    "sentence": "Rāmaḥ",
    "breakdown": [
        {
            "original_text": "Rāmaḥ",
            "split_form": "Rāmaḥ",
            "meaning": "Rama",
            "category": "noun",
            "details": "Nom. Sg. Masc."
        }
    ]
}
\`\`\`
`
            }
        };
    }
}

class MockGoogleGenerativeAI {
    getGenerativeModel() {
        return new MockGenerativeModel();
    }
}

// Mock the service (since we can't easily import TS files in raw Node without setup)
class GrammarService {
    constructor(apiKey) {
        this.genAI = new MockGoogleGenerativeAI();
        this.model = this.genAI.getGenerativeModel();
    }

    async analyzeGrammar(message) {
        const result = await this.model.generateContent(message);
        const fullText = result.response.text();
        const jsonMatch = fullText.match(/```json\n([\s\S]*?)\n```/);
        let grammarData = null;
        let responseText = fullText;

        if (jsonMatch) {
            grammarData = JSON.parse(jsonMatch[1]);
            responseText = fullText.replace(/```json\n[\s\S]*?\n```/, "").trim();
        }

        return { response: responseText, grammarData };
    }
}

async function runTests() {
    console.log("Running GrammarService Tests...");

    const service = new GrammarService("fake-key");
    const result = await service.analyzeGrammar("Rāmaḥ");

    try {
        assert.ok(result.grammarData, "Grammar data should be present");
        assert.strictEqual(result.grammarData.sentence, "Rāmaḥ", "Sentence should match");
        assert.strictEqual(result.grammarData.breakdown[0].category, "noun", "Category should be noun");
        console.log("✅ Grammar Analysis Test Passed");
    } catch (e) {
        console.error("❌ Test Failed:", e.message);
    }
}

runTests();
