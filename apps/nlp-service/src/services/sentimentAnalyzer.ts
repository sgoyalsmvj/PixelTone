import Sentiment from 'sentiment';
import { VisualParameters, AudioParameters } from '@ai-studio/shared-types';

/**
 * Mood mapping configuration for visual parameters
 */
interface MoodVisualMapping {
  colors: string[];
  style: string[];
  composition: string;
  themes: string[];
}

/**
 * Mood mapping configuration for audio parameters
 */
interface MoodAudioMapping {
  genre: string[];
  instruments: string[];
  tempoModifier: number; // Multiplier for base tempo
  structure: string;
}

/**
 * Sentiment analysis service for mood interpretation
 */
export class SentimentAnalyzer {
  private sentiment: Sentiment;
  private moodVisualMappings!: Map<string, MoodVisualMapping>;
  private moodAudioMappings!: Map<string, MoodAudioMapping>;

  constructor() {
    this.sentiment = new Sentiment();
    
    // Add custom words to sentiment analysis
    const customWords = {
      'beautiful': 2,
      'amazing': 2,
      'wonderful': 2,
      'joyful': 3,
      'happy': 2,
      'cheerful': 2,
      'peaceful': 2,
      'energetic': 2,
      'uplifting': 2,
      'bright': 1,
      'vibrant': 2,
      'serene': 2,
      'calm': 1,
      'romantic': 2,
      'playful': 2,
      'whimsical': 1,
      'elegant': 1,
      'sophisticated': 1,
      'dramatic': 0,
      'mysterious': 0,
      'terrible': -2,
      'awful': -2,
      'sad': -2,
      'melancholic': -2,
      'dark': -1,
      'depressing': -2,
      'hate': -3,
      'love': 3,
      'gloomy': -2,
      'somber': -1,
      'nostalgic': -1,
      'wistful': -1,
      'aggressive': -1,
      'intense': 0,
      'fierce': -1
    };

    // Register custom words using the correct API
    this.sentiment.registerLanguage('en', {
      labels: customWords
    });

    // Initialize mood mappings
    this.initializeMoodMappings();
  }

  /**
   * Initialize mood to parameter mappings
   */
  private initializeMoodMappings(): void {
    // Visual mood mappings
    this.moodVisualMappings = new Map([
      ['joyful', {
        colors: ['bright yellow', 'orange', 'warm colors', 'sunny'],
        style: ['vibrant', 'cheerful', 'expressive'],
        composition: 'dynamic',
        themes: ['celebration', 'sunshine', 'flowers', 'children playing']
      }],
      ['energetic', {
        colors: ['red', 'orange', 'electric blue', 'neon'],
        style: ['dynamic', 'bold', 'high contrast'],
        composition: 'action-packed',
        themes: ['sports', 'movement', 'city life', 'dance']
      }],
      ['peaceful', {
        colors: ['soft blue', 'green', 'pastel', 'earth tones'],
        style: ['soft', 'gentle', 'minimalist'],
        composition: 'balanced',
        themes: ['nature', 'meditation', 'zen garden', 'quiet lake']
      }],
      ['romantic', {
        colors: ['pink', 'rose', 'warm purple', 'gold'],
        style: ['soft', 'dreamy', 'impressionist'],
        composition: 'intimate',
        themes: ['couples', 'sunset', 'flowers', 'candlelight']
      }],
      ['playful', {
        colors: ['rainbow', 'bright colors', 'multicolor'],
        style: ['cartoon', 'whimsical', 'fun'],
        composition: 'scattered',
        themes: ['toys', 'animals', 'games', 'fantasy']
      }],
      ['melancholic', {
        colors: ['blue', 'grey', 'muted colors', 'monochrome'],
        style: ['soft', 'blurred', 'impressionist'],
        composition: 'empty space',
        themes: ['rain', 'autumn', 'solitude', 'memories']
      }],
      ['dark', {
        colors: ['black', 'dark purple', 'deep red', 'shadow'],
        style: ['gothic', 'dramatic', 'high contrast'],
        composition: 'moody lighting',
        themes: ['night', 'mystery', 'gothic architecture', 'shadows']
      }],
      ['intense', {
        colors: ['red', 'black', 'high contrast'],
        style: ['bold', 'aggressive', 'sharp'],
        composition: 'dramatic angles',
        themes: ['storm', 'fire', 'conflict', 'power']
      }],
      ['nostalgic', {
        colors: ['sepia', 'faded colors', 'vintage'],
        style: ['vintage', 'soft focus', 'film grain'],
        composition: 'classic',
        themes: ['old photos', 'vintage cars', 'childhood', 'memories']
      }],
      ['elegant', {
        colors: ['gold', 'silver', 'black and white', 'deep blue'],
        style: ['refined', 'sophisticated', 'clean lines'],
        composition: 'symmetrical',
        themes: ['luxury', 'fashion', 'architecture', 'jewelry']
      }],
      ['mysterious', {
        colors: ['dark blue', 'purple', 'shadow', 'moonlight'],
        style: ['atmospheric', 'ethereal', 'soft edges'],
        composition: 'hidden elements',
        themes: ['fog', 'forest', 'ancient ruins', 'secrets']
      }],
      ['dramatic', {
        colors: ['high contrast', 'bold colors', 'spotlight'],
        style: ['theatrical', 'bold', 'expressive'],
        composition: 'dramatic lighting',
        themes: ['theater', 'performance', 'epic scenes', 'heroes']
      }]
    ]);

    // Audio mood mappings
    this.moodAudioMappings = new Map([
      ['joyful', {
        genre: ['pop', 'folk', 'upbeat'],
        instruments: ['acoustic guitar', 'piano', 'violin', 'flute'],
        tempoModifier: 1.2,
        structure: 'verse-chorus-verse-chorus-bridge-chorus'
      }],
      ['energetic', {
        genre: ['rock', 'electronic', 'dance'],
        instruments: ['electric guitar', 'drums', 'synthesizer', 'bass'],
        tempoModifier: 1.4,
        structure: 'intro-verse-chorus-verse-chorus-solo-chorus'
      }],
      ['peaceful', {
        genre: ['ambient', 'classical', 'new age'],
        instruments: ['piano', 'strings', 'harp', 'flute'],
        tempoModifier: 0.7,
        structure: 'intro-theme-variation-theme-outro'
      }],
      ['romantic', {
        genre: ['ballad', 'jazz', 'classical'],
        instruments: ['piano', 'violin', 'cello', 'soft vocals'],
        tempoModifier: 0.8,
        structure: 'intro-verse-chorus-verse-chorus-bridge-chorus'
      }],
      ['playful', {
        genre: ['children', 'novelty', 'swing'],
        instruments: ['xylophone', 'kazoo', 'accordion', 'toy piano'],
        tempoModifier: 1.1,
        structure: 'verse-chorus-verse-chorus-fun-section-chorus'
      }],
      ['melancholic', {
        genre: ['blues', 'folk', 'indie'],
        instruments: ['acoustic guitar', 'piano', 'harmonica', 'strings'],
        tempoModifier: 0.6,
        structure: 'intro-verse-verse-chorus-verse-outro'
      }],
      ['dark', {
        genre: ['gothic', 'industrial', 'dark ambient'],
        instruments: ['organ', 'distorted guitar', 'synthesizer', 'choir'],
        tempoModifier: 0.8,
        structure: 'intro-theme-development-climax-resolution'
      }],
      ['intense', {
        genre: ['metal', 'hardcore', 'aggressive rock'],
        instruments: ['distorted guitar', 'heavy drums', 'bass', 'screaming vocals'],
        tempoModifier: 1.5,
        structure: 'intro-verse-chorus-verse-chorus-breakdown-chorus'
      }],
      ['nostalgic', {
        genre: ['vintage', 'oldies', 'folk'],
        instruments: ['acoustic guitar', 'harmonica', 'piano', 'strings'],
        tempoModifier: 0.9,
        structure: 'intro-verse-chorus-verse-chorus-outro'
      }],
      ['elegant', {
        genre: ['classical', 'jazz', 'sophisticated pop'],
        instruments: ['piano', 'strings', 'brass', 'sophisticated percussion'],
        tempoModifier: 1.0,
        structure: 'intro-theme-development-recapitulation-coda'
      }],
      ['mysterious', {
        genre: ['ambient', 'cinematic', 'experimental'],
        instruments: ['synthesizer', 'ethereal vocals', 'unusual percussion', 'processed sounds'],
        tempoModifier: 0.8,
        structure: 'intro-build-climax-resolution-outro'
      }],
      ['dramatic', {
        genre: ['cinematic', 'orchestral', 'epic'],
        instruments: ['full orchestra', 'choir', 'timpani', 'brass'],
        tempoModifier: 1.1,
        structure: 'intro-build-climax-resolution-finale'
      }]
    ]);
  }

  /**
   * Analyze sentiment and mood from text input
   */
  analyzeSentiment(text: string): {
    sentiment: 'positive' | 'negative' | 'neutral';
    mood: string;
    confidence: number;
  } {
    const result = this.sentiment.analyze(text);
    
    // Determine sentiment based on score
    let sentimentType: 'positive' | 'negative' | 'neutral';
    if (result.score > 0) {
      sentimentType = 'positive';
    } else if (result.score < 0) {
      sentimentType = 'negative';
    } else {
      sentimentType = 'neutral';
    }

    // Calculate enhanced confidence based on multiple factors
    const confidence = this.calculateConfidence(text, result);

    // Determine mood based on sentiment and specific keywords
    const mood = this.determineMood(text, sentimentType, result.score);

    return {
      sentiment: sentimentType,
      mood,
      confidence
    };
  }

  /**
   * Calculate confidence score based on multiple factors
   */
  private calculateConfidence(text: string, sentimentResult: any): number {
    const normalizedText = text.toLowerCase();
    
    // Base confidence from sentiment score magnitude
    const scoreConfidence = Math.min(Math.abs(sentimentResult.score) / Math.max(sentimentResult.words.length, 1), 1.0);
    
    // Keyword confidence - higher if we find specific mood keywords
    const moodKeywords = [
      'happy', 'sad', 'angry', 'peaceful', 'energetic', 'romantic', 'playful',
      'melancholic', 'dark', 'mysterious', 'dramatic', 'elegant', 'joyful',
      'intense', 'nostalgic', 'cheerful', 'gloomy', 'vibrant', 'serene'
    ];
    
    const foundKeywords = moodKeywords.filter(keyword => normalizedText.includes(keyword));
    const keywordConfidence = Math.min(foundKeywords.length * 0.3, 1.0);
    
    // Text length confidence - longer text generally provides more context
    const lengthConfidence = Math.min(text.length / 100, 1.0) * 0.5;
    
    // Emotional word density
    const emotionalWords = [...sentimentResult.positive, ...sentimentResult.negative];
    const emotionalDensity = emotionalWords.length / Math.max(sentimentResult.words.length, 1);
    const densityConfidence = Math.min(emotionalDensity * 2, 1.0);
    
    // Combine all confidence factors with weights
    const combinedConfidence = (
      scoreConfidence * 0.4 +
      keywordConfidence * 0.3 +
      lengthConfidence * 0.1 +
      densityConfidence * 0.2
    );
    
    // Ensure minimum confidence of 0.1 and maximum of 1.0
    return Math.max(Math.min(combinedConfidence, 1.0), 0.1);
  }

  /**
   * Map mood to visual generation parameters
   */
  mapMoodToVisualParameters(mood: string, existingParams?: Partial<VisualParameters>): Partial<VisualParameters> {
    const moodMapping = this.moodVisualMappings.get(mood);
    
    if (!moodMapping) {
      return existingParams || {};
    }

    const mappedParams: Partial<VisualParameters> = {
      ...existingParams,
      mood: mood
    };

    // Add colors if not already specified
    if (!existingParams?.colors || existingParams.colors.length === 0) {
      mappedParams.colors = moodMapping.colors;
    } else {
      // Merge with existing colors, prioritizing mood-appropriate ones
      mappedParams.colors = [...new Set([...moodMapping.colors, ...existingParams.colors])];
    }

    // Add style suggestions if not already specified
    if (!existingParams?.style || existingParams.style.length === 0) {
      mappedParams.style = moodMapping.style;
    } else {
      // Merge with existing styles
      mappedParams.style = [...new Set([...moodMapping.style, ...existingParams.style])];
    }

    // Add composition if not specified
    if (!existingParams?.composition) {
      mappedParams.composition = moodMapping.composition;
    }

    // Add themes if not already specified
    if (!existingParams?.themes || existingParams.themes.length === 0) {
      mappedParams.themes = moodMapping.themes;
    } else {
      // Merge with existing themes
      mappedParams.themes = [...new Set([...moodMapping.themes, ...existingParams.themes])];
    }

    return mappedParams;
  }

  /**
   * Map mood to audio generation parameters
   */
  mapMoodToAudioParameters(mood: string, existingParams?: Partial<AudioParameters>): Partial<AudioParameters> {
    const moodMapping = this.moodAudioMappings.get(mood);
    
    if (!moodMapping) {
      return existingParams || {};
    }

    const mappedParams: Partial<AudioParameters> = {
      ...existingParams,
      mood: mood
    };

    // Add genre if not already specified
    if (!existingParams?.genre || existingParams.genre.length === 0) {
      mappedParams.genre = moodMapping.genre;
    } else {
      // Merge with existing genres
      mappedParams.genre = [...new Set([...moodMapping.genre, ...existingParams.genre])];
    }

    // Add instruments if not already specified
    if (!existingParams?.instruments || existingParams.instruments.length === 0) {
      mappedParams.instruments = moodMapping.instruments;
    } else {
      // Merge with existing instruments
      mappedParams.instruments = [...new Set([...moodMapping.instruments, ...existingParams.instruments])];
    }

    // Adjust tempo based on mood if not already specified or if using default
    const baseTempo = existingParams?.tempo || 120;
    if (!existingParams?.tempo || existingParams.tempo === 120) {
      mappedParams.tempo = Math.round(baseTempo * moodMapping.tempoModifier);
    }

    // Add structure if not specified
    if (!existingParams?.structure) {
      mappedParams.structure = moodMapping.structure;
    }

    return mappedParams;
  }

  /**
   * Get mood-based parameter suggestions
   */
  getMoodParameterSuggestions(mood: string, type: 'visual' | 'audio' | 'both' = 'both'): {
    visual?: string[];
    audio?: string[];
  } {
    const suggestions: { visual?: string[]; audio?: string[] } = {};

    if (type === 'visual' || type === 'both') {
      const visualMapping = this.moodVisualMappings.get(mood);
      if (visualMapping) {
        suggestions.visual = [
          `Try ${visualMapping.colors.join(' or ')} colors for a ${mood} feel`,
          `Consider ${visualMapping.style.join(' or ')} style elements`,
          `Use ${visualMapping.composition} composition`,
          `Include themes like ${visualMapping.themes.slice(0, 2).join(' or ')}`
        ];
      }
    }

    if (type === 'audio' || type === 'both') {
      const audioMapping = this.moodAudioMappings.get(mood);
      if (audioMapping) {
        suggestions.audio = [
          `Try ${audioMapping.genre.join(' or ')} genre for ${mood} mood`,
          `Consider ${audioMapping.instruments.slice(0, 2).join(' and ')} instruments`,
          `Use ${audioMapping.structure} song structure`,
          `Adjust tempo to ${audioMapping.tempoModifier > 1 ? 'faster' : audioMapping.tempoModifier < 1 ? 'slower' : 'moderate'} pace`
        ];
      }
    }

    return suggestions;
  }

  /**
   * Determine specific mood based on sentiment and keywords
   */
  private determineMood(text: string, sentiment: 'positive' | 'negative' | 'neutral', score: number): string {
    const normalizedText = text.toLowerCase();

    // Check for specific mood keywords first, regardless of sentiment
    if (this.containsKeywords(normalizedText, ['dark', 'gothic', 'brooding']) && 
        !this.containsKeywords(normalizedText, ['bright', 'light', 'cheerful'])) {
      return 'dark';
    }
    if (this.containsKeywords(normalizedText, ['elegant', 'sophisticated', 'refined']) &&
        !this.containsKeywords(normalizedText, ['sad', 'angry', 'terrible'])) {
      return 'elegant';
    }

    // Positive moods
    if (sentiment === 'positive') {
      if (this.containsKeywords(normalizedText, ['happy', 'joy', 'cheerful', 'bright', 'sunny'])) {
        return 'joyful';
      }
      if (this.containsKeywords(normalizedText, ['excited', 'energetic', 'dynamic', 'vibrant'])) {
        return 'energetic';
      }
      if (this.containsKeywords(normalizedText, ['peaceful', 'calm', 'serene', 'tranquil'])) {
        return 'peaceful';
      }
      if (this.containsKeywords(normalizedText, ['romantic', 'love', 'tender', 'gentle'])) {
        return 'romantic';
      }
      if (this.containsKeywords(normalizedText, ['playful', 'fun', 'whimsical', 'amusing'])) {
        return 'playful';
      }
      return 'uplifting';
    }

    // Negative moods
    if (sentiment === 'negative') {
      if (this.containsKeywords(normalizedText, ['sad', 'melancholy', 'sorrowful', 'gloomy'])) {
        return 'melancholic';
      }
      if (this.containsKeywords(normalizedText, ['angry', 'aggressive', 'intense', 'fierce'])) {
        return 'intense';
      }
      if (this.containsKeywords(normalizedText, ['nostalgic', 'wistful', 'longing', 'reminiscent'])) {
        return 'nostalgic';
      }
      return 'somber';
    }

    // Neutral moods
    if (this.containsKeywords(normalizedText, ['dramatic', 'theatrical', 'bold', 'striking'])) {
      return 'dramatic';
    }
    if (this.containsKeywords(normalizedText, ['mysterious', 'enigmatic', 'intriguing'])) {
      return 'mysterious';
    }

    return 'neutral';
  }

  /**
   * Check if text contains any of the specified keywords
   */
  private containsKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }

  /**
   * Get emotional intensity from sentiment score
   */
  getEmotionalIntensity(text: string): number {
    const result = this.sentiment.analyze(text);
    const intensity = Math.abs(result.score) / Math.max(result.words.length, 1);
    return Math.min(intensity, 1.0);
  }

  /**
   * Extract emotional keywords from text
   */
  extractEmotionalKeywords(text: string): string[] {
    const result = this.sentiment.analyze(text);
    
    // Get positive and negative words
    const emotionalWords = [
      ...result.positive,
      ...result.negative
    ];

    return emotionalWords;
  }

  /**
   * Analyze mood progression in longer texts
   */
  analyzeMoodProgression(text: string): Array<{
    sentence: string;
    mood: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
  }> {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    return sentences.map(sentence => {
      const analysis = this.analyzeSentiment(sentence.trim());
      const result = this.sentiment.analyze(sentence.trim());
      
      return {
        sentence: sentence.trim(),
        mood: analysis.mood,
        sentiment: analysis.sentiment,
        score: result.score
      };
    });
  }
}