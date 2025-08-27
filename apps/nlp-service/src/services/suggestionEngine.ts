import { 
  ParsedParameters, 
  VisualParameters, 
  AudioParameters 
} from '@ai-studio/shared-types';

export interface Suggestion {
  type: 'improvement' | 'enhancement' | 'clarification' | 'alternative';
  category: 'visual' | 'audio' | 'general';
  message: string;
  field?: string;
  examples?: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface AmbiguityResolution {
  field: string;
  ambiguousTerm: string;
  possibleValues: string[];
  suggestion: string;
  confidence: number;
}

/**
 * Suggestion engine for improving parameter quality and resolving ambiguities
 */
export class SuggestionEngine {
  
  // Predefined knowledge bases for suggestions
  private readonly visualStyles = [
    'photorealistic', 'oil painting', 'watercolor', 'digital art', 'sketch',
    'cartoon', 'anime', 'abstract', 'impressionist', 'surreal', 'minimalist',
    'vintage', 'modern', 'cyberpunk', 'steampunk', 'art nouveau', 'pop art'
  ];

  private readonly colorPalettes = [
    'warm colors', 'cool colors', 'earth tones', 'pastel colors', 'neon colors',
    'monochrome', 'black and white', 'sepia', 'vibrant colors', 'muted colors',
    'complementary colors', 'analogous colors', 'triadic colors'
  ];

  private readonly visualThemes = [
    'nature', 'landscape', 'portrait', 'urban', 'fantasy', 'sci-fi',
    'historical', 'futuristic', 'abstract', 'geometric', 'organic',
    'architectural', 'wildlife', 'floral', 'celestial', 'underwater'
  ];

  private readonly musicGenres = [
    'rock', 'pop', 'jazz', 'classical', 'electronic', 'hip-hop', 'country',
    'blues', 'folk', 'reggae', 'metal', 'punk', 'ambient', 'techno',
    'house', 'trance', 'dubstep', 'indie', 'alternative', 'world music'
  ];

  private readonly instruments = [
    'piano', 'guitar', 'violin', 'drums', 'bass', 'saxophone', 'trumpet',
    'flute', 'cello', 'harp', 'synthesizer', 'organ', 'clarinet', 'trombone',
    'percussion', 'strings', 'brass', 'woodwinds', 'vocals', 'choir'
  ];

  private readonly musicMoods = [
    'uplifting', 'melancholic', 'energetic', 'peaceful', 'dramatic',
    'romantic', 'mysterious', 'playful', 'intense', 'relaxing',
    'nostalgic', 'triumphant', 'dark', 'bright', 'contemplative'
  ];

  /**
   * Generate comprehensive suggestions for parameter improvement
   */
  async generateSuggestions(
    parameters: ParsedParameters,
    originalText?: string,
    ambiguities: AmbiguityResolution[] = []
  ): Promise<Suggestion[]> {
    const suggestions: Suggestion[] = [];

    // Add ambiguity resolution suggestions
    suggestions.push(...this.generateAmbiguitySuggestions(ambiguities));

    // Add parameter improvement suggestions
    if (parameters.visual) {
      suggestions.push(...this.generateVisualSuggestions(parameters.visual, originalText));
    }

    if (parameters.audio) {
      suggestions.push(...this.generateAudioSuggestions(parameters.audio, originalText));
    }

    // Add general suggestions
    suggestions.push(...this.generateGeneralSuggestions(parameters, originalText));

    // Sort by priority and limit results
    return this.prioritizeAndLimitSuggestions(suggestions);
  }

  /**
   * Identify and resolve ambiguous terms in parameters
   */
  identifyAmbiguities(
    parameters: ParsedParameters,
    originalText: string
  ): AmbiguityResolution[] {
    const ambiguities: AmbiguityResolution[] = [];

    if (parameters.visual) {
      ambiguities.push(...this.identifyVisualAmbiguities(parameters.visual, originalText));
    }

    if (parameters.audio) {
      ambiguities.push(...this.identifyAudioAmbiguities(parameters.audio, originalText));
    }

    return ambiguities;
  }

  /**
   * Generate suggestions for resolving ambiguities
   */
  private generateAmbiguitySuggestions(ambiguities: AmbiguityResolution[]): Suggestion[] {
    return ambiguities.map(ambiguity => ({
      type: 'clarification' as const,
      category: ambiguity.field.startsWith('visual') ? 'visual' as const : 'audio' as const,
      message: ambiguity.suggestion,
      field: ambiguity.field,
      examples: ambiguity.possibleValues.slice(0, 3),
      priority: ambiguity.confidence < 0.5 ? 'high' as const : 'medium' as const
    }));
  }

  /**
   * Generate visual parameter suggestions
   */
  private generateVisualSuggestions(
    visual: VisualParameters,
    originalText?: string
  ): Suggestion[] {
    const suggestions: Suggestion[] = [];

    // Style suggestions
    if (visual.style.length === 0) {
      suggestions.push({
        type: 'improvement',
        category: 'visual',
        message: 'Add visual style for better results',
        field: 'visual.style',
        examples: this.visualStyles.slice(0, 4),
        priority: 'high'
      });
    } else if (this.hasGenericTerms(visual.style, ['artistic', 'creative', 'beautiful'])) {
      suggestions.push({
        type: 'improvement',
        category: 'visual',
        message: 'Replace generic style terms with specific art styles',
        field: 'visual.style',
        examples: this.getRelevantStyles(visual.style),
        priority: 'medium'
      });
    }

    // Color suggestions
    if (visual.colors.length === 0) {
      suggestions.push({
        type: 'improvement',
        category: 'visual',
        message: 'Specify colors or color palette for better visual results',
        field: 'visual.colors',
        examples: this.colorPalettes.slice(0, 4),
        priority: 'medium'
      });
    } else if (this.hasAmbiguousColors(visual.colors)) {
      suggestions.push({
        type: 'clarification',
        category: 'visual',
        message: 'Use more specific color descriptions',
        field: 'visual.colors',
        examples: this.getSpecificColorSuggestions(visual.colors),
        priority: 'medium'
      });
    }

    // Theme suggestions
    if (visual.themes.length === 0) {
      suggestions.push({
        type: 'enhancement',
        category: 'visual',
        message: 'Add thematic elements to enhance your visual',
        field: 'visual.themes',
        examples: this.visualThemes.slice(0, 4),
        priority: 'low'
      });
    }

    // Mood suggestions
    if (!visual.mood || visual.mood.trim().length === 0) {
      suggestions.push({
        type: 'enhancement',
        category: 'visual',
        message: 'Specify mood to influence the visual atmosphere',
        field: 'visual.mood',
        examples: ['peaceful', 'dramatic', 'energetic', 'mysterious'],
        priority: 'medium'
      });
    }

    // Composition suggestions
    if (!visual.composition || visual.composition.trim().length === 0) {
      suggestions.push({
        type: 'enhancement',
        category: 'visual',
        message: 'Consider specifying composition for better framing',
        field: 'visual.composition',
        examples: ['close-up', 'wide shot', 'bird\'s eye view', 'rule of thirds'],
        priority: 'low'
      });
    }

    return suggestions;
  }

  /**
   * Generate audio parameter suggestions
   */
  private generateAudioSuggestions(
    audio: AudioParameters,
    originalText?: string
  ): Suggestion[] {
    const suggestions: Suggestion[] = [];

    // Genre suggestions
    if (audio.genre.length === 0) {
      suggestions.push({
        type: 'improvement',
        category: 'audio',
        message: 'Specify musical genre for better audio generation',
        field: 'audio.genre',
        examples: this.musicGenres.slice(0, 4),
        priority: 'high'
      });
    }

    // Instrument suggestions
    if (audio.instruments.length === 0) {
      suggestions.push({
        type: 'improvement',
        category: 'audio',
        message: 'Add instruments to define the musical arrangement',
        field: 'audio.instruments',
        examples: this.instruments.slice(0, 4),
        priority: 'medium'
      });
    }

    // Tempo suggestions
    if (audio.tempo === 120) { // Default tempo
      suggestions.push({
        type: 'enhancement',
        category: 'audio',
        message: 'Specify tempo for more precise musical timing',
        field: 'audio.tempo',
        examples: ['slow (70-90 BPM)', 'moderate (90-120 BPM)', 'fast (120-140 BPM)', 'very fast (140+ BPM)'],
        priority: 'low'
      });
    }

    // Mood suggestions
    if (!audio.mood || audio.mood.trim().length === 0) {
      suggestions.push({
        type: 'enhancement',
        category: 'audio',
        message: 'Add mood to influence the musical atmosphere',
        field: 'audio.mood',
        examples: this.musicMoods.slice(0, 4),
        priority: 'medium'
      });
    }

    // Structure suggestions
    if (!audio.structure || audio.structure.trim().length === 0) {
      suggestions.push({
        type: 'enhancement',
        category: 'audio',
        message: 'Consider specifying song structure',
        field: 'audio.structure',
        examples: ['verse-chorus', 'AABA', 'intro-verse-chorus-bridge-outro', 'free form'],
        priority: 'low'
      });
    }

    return suggestions;
  }

  /**
   * Generate general suggestions
   */
  private generateGeneralSuggestions(
    parameters: ParsedParameters,
    originalText?: string
  ): Suggestion[] {
    const suggestions: Suggestion[] = [];

    // Low confidence suggestions
    if (parameters.confidence < 0.3) {
      suggestions.push({
        type: 'improvement',
        category: 'general',
        message: 'Low confidence detected. Be more specific with your descriptions',
        examples: ['Use descriptive adjectives', 'Mention specific styles or genres', 'Add more detail'],
        priority: 'high'
      });
    }

    // Ambiguity suggestions
    if (parameters.ambiguities.length > 2) {
      suggestions.push({
        type: 'clarification',
        category: 'general',
        message: 'Multiple ambiguous terms detected. Consider clarifying your descriptions',
        examples: ['Replace vague terms with specific ones', 'Use examples', 'Be more descriptive'],
        priority: 'medium'
      });
    }

    // Cross-modal suggestions
    if (parameters.visual && !parameters.audio && originalText && originalText.length > 50) {
      suggestions.push({
        type: 'enhancement',
        category: 'general',
        message: 'Consider adding background music to enhance your visual creation',
        examples: ['ambient music', 'matching mood soundtrack', 'instrumental background'],
        priority: 'low'
      });
    }

    if (parameters.audio && !parameters.visual && originalText && originalText.length > 50) {
      suggestions.push({
        type: 'enhancement',
        category: 'general',
        message: 'Consider adding visual elements to create a multimedia experience',
        examples: ['album cover art', 'music visualization', 'abstract visuals'],
        priority: 'low'
      });
    }

    return suggestions;
  }

  /**
   * Identify visual ambiguities
   */
  private identifyVisualAmbiguities(
    visual: VisualParameters,
    originalText: string
  ): AmbiguityResolution[] {
    const ambiguities: AmbiguityResolution[] = [];

    // Check for ambiguous color terms
    const ambiguousColors = ['dark', 'light', 'bright', 'muted', 'colorful'];
    visual.colors.forEach(color => {
      if (ambiguousColors.includes(color.toLowerCase())) {
        ambiguities.push({
          field: 'visual.colors',
          ambiguousTerm: color,
          possibleValues: this.getSpecificColorAlternatives(color),
          suggestion: `"${color}" is ambiguous. Consider specific colors like "${this.getSpecificColorAlternatives(color)[0]}"`,
          confidence: 0.3
        });
      }
    });

    // Check for ambiguous style terms
    const ambiguousStyles = ['artistic', 'creative', 'beautiful', 'nice', 'good'];
    visual.style.forEach(style => {
      if (ambiguousStyles.includes(style.toLowerCase())) {
        ambiguities.push({
          field: 'visual.style',
          ambiguousTerm: style,
          possibleValues: this.visualStyles.slice(0, 5),
          suggestion: `"${style}" is too general. Specify an art style like "photorealistic" or "oil painting"`,
          confidence: 0.2
        });
      }
    });

    return ambiguities;
  }

  /**
   * Identify audio ambiguities
   */
  private identifyAudioAmbiguities(
    audio: AudioParameters,
    originalText: string
  ): AmbiguityResolution[] {
    const ambiguities: AmbiguityResolution[] = [];

    // Check for tempo ambiguities
    if (originalText.includes('fast') && !originalText.match(/\d+\s*bpm/i)) {
      ambiguities.push({
        field: 'audio.tempo',
        ambiguousTerm: 'fast',
        possibleValues: ['140 BPM', '160 BPM', '180 BPM'],
        suggestion: 'Specify exact BPM for "fast" tempo (e.g., "140 BPM" for moderately fast)',
        confidence: 0.4
      });
    }

    if (originalText.includes('slow') && !originalText.match(/\d+\s*bpm/i)) {
      ambiguities.push({
        field: 'audio.tempo',
        ambiguousTerm: 'slow',
        possibleValues: ['60 BPM', '70 BPM', '80 BPM'],
        suggestion: 'Specify exact BPM for "slow" tempo (e.g., "70 BPM" for ballad)',
        confidence: 0.4
      });
    }

    return ambiguities;
  }

  /**
   * Helper methods
   */
  private hasGenericTerms(terms: string[], genericList: string[]): boolean {
    return terms.some(term => genericList.includes(term.toLowerCase()));
  }

  private hasAmbiguousColors(colors: string[]): boolean {
    const ambiguous = ['dark', 'light', 'bright', 'muted', 'colorful'];
    return colors.some(color => ambiguous.includes(color.toLowerCase()));
  }

  private getRelevantStyles(currentStyles: string[]): string[] {
    // Return styles that might be relevant based on current styles
    return this.visualStyles.slice(0, 4);
  }

  private getSpecificColorSuggestions(colors: string[]): string[] {
    return ['deep blue', 'warm red', 'forest green', 'golden yellow'];
  }

  private getSpecificColorAlternatives(ambiguousColor: string): string[] {
    const alternatives: Record<string, string[]> = {
      'dark': ['deep blue', 'charcoal gray', 'midnight black', 'forest green'],
      'light': ['pale yellow', 'soft pink', 'cream white', 'sky blue'],
      'bright': ['electric blue', 'neon green', 'vibrant red', 'sunny yellow'],
      'muted': ['sage green', 'dusty rose', 'slate gray', 'taupe brown'],
      'colorful': ['rainbow palette', 'vibrant mix', 'jewel tones', 'primary colors']
    };

    return alternatives[ambiguousColor.toLowerCase()] || ['specific color name'];
  }

  private prioritizeAndLimitSuggestions(suggestions: Suggestion[]): Suggestion[] {
    // Sort by priority: high -> medium -> low
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    
    return suggestions
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
      .slice(0, 8); // Limit to 8 suggestions to avoid overwhelming users
  }
}