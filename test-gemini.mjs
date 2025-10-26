import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    console.log('Checking API key and available models...\n');
    console.log('API Key (first 10 chars):', process.env.GEMINI_API_KEY?.substring(0, 10) + '...\n');
    
    // Try to list models via API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GEMINI_API_KEY);
    const data = await response.json();
    
    if (data.models) {
      console.log('✅ Available models:');
      for (const model of data.models) {
        if (model.supportedGenerationMethods?.includes('generateContent')) {
          console.log(`  - ${model.name}`);
        }
      }
    } else {
      console.log('❌ Error:', data);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
