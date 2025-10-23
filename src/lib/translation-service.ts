import type { TranslationOptions } from './types.js';

/**
 * Service for translating between Sanskrit and English
 */
export class TranslationService {
  private sanskritToEnglishCache: Map<string, string> = new Map();
  private englishToSanskritCache: Map<string, string> = new Map();
  private dictionary: Map<string, string> = new Map();

  constructor() {
    this.initializeBasicVocabulary();
  }

  /**
   * Translate Sanskrit text to English
   */
  async sanskritToEnglish(
    sanskritText: string, 
    options: Partial<TranslationOptions> = {}
  ): Promise<string> {
    const cacheKey = `${sanskritText}|${JSON.stringify(options)}`;
    
    if (this.sanskritToEnglishCache.has(cacheKey)) {
      return this.sanskritToEnglishCache.get(cacheKey)!;
    }

    // Simple word-by-word translation
    const words = sanskritText.split(/\s+/);
    const translatedWords = words.map(word => 
      this.dictionary.get(word) || `[${word}]`
    );

    let result = translatedWords.join(' ');
    
    if (options.includeTransliteration) {
      result += `\n(Transliteration: ${this.toIAST(sanskritText)})`;
    }

    if (options.culturalContext) {
      result += this.addCulturalContext(sanskritText);
    }

    this.sanskritToEnglishCache.set(cacheKey, result);
    return result;
  }

  /**
   * Translate English text to Sanskrit
   */
  async englishToSanskrit(
    englishText: string, 
    options: Partial<TranslationOptions> = {}
  ): Promise<string> {
    const cacheKey = `${englishText}|${JSON.stringify(options)}`;
    
    if (this.englishToSanskritCache.has(cacheKey)) {
      return this.englishToSanskritCache.get(cacheKey)!;
    }

    // Reverse lookup in dictionary
    const words = englishText.toLowerCase().split(/\s+/);
    const translatedWords = words.map(word => {
      for (const [sanskrit, english] of this.dictionary.entries()) {
        if (english.toLowerCase() === word) {
          return sanskrit;
        }
      }
      return this.transliterateToDevanagari(word);
    });

    const result = translatedWords.join(' ');
    this.englishToSanskritCache.set(cacheKey, result);
    return result;
  }

  /**
   * Initialize basic vocabulary
   */
  private initializeBasicVocabulary(): void {
    const basicVocab = {
      'अहम्': 'I',
      'त्वम्': 'you',
      'स:': 'he',
      'सा': 'she',
      'नमस्कार': 'greetings',
      'धन्यवाद': 'thank you',
      'गृहम्': 'house',
      'जलम्': 'water',
      'अग्निः': 'fire',
      'ज्ञानम्': 'knowledge',
      'धर्म:': 'dharma',
      'शान्तिः': 'peace',
      'प्रेम': 'love'
    };

    for (const [sanskrit, english] of Object.entries(basicVocab)) {
      this.dictionary.set(sanskrit, english);
    }
  }

  /**
   * Convert Devanagari to IAST
   */
  private toIAST(devanagari: string): string {
    // Simplified IAST conversion
    const iast_map: Record<string, string> = {
      'अ': 'a', 'आ': 'ā', 'इ': 'i', 'ई': 'ī', 'उ': 'u', 'ऊ': 'ū',
      'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh',
      'च': 'c', 'छ': 'ch', 'ज': 'j', 'झ': 'jh',
      'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
      'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
      'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
      'श': 'ś', 'ष': 'ṣ', 'स': 's', 'ह': 'h',
      'ं': 'ṃ', ':': 'ḥ'
    };

    let result = '';
    for (const char of devanagari) {
      result += iast_map[char] || char;
    }
    return result;
  }

  /**
   * Transliterate English to Devanagari
   */
  private transliterateToDevanagari(english: string): string {
    // Simple transliteration
    const map: Record<string, string> = {
      'a': 'अ', 'i': 'इ', 'u': 'उ', 'e': 'ए', 'o': 'ओ',
      'k': 'क', 'g': 'ग', 'c': 'च', 'j': 'ज', 't': 'त', 'd': 'द',
      'n': 'न', 'p': 'प', 'b': 'ब', 'm': 'म', 'y': 'य', 'r': 'र',
      'l': 'ल', 'v': 'व', 's': 'स', 'h': 'ह'
    };

    let result = '';
    for (const char of english.toLowerCase()) {
      result += map[char] || char;
    }
    return result;
  }

  /**
   * Add cultural context
   */
  private addCulturalContext(sanskritText: string): string {
    let context = '';
    if (sanskritText.includes('धर्म')) {
      context += '\n[Cultural note: धर्म (dharma) means righteousness, duty, and natural order]';
    }
    if (sanskritText.includes('नमस्कार')) {
      context += '\n[Cultural note: नमस्कार is a traditional greeting meaning "I bow to you"]';
    }
    return context;
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      sanskritToEnglishCacheSize: this.sanskritToEnglishCache.size,
      englishToSanskritCacheSize: this.englishToSanskritCache.size,
      totalCachedTranslations: this.sanskritToEnglishCache.size + this.englishToSanskritCache.size
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.sanskritToEnglishCache.clear();
    this.englishToSanskritCache.clear();
  }
}