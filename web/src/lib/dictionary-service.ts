import fs from 'fs/promises';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

const DATA_DIR = path.join(process.cwd(), 'data');
const DICTIONARY_FILE = path.join(DATA_DIR, 'dictionary.json');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export interface DictionaryEntry {
    word: string;
    iast: string;
    meanings: string[];
    etymology?: string;
    gender?: string;
    source: string;
    timestamp: number;
}

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

// Read dictionary from file
async function readDictionary(): Promise<Record<string, DictionaryEntry>> {
    await ensureDataDir();
    try {
        const data = await fs.readFile(DICTIONARY_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

// Write dictionary to file
async function writeDictionary(data: Record<string, DictionaryEntry>) {
    await ensureDataDir();
    await fs.writeFile(DICTIONARY_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function searchDictionary(query: string): Promise<DictionaryEntry | null> {
    const normalizedQuery = query.trim().toLowerCase();
    const dictionary = await readDictionary();

    // 1. Check Cache
    if (dictionary[normalizedQuery]) {
        return { ...dictionary[normalizedQuery], source: "Local Cache" };
    }

    // 2. Fetch from Gemini if not in cache
    try {
        const prompt = `
            You are a Sanskrit Dictionary expert. Provide a detailed dictionary entry for the Sanskrit word: "${query}".
            
            Return ONLY a JSON object with this structure:
            {
                "word": "Devanagari spelling",
                "iast": "IAST transliteration",
                "meanings": ["Meaning 1", "Meaning 2"],
                "etymology": "Root/Etymology info (brief)",
                "gender": "Gender (M/F/N) if applicable"
            }
            
            Use authoritative sources like Monier-Williams as your knowledge base.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return null;

        const entry = JSON.parse(jsonMatch[0]);

        const newEntry: DictionaryEntry = {
            ...entry,
            source: "Gemini (Monier-Williams)",
            timestamp: Date.now()
        };

        // 3. Save to Cache
        dictionary[normalizedQuery] = newEntry;
        await writeDictionary(dictionary);

        return newEntry;

    } catch (error) {
        console.error("Dictionary lookup failed:", error);
        return null;
    }
}
