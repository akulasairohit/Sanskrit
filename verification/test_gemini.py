import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ GEMINI_API_KEY not found in environment variables.")
    exit(1)

print(f"🔑 Found API Key: {api_key[:5]}...{api_key[-5:]}")

try:
    genai.configure(api_key=api_key)
    # Try gemini-2.0-flash which is available
    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content("Hello, are you working?")
    print("✅ Gemini API Response Received:")
    print(f"   '{response.text}'")
except Exception as e:
    print(f"❌ Gemini API Error: {e}")
    try:
        print("Listing available models:")
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f" - {m.name}")
    except:
        pass
    exit(1)
