import { 
  ParsedParameters, 
  VisualParameters, 
  AudioParameters 
} from '@ai-studio/shared-types';

export interface NormalizationOptions {
  applyDefaults: boolean;
  sanitizeInput: boolean;
  standardizeTerms: boolean;
  removeInvalidEntries: boolean;
}

/**
 * Parameter normalizer for cleaning and standardizing parsed parameters
 */
export class ParameterNormalizer {
  
  // Default values for parameters
  private readonly defaultVisualParameters: Partial<VisualParameters> = {
    style: [],
    colors: [],
    mood: '',
    composition: '',
    themes: []
  };

  private readonly defaultAudioParameters: Partial<AudioParameters> = {
    genre: [],
    instruments: [],
    tempo: 120,
    mood: '',
    structure: ''
  };

  // Standardization mappings
  private readonly styleStandardization: Record<string, string> = {
    'photo': 'photorealistic',
    'realistic': 'photorealistic',
    'real': 'photorealistic',
    'painting': 'oil painting',
    'drawn': 'sketch',
    'drawing': 'sketch',
    'toon': 'cartoon',
    'animated': 'cartoon',
    'digital': 'digital art',
    'computer': 'digital art',
    'old': 'vintage',
    'retro': 'vintage',
    'new': 'modern',
    'contemporary': 'modern'
  };

  private readonly colorStandardization: Record<string, string> = {
    'red': 'red',
    'crimson': 'red',
    'scarlet': 'red',
    'blue': 'blue',
    'azure': 'blue',
    'navy': 'dark blue',
    'green': 'green',
    'emerald': 'green',
    'forest': 'forest green',
    'yellow': 'yellow',
    'gold': 'golden yellow',
    'orange': 'orange',
    'purple': 'purple',
    'violet': 'purple',
    'pink': 'pink',
    'magenta': 'pink',
    'brown': 'brown',
    'tan': 'brown',
    'gray': 'gray',
    'grey': 'gray',
    'silver': 'silver gray',
    'black': 'black',
    'white': 'white'
  };

  private readonly genreStandardization: Record<string, string> = {
    'rock and roll': 'rock',
    'r&b': 'rhythm and blues',
    'rnb': 'rhythm and blues',
    'edm': 'electronic',
    'techno': 'electronic',
    'house': 'electronic',
    'trance': 'electronic',
    'dubstep': 'electronic',
    'hiphop': 'hip-hop',
    'rap': 'hip-hop',
    'classical music': 'classical',
    'folk music': 'folk',
    'country music': 'country',
    'blues music': 'blues'
  };

  private readonly instrumentStandardization: Record<string, string> = {
    'guitars': 'guitar',
    'electric guitar': 'guitar',
    'acoustic guitar': 'guitar',
    'pianos': 'piano',
    'keyboard': 'piano',
    'keys': 'piano',
    'drums': 'drums',
    'percussion': 'drums',
    'violins': 'violin',
    'strings': 'violin',
    'bass guitar': 'bass',
    'double bass': 'bass',
    'synthesizer': 'synthesizer',
    'synth': 'synthesizer',
    'vocals': 'vocals',
    'voice': 'vocals',
    'singing': 'vocals'
  };

  /**
   * Normalize parsed parameters with comprehensive cleaning and standardization
   */
  normalizeParameters(
    parameters: ParsedParameters,
    options: Partial<NormalizationOptions> = {}
  ): ParsedParameters {
    const opts: NormalizationOptions = {
      applyDefaults: true,
      sanitizeInput: true,
      standardizeTerms: true,
      removeInvalidEntries: true,
      ...options
    };

    const normalized: ParsedParameters = {
      visual: parameters.visual ? this.normalizeVisualParameters(parameters.visual, opts) : undefined,
      audio: parameters.audio ? this.normalizeAudioParameters(parameters.audio, opts) : undefined,
      confidence: this.normalizeConfidence(parameters.confidence),
      ambiguities: this.normalizeAmbiguities(parameters.ambiguities, opts)
    };

    // Apply defaults if requested
    if (opts.applyDefaults) {
      if (normalized.visual) {
        normalized.visual = { ...this.defaultVisualParameters, ...normalized.visual };
      }
      if (normalized.audio) {
        normalized.audio = { ...this.defaultAudioParameters, ...normalized.audio };
      }
    }

    return normalized;
  }

  /**
   * Normalize visual parameters
   */
  private normalizeVisualParameters(
    visual: VisualParameters,
    options: NormalizationOptions
  ): VisualParameters {
    return {
      style: this.normalizeStringArray(visual.style, options, this.styleStandardization),
      colors: this.normalizeStringArray(visual.colors, options, this.colorStandardization),
      mood: this.normalizeString(visual.mood, options),
      composition: this.normalizeString(visual.composition, options),
      themes: this.normalizeStringArray(visual.themes, options)
    };
  }

  /**
   * Normalize audio parameters
   */
  private normalizeAudioParameters(
    audio: AudioParameters,
    options: NormalizationOptions
  ): AudioParameters {
    return {
      genre: this.normalizeStringArray(audio.genre, options, this.genreStandardization),
      instruments: this.normalizeStringArray(audio.instruments, options, this.instrumentStandardization),
      tempo: this.normalizeTempo(audio.tempo),
      mood: this.normalizeString(audio.mood, options),
      structure: this.normalizeString(audio.structure, options)
    };
  }

  /**
   * Normalize string arrays (style, colors, genre, instruments, themes)
   */
  private normalizeStringArray(
    array: string[],
    options: NormalizationOptions,
    standardization?: Record<string, string>
  ): string[] {
    if (!Array.isArray(array)) {
      return [];
    }

    let normalized = array
      .map(item => {
        if (typeof item !== 'string') {
          return options.removeInvalidEntries ? null : String(item);
        }
        return item;
      })
      .filter(item => item !== null) as string[];

    // Sanitize input
    if (options.sanitizeInput) {
      normalized = normalized.map(item => this.sanitizeString(item));
    }

    // Remove invalid entries
    if (options.removeInvalidEntries) {
      normalized = normalized.filter(item => item && item.trim().length > 0);
    }

    // Standardize terms
    if (options.standardizeTerms && standardization) {
      normalized = normalized.map(item => {
        const lower = item.toLowerCase();
        return standardization[lower] || item;
      });
    }

    // Remove duplicates and empty strings
    normalized = [...new Set(normalized.filter(item => item && item.trim().length > 0))];

    // Limit array size to prevent excessive parameters
    return normalized.slice(0, 10);
  }

  /**
   * Normalize individual strings (mood, composition, structure)
   */
  private normalizeString(value: string, options: NormalizationOptions): string {
    if (typeof value !== 'string') {
      return '';
    }

    let normalized = value;

    // Sanitize input
    if (options.sanitizeInput) {
      normalized = this.sanitizeString(normalized);
    }

    return normalized.trim();
  }

  /**
   * Normalize tempo value
   */
  private normalizeTempo(tempo: number): number {
    if (typeof tempo !== 'number' || isNaN(tempo)) {
      return 120; // Default tempo
    }

    // Clamp tempo to valid range
    return Math.max(60, Math.min(200, Math.round(tempo)));
  }

  /**
   * Normalize confidence value
   */
  private normalizeConfidence(confidence: number): number {
    if (typeof confidence !== 'number' || isNaN(confidence)) {
      return 0;
    }

    // Clamp confidence to valid range
    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Normalize ambiguities array
   */
  private normalizeAmbiguities(ambiguities: string[], options: NormalizationOptions): string[] {
    if (!Array.isArray(ambiguities)) {
      return [];
    }

    return this.normalizeStringArray(ambiguities, options);
  }

  /**
   * Sanitize string input
   */
  private sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\w\s\-.,!?()]/g, '') // Remove special characters except basic punctuation
      .toLowerCase();
  }

  /**
   * Apply smart defaults based on existing parameters
   */
  applySmartDefaults(parameters: ParsedParameters): ParsedParameters {
    const result = { ...parameters };

    // Apply visual defaults based on context
    if (result.visual) {
      // If no style but has themes, suggest appropriate styles
      if (result.visual.style.length === 0 && result.visual.themes.length > 0) {
        const themeBasedStyles = this.getStylesForThemes(result.visual.themes);
        result.visual.style = themeBasedStyles;
      }

      // If no colors but has mood, suggest appropriate colors
      if (result.visual.colors.length === 0 && result.visual.mood) {
        const moodBasedColors = this.getColorsForMood(result.visual.mood);
        result.visual.colors = moodBasedColors;
      }
    }

    // Apply audio defaults based on context
    if (result.audio) {
      // If no instruments but has genre, suggest appropriate instruments
      if (result.audio.instruments.length === 0 && result.audio.genre.length > 0) {
        const genreBasedInstruments = this.getInstrumentsForGenre(result.audio.genre[0]);
        result.audio.instruments = genreBasedInstruments;
      }

      // If no structure but has genre, suggest appropriate structure
      if (!result.audio.structure && result.audio.genre.length > 0) {
        result.audio.structure = this.getStructureForGenre(result.audio.genre[0]);
      }
    }

    return result;
  }

  /**
   * Get appropriate styles for themes
   */
  private getStylesForThemes(themes: string[]): string[] {
    const themeStyleMap: Record<string, string[]> = {
      'nature': ['photorealistic', 'landscape painting'],
      'fantasy': ['digital art', 'fantasy art'],
      'urban': ['street photography', 'urban art'],
      'portrait': ['photorealistic', 'oil painting'],
      'abstract': ['abstract art', 'modern art'],
      'historical': ['classical painting', 'vintage'],
      'futuristic': ['digital art', 'cyberpunk']
    };

    for (const theme of themes) {
      const styles = themeStyleMap[theme.toLowerCase()];
      if (styles) {
        return styles.slice(0, 2);
      }
    }

    return ['photorealistic'];
  }

  /**
   * Get appropriate colors for mood
   */
  private getColorsForMood(mood: string): string[] {
    const moodColorMap: Record<string, string[]> = {
      'peaceful': ['soft blue', 'pale green'],
      'energetic': ['bright red', 'electric blue'],
      'dramatic': ['deep red', 'black'],
      'romantic': ['soft pink', 'warm red'],
      'mysterious': ['deep purple', 'dark blue'],
      'happy': ['bright yellow', 'orange'],
      'sad': ['gray', 'muted blue'],
      'calm': ['light blue', 'soft green']
    };

    const colors = moodColorMap[mood.toLowerCase()];
    return colors || ['natural colors'];
  }

  /**
   * Get appropriate instruments for genre
   */
  private getInstrumentsForGenre(genre: string): string[] {
    const genreInstrumentMap: Record<string, string[]> = {
      'rock': ['guitar', 'bass', 'drums'],
      'jazz': ['piano', 'saxophone', 'bass'],
      'classical': ['violin', 'piano', 'cello'],
      'electronic': ['synthesizer', 'drums'],
      'folk': ['guitar', 'vocals'],
      'blues': ['guitar', 'harmonica', 'piano'],
      'country': ['guitar', 'banjo', 'fiddle'],
      'hip-hop': ['drums', 'bass', 'vocals']
    };

    const instruments = genreInstrumentMap[genre.toLowerCase()];
    return instruments || ['piano'];
  }

  /**
   * Get appropriate structure for genre
   */
  private getStructureForGenre(genre: string): string {
    const genreStructureMap: Record<string, string> = {
      'rock': 'verse-chorus-verse-chorus-bridge-chorus',
      'pop': 'intro-verse-chorus-verse-chorus-bridge-chorus-outro',
      'jazz': 'head-solos-head',
      'classical': 'sonata form',
      'electronic': 'intro-buildup-drop-breakdown-drop',
      'folk': 'verse-chorus-verse-chorus',
      'blues': '12-bar blues',
      'country': 'verse-chorus-verse-chorus-bridge-chorus'
    };

    return genreStructureMap[genre.toLowerCase()] || 'verse-chorus';
  }

  /**
   * Validate normalized parameters
   */
  validateNormalizedParameters(parameters: ParsedParameters): boolean {
    // Check that at least one parameter type exists
    if (!parameters.visual && !parameters.audio) {
      return false;
    }

    // Validate visual parameters
    if (parameters.visual) {
      if (!Array.isArray(parameters.visual.style) ||
          !Array.isArray(parameters.visual.colors) ||
          !Array.isArray(parameters.visual.themes) ||
          typeof parameters.visual.mood !== 'string' ||
          typeof parameters.visual.composition !== 'string') {
        return false;
      }
    }

    // Validate audio parameters
    if (parameters.audio) {
      if (!Array.isArray(parameters.audio.genre) ||
          !Array.isArray(parameters.audio.instruments) ||
          typeof parameters.audio.tempo !== 'number' ||
          typeof parameters.audio.mood !== 'string' ||
          typeof parameters.audio.structure !== 'string') {
        return false;
      }

      // Check tempo range
      if (parameters.audio.tempo < 60 || parameters.audio.tempo > 200) {
        return false;
      }
    }

    // Validate confidence
    if (typeof parameters.confidence !== 'number' ||
        parameters.confidence < 0 || parameters.confidence > 1) {
      return false;
    }

    // Validate ambiguities
    if (!Array.isArray(parameters.ambiguities)) {
      return false;
    }

    return true;
  }
}