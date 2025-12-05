"""
Gemini Client for Sanskrit MCP Server.

Handles interactions with Google's Gemini Pro model for translation
and knowledge synthesis.
"""

import os
import logging
from typing import Optional
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

logger = logging.getLogger(__name__)

class GeminiClient:
    """Client for interacting with Google's Gemini Pro model."""

    def __init__(self, api_key: Optional[str] = None):
        """Initialize Gemini client."""
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            logger.warning("GEMINI_API_KEY not set. Gemini features will be disabled.")
            self.model = None
            return

        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')
        logger.info("Gemini Client initialized successfully.")

    async def translate_text(
        self, 
        text: str, 
        direction: str, 
        include_transliteration: bool = False,
        cultural_context: bool = False
    ) -> str:
        """
        Translate text using Gemini Pro.
        
        Args:
            text: Text to translate
            direction: 'sanskrit-to-english' or 'english-to-sanskrit'
            include_transliteration: Whether to include transliteration (IAST)
            cultural_context: Whether to include cultural notes
            
        Returns:
            Translated text with optional extras
        """
        if not self.model:
            return f"Error: Gemini API key not configured. Cannot translate: {text}"

        prompt = f"""
        Act as an expert Sanskrit scholar and translator.
        Task: Translate the following text from {direction.replace('-', ' ')}.
        Text: "{text}"
        
        Requirements:
        1. Provide a precise and academic translation.
        """
        
        if include_transliteration:
            prompt += "2. Include IAST transliteration for any Sanskrit terms.\n"
            
        if cultural_context:
            prompt += "3. Provide brief cultural or philosophical context if relevant.\n"
            
        prompt += """
        Output Format (Use Markdown):
        1. **Translation**: Clear and precise.
        2. **Sanskrit**: Use **Bold** for Devanagari script.
        3. **Transliteration**: Use *Italics* for IAST.
        4. **Breakdown**: Provide a Markdown table with columns: | Word | Meaning | Grammar/Notes |.
        5. **Context**: Use > Blockquotes for cultural/philosophical insights.
        """

        try:
            response = await self.model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini translation error: {e}")
            return f"Error during translation: {str(e)}"

    async def generate_content(self, prompt: str) -> str:
        """
        Generate content using Gemini Pro.
        
        Args:
            prompt: The prompt to send to the model
            
        Returns:
            Generated text response
        """
        if not self.model:
            return "Error: Gemini API key not configured."

        try:
            response = await self.model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini generation error: {e}")
            return f"Error generating content: {str(e)}"
