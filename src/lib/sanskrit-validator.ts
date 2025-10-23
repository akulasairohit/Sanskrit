import type { ValidationResult, SanskritValidationRules } from './types.js';

/**
 * Validator for Sanskrit text and grammar
 */
export class SanskritValidator {
  private validationRules: SanskritValidationRules;

  constructor() {
    this.validationRules = {
      allowedScripts: ['devanagari', 'iast', 'itrans'],
      requireProperSandhi: true,
      strictGrammar: false,
      allowModernUsage: true,
      checkMeter: false,
      culturalContext: true,
      formalityLevel: 'moderate'
    };
  }

  /**
   * Validate Sanskrit text
   */
  async validateText(text: string): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: [],
      confidence: 1.0,
      grammarPatterns: {
        sandhi: 0,
        samasa: 0,
        vibhakti: 0,
        dhatu: 0
      }
    };

    // Basic validation
    const normalizedText = this.normalizeText(text);
    
    // Check for invalid characters
    const invalidChars = this.findInvalidCharacters(normalizedText);
    if (invalidChars.length > 0) {
      result.errors.push({
        type: 'invalid_characters',
        message: `Invalid characters: ${invalidChars.join(', ')}`,
        position: 0,
        severity: 'high'
      });
    }

    // Check script consistency
    if (this.hasMixedScripts(normalizedText)) {
      result.warnings.push({
        type: 'mixed_scripts',
        message: 'Text contains mixed scripts',
        position: 0,
        severity: 'medium'
      });
    }

    // Detect Sanskrit grammar patterns
    result.grammarPatterns = this.detectGrammarPatterns(normalizedText);

    result.confidence = this.calculateConfidence(result);
    result.isValid = result.errors.length === 0;

    return result;
  }

  /**
   * Detect Sanskrit grammar patterns
   */
  private detectGrammarPatterns(text: string): {
    sandhi: number;
    samasa: number;
    vibhakti: number;
    dhatu: number;
  } {
    let sandhi = 0;
    let samasa = 0;
    let vibhakti = 0;
    let dhatu = 0;

    // Sandhi detection (phonetic combinations)
    // Common sandhi patterns in Devanagari
    const sandhiPatterns = [
      /[ाेौ]ऽ/, // vowel sandhi with avagraha
      /त्य/g, // dental-palatal sandhi
      /स्य/g, // sibilant sandhi
      /श्च/g, // palatal sandhi
      /त्त/g, // dental gemination
      /च्च/g, // palatal gemination
      /द्य/g, // dental-semi-vowel
      /ञ्च/g, // nasal-palatal
    ];
    sandhiPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) sandhi += matches.length;
    });

    // Samasa detection (compound words)
    // Longer words are often compounds in Sanskrit
    const words = text.split(/[\s।॥]+/);
    words.forEach(word => {
      // Heuristic: words with certain suffixes/patterns indicating compounds
      if (word.length > 8 && /[\u0900-\u097F]{8,}/.test(word)) {
        samasa++;
      }
      // Specific compound endings
      if (/त्वम्$/.test(word) || /ता$/.test(word)) {
        samasa++;
      }
    });

    // Vibhakti detection (case endings)
    const vibhaktiEndings = [
      /[ाःंम्]$/g,   // Nominative/Accusative endings
      /[ेः]$/g,      // Ablative/Genitive
      /ाय$/g,        // Dative
      /ात्$/g,       // Ablative
      /स्य$/g,       // Genitive
      /[िीुूृे]$/g,   // Various case endings
    ];
    words.forEach(word => {
      vibhaktiEndings.forEach(pattern => {
        if (pattern.test(word)) {
          vibhakti++;
        }
      });
    });

    // Dhatu detection (verb roots)
    const dhatuPatterns = [
      /ति$/g,        // 3rd person singular present
      /न्ति$/g,      // 3rd person plural present
      /[तन]्त$/g,     // past participle
      /त्वा$/g,      // gerund
      /त्य$/g,       // gerund (Vedic)
      /स्य(ति|न्ति)$/g, // future tense
    ];
    words.forEach(word => {
      dhatuPatterns.forEach(pattern => {
        if (pattern.test(word)) {
          dhatu++;
        }
      });
    });

    return { sandhi, samasa, vibhakti, dhatu };
  }

  private normalizeText(text: string): string {
    return text.normalize('NFC').trim();
  }

  private findInvalidCharacters(text: string): string[] {
    const validRanges = [
      /[\u0900-\u097F]/, // Devanagari
      /[a-zA-Z]/, // Latin
      /[0-9]/, // Numbers
      /[\s।॥]/ // Whitespace and punctuation
    ];
    
    const invalidChars: string[] = [];
    for (const char of text) {
      const isValid = validRanges.some(pattern => pattern.test(char));
      if (!isValid && !invalidChars.includes(char)) {
        invalidChars.push(char);
      }
    }
    return invalidChars;
  }

  private hasMixedScripts(text: string): boolean {
    const hasDevanagari = /[\u0900-\u097F]/.test(text);
    const hasLatin = /[a-zA-Z]/.test(text);
    return hasDevanagari && hasLatin;
  }

  private calculateConfidence(result: ValidationResult): number {
    let confidence = 1.0;
    confidence -= result.errors.length * 0.2;
    confidence -= result.warnings.length * 0.1;
    return Math.max(0, Math.min(1, confidence));
  }
}