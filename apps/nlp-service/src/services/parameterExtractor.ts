import { VisualParameters, AudioParameters } from '@ai-studio/shared-types';
import { TextProcessor } from './textProcessor';

/**
 * Parameter extraction service using regex patterns and keyword matching
 */
export class ParameterExtractor {
  private textProcessor = new TextProcessor();

  // Visual parameter patterns and keywords
  private visualStyleKeywords = new Map([
    ['realistic', ['photorealistic', 'lifelike', 'detailed', 'high resolution']],
    ['abstract', ['non-representational', 'conceptual', 'geometric', 'expressionist']],
    ['cartoon', ['animated', 'comic', 'illustration', 'stylized']],
    ['anime', ['manga', 'japanese animation', 'cel shaded']],
    ['oil painting', ['traditional', 'classical', 'renaissance', 'baroque']],
    ['watercolor', ['soft', 'flowing', 'transparent', 'delicate']],
    ['digital art', ['computer generated', 'cgi', 'digital painting']],
    ['minimalist', ['simple', 'clean', 'sparse', 'uncluttered']],
    ['surreal', ['dreamlike', 'fantastical', 'impossible', 'bizarre']],
    ['impressionist', ['monet', 'renoir', 'loose brushstrokes', 'light effects']]
  ]);

  private colorKeywords = new Map([
    ['red', ['crimson', 'scarlet', 'burgundy', 'maroon', 'cherry']],
    ['blue', ['azure', 'navy', 'cobalt', 'cerulean', 'sapphire']],
    ['green', ['emerald', 'forest', 'lime', 'olive', 'mint']],
    ['yellow', ['golden', 'amber', 'lemon', 'canary', 'sunshine']],
    ['purple', ['violet', 'lavender', 'plum', 'magenta', 'indigo']],
    ['orange', ['tangerine', 'peach', 'coral', 'amber', 'rust']],
    ['pink', ['rose', 'blush', 'salmon', 'fuchsia', 'magenta']],
    ['brown', ['tan', 'beige', 'chocolate', 'coffee', 'sepia']],
    ['black', ['ebony', 'charcoal', 'midnight', 'onyx', 'jet']],
    ['white', ['ivory', 'cream', 'pearl', 'snow', 'alabaster']],
    ['gray', ['silver', 'slate', 'ash', 'pewter', 'steel']],
    ['gold', ['golden', 'metallic', 'brass', 'bronze']]
  ]);

  private moodKeywords = new Map([
    ['joyful', ['happy', 'joy', 'cheerful', 'uplifting', 'optimistic', 'radiant']],
    ['bright', ['cheerful', 'uplifting', 'optimistic', 'joyful', 'radiant']],
    ['peaceful', ['calm', 'serene', 'tranquil', 'relaxing', 'soothing']],
    ['energetic', ['dynamic', 'vibrant', 'lively', 'active', 'exciting']],
    ['dark', ['moody', 'mysterious', 'gothic', 'somber', 'brooding']],
    ['romantic', ['loving', 'tender', 'passionate', 'intimate', 'dreamy']],
    ['dramatic', ['intense', 'powerful', 'striking', 'bold', 'theatrical']],
    ['melancholic', ['sad', 'nostalgic', 'wistful', 'pensive', 'reflective']],
    ['playful', ['fun', 'whimsical', 'lighthearted', 'amusing', 'cheerful']]
  ]);

  // Audio parameter patterns and keywords
  private genreKeywords = new Map([
    ['rock', ['hard rock', 'soft rock', 'classic rock', 'alternative rock']],
    ['pop', ['pop music', 'mainstream', 'catchy', 'commercial']],
    ['jazz', ['bebop', 'swing', 'fusion', 'smooth jazz', 'free jazz']],
    ['classical', ['orchestral', 'symphony', 'chamber music', 'baroque', 'romantic']],
    ['electronic', ['edm', 'techno', 'house', 'trance', 'dubstep', 'ambient']],
    ['hip hop', ['rap', 'hip-hop', 'urban', 'beats']],
    ['country', ['folk', 'bluegrass', 'americana', 'western']],
    ['blues', ['rhythm and blues', 'r&b', 'soul', 'gospel']],
    ['metal', ['heavy metal', 'death metal', 'black metal', 'thrash']]
  ]);

  private instrumentKeywords = new Map([
    ['piano', ['keyboard', 'keys', 'grand piano', 'upright piano']],
    ['guitar', ['electric guitar', 'acoustic guitar', 'bass guitar', 'strings']],
    ['drums', ['percussion', 'drum kit', 'beats', 'rhythm section']],
    ['violin', ['fiddle', 'strings', 'bow', 'orchestral strings']],
    ['saxophone', ['sax', 'alto sax', 'tenor sax', 'woodwinds']],
    ['trumpet', ['brass', 'horn', 'cornet', 'flugelhorn']],
    ['synthesizer', ['synth', 'electronic', 'digital', 'analog synth']],
    ['vocals', ['singing', 'voice', 'choir', 'harmony', 'melody']]
  ]);

  // Regex patterns for specific extractions
  private tempoPattern = /(\d+)\s*bpm|tempo\s*(?:of\s*)?(\d+)|(\d+)\s*beats?\s*per\s*minute/i;
  private colorPattern = /#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/gi;

  /**
   * Extract visual parameters from text
   */
  extractVisualParameters(text: string): VisualParameters {
    const normalizedText = text.toLowerCase();
    const keyPhrases = this.textProcessor.extractKeyPhrases(text);

    return {
      style: this.extractStyles(normalizedText, keyPhrases),
      colors: this.extractColors(normalizedText, keyPhrases),
      mood: this.extractMood(normalizedText, keyPhrases),
      composition: this.extractComposition(normalizedText, keyPhrases),
      themes: this.extractThemes(normalizedText, keyPhrases)
    };
  }

  /**
   * Extract audio parameters from text
   */
  extractAudioParameters(text: string): AudioParameters {
    const normalizedText = text.toLowerCase();
    const keyPhrases = this.textProcessor.extractKeyPhrases(text);

    return {
      genre: this.extractGenres(normalizedText, keyPhrases),
      instruments: this.extractInstruments(normalizedText, keyPhrases),
      tempo: this.extractTempo(normalizedText),
      mood: this.extractMood(normalizedText, keyPhrases),
      structure: this.extractStructure(normalizedText, keyPhrases)
    };
  }

  /**
   * Extract visual styles from text
   */
  private extractStyles(text: string, keyPhrases: string[]): string[] {
    const styles: string[] = [];
    
    for (const [style, synonyms] of this.visualStyleKeywords) {
      if (text.includes(style) || synonyms.some(syn => text.includes(syn))) {
        styles.push(style);
      }
    }

    // Check key phrases for style matches
    for (const phrase of keyPhrases) {
      for (const [style, synonyms] of this.visualStyleKeywords) {
        if (phrase.includes(style) || synonyms.some(syn => phrase.includes(syn))) {
          if (!styles.includes(style)) {
            styles.push(style);
          }
        }
      }
    }

    return styles;
  }

  /**
   * Extract colors from text
   */
  private extractColors(text: string, keyPhrases: string[]): string[] {
    const colors: string[] = [];
    const normalizedText = text.toLowerCase();

    // Check for hex colors and RGB values (preserve original case)
    const colorMatches = text.match(this.colorPattern);
    if (colorMatches) {
      colors.push(...colorMatches);
    }

    // Check for color names
    for (const [color, synonyms] of this.colorKeywords) {
      if (normalizedText.includes(color) || synonyms.some(syn => normalizedText.includes(syn))) {
        colors.push(color);
      }
    }

    // Check key phrases for color matches
    for (const phrase of keyPhrases) {
      const normalizedPhrase = phrase.toLowerCase();
      for (const [color, synonyms] of this.colorKeywords) {
        if (normalizedPhrase.includes(color) || synonyms.some(syn => normalizedPhrase.includes(syn))) {
          if (!colors.includes(color)) {
            colors.push(color);
          }
        }
      }
    }

    return [...new Set(colors)]; // Remove duplicates
  }

  /**
   * Extract mood from text
   */
  private extractMood(text: string, keyPhrases: string[]): string {
    for (const [mood, synonyms] of this.moodKeywords) {
      if (text.includes(mood) || synonyms.some(syn => text.includes(syn))) {
        return mood;
      }
    }

    // Check key phrases for mood matches
    for (const phrase of keyPhrases) {
      for (const [mood, synonyms] of this.moodKeywords) {
        if (phrase.includes(mood) || synonyms.some(syn => phrase.includes(syn))) {
          return mood;
        }
      }
    }

    return ''; // No mood detected
  }

  /**
   * Extract composition information
   */
  private extractComposition(text: string, keyPhrases: string[]): string {
    const compositionTerms = [
      'centered', 'off-center', 'rule of thirds', 'symmetrical', 'asymmetrical',
      'close-up', 'wide shot', 'portrait', 'landscape', 'aerial view',
      'low angle', 'high angle', 'bird\'s eye', 'worm\'s eye'
    ];

    for (const term of compositionTerms) {
      if (text.includes(term)) {
        return term;
      }
    }

    return '';
  }

  /**
   * Extract themes from text
   */
  private extractThemes(text: string, keyPhrases: string[]): string[] {
    const themes: string[] = [];
    const themeKeywords = [
      'nature', 'urban', 'fantasy', 'sci-fi', 'historical', 'modern',
      'vintage', 'futuristic', 'magical', 'realistic', 'abstract',
      'portrait', 'landscape', 'still life', 'architecture', 'animals'
    ];

    for (const theme of themeKeywords) {
      if (text.includes(theme)) {
        themes.push(theme);
      }
    }

    // Extract themes from key phrases
    for (const phrase of keyPhrases) {
      if (phrase.length > 3 && !themes.includes(phrase)) {
        themes.push(phrase);
      }
    }

    return themes.slice(0, 5); // Limit to 5 themes
  }

  /**
   * Extract musical genres from text
   */
  private extractGenres(text: string, keyPhrases: string[]): string[] {
    const genres: string[] = [];

    for (const [genre, synonyms] of this.genreKeywords) {
      if (text.includes(genre) || synonyms.some(syn => text.includes(syn))) {
        genres.push(genre);
      }
    }

    return genres;
  }

  /**
   * Extract instruments from text
   */
  private extractInstruments(text: string, keyPhrases: string[]): string[] {
    const instruments: string[] = [];

    for (const [instrument, synonyms] of this.instrumentKeywords) {
      if (text.includes(instrument) || synonyms.some(syn => text.includes(syn))) {
        instruments.push(instrument);
      }
    }

    return instruments;
  }

  /**
   * Extract tempo from text
   */
  private extractTempo(text: string): number {
    const match = text.match(this.tempoPattern);
    if (match) {
      const tempo = parseInt(match[1] || match[2] || match[3]);
      if (tempo >= 60 && tempo <= 200) {
        return tempo;
      }
    }

    // Default tempo based on descriptive words
    if (text.includes('slow') || text.includes('ballad')) return 70;
    if (text.includes('medium') || text.includes('moderate')) return 120;
    if (text.includes('fast') || text.includes('upbeat')) return 140;
    if (text.includes('very fast') || text.includes('energetic')) return 160;

    return 120; // Default tempo
  }

  /**
   * Extract musical structure from text
   */
  private extractStructure(text: string, keyPhrases: string[]): string {
    const structureTerms = [
      'verse-chorus-bridge', 'intro-verse-chorus-outro', 'aaba', 
      'verse-chorus', 'simple', 'complex', 'repetitive', 'progressive', 'cyclical'
    ];

    for (const term of structureTerms) {
      if (text.includes(term)) {
        return term;
      }
    }

    return 'verse-chorus'; // Default structure
  }
}