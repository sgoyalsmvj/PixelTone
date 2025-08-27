import { 
  NLPService as INLPService, 
  NLPInput, 
  NLPResponse, 
  ValidationResult,
  ParsedParameters,
  VisualParameters,
  AudioParameters
} from '@ai-studio/shared-types';
import { TextProcessor } from './textProcessor';
import { IntentClassifier } from './intentClassifier';
import { ParameterExtractor } from './parameterExtractor';
import { SentimentAnalyzer } from './sentimentAnalyzer';

/**
 * Main NLP service implementation
 */
export class NLPService implements INLPService {
  private textProcessor = new TextProcessor();
  private intentClassifier = new IntentClassifier();
  private parameterExtractor = new ParameterExtractor();
  private sentimentAnalyzer = new SentimentAnalyzer();

  /**
   * Parse natural language input into structured parameters
   */
  async parseCreativeInput(input: NLPInput): Promise<NLPResponse> {
    const startTime = Date.now();
    
    try {
      // Normalize and preprocess text
      const normalizedText = this.textProcessor.normalize(input.text);
      
      // Classify intent if not provided or if type is 'mixed'
      let actualType = input.type;
      if (input.type === 'mixed') {
        actualType = this.intentClassifier.classifyIntent(normalizedText);
      }

      // Extract parameters based on intent
      let visual: VisualParameters | undefined;
      let audio: AudioParameters | undefined;

      if (actualType === 'visual' || actualType === 'mixed') {
        visual = this.parameterExtractor.extractVisualParameters(normalizedText);
      }

      if (actualType === 'audio' || actualType === 'mixed') {
        audio = this.parameterExtractor.extractAudioParameters(normalizedText);
      }

      // Analyze sentiment for mood enhancement
      const sentimentAnalysis = this.sentimentAnalyzer.analyzeSentiment(normalizedText);
      
      // Enhance parameters with mood-based mappings
      if (visual) {
        visual = {
          ...visual,
          ...this.sentimentAnalyzer.mapMoodToVisualParameters(sentimentAnalysis.mood, visual)
        } as VisualParameters;
      }
      
      if (audio) {
        audio = {
          ...audio,
          ...this.sentimentAnalyzer.mapMoodToAudioParameters(sentimentAnalysis.mood, audio)
        } as AudioParameters;
      }

      // Calculate overall confidence
      const intentConfidence = this.intentClassifier.getClassificationConfidence(normalizedText);
      const sentimentConfidence = sentimentAnalysis.confidence;
      const overallConfidence = (intentConfidence + sentimentConfidence) / 2;

      // Identify ambiguities
      const ambiguities = this.identifyAmbiguities(normalizedText, visual, audio);

      // Generate suggestions including mood-based ones
      const suggestions = this.generateSuggestions(normalizedText, visual, audio, ambiguities, sentimentAnalysis.mood);

      const processingTime = Date.now() - startTime;

      const parameters: ParsedParameters = {
        visual,
        audio,
        confidence: overallConfidence,
        ambiguities: ambiguities.map(a => a.field)
      };

      return {
        parameters,
        confidence: overallConfidence,
        ambiguities,
        suggestions,
        processingTime
      };

    } catch (error) {
      console.error('Error parsing creative input:', error);
      throw new Error('Failed to parse creative input');
    }
  }

  /**
   * Validate parsed parameters for completeness and correctness
   */
  async validateParameters(parameters: ParsedParameters): Promise<ValidationResult> {
    const errors: Array<{ field: string; message: string; code: string }> = [];
    const warnings: Array<{ field: string; message: string; suggestion?: string }> = [];

    // Validate visual parameters
    if (parameters.visual) {
      if (parameters.visual.style.length === 0) {
        warnings.push({
          field: 'visual.style',
          message: 'No visual style specified',
          suggestion: 'Consider adding style keywords like "realistic", "abstract", or "cartoon"'
        });
      }

      if (parameters.visual.colors.length === 0) {
        warnings.push({
          field: 'visual.colors',
          message: 'No colors specified',
          suggestion: 'Consider adding color descriptions for better results'
        });
      }

      if (!parameters.visual.mood) {
        warnings.push({
          field: 'visual.mood',
          message: 'No mood specified',
          suggestion: 'Consider adding mood keywords like "peaceful", "energetic", or "dramatic"'
        });
      }
    }

    // Validate audio parameters
    if (parameters.audio) {
      if (parameters.audio.genre.length === 0) {
        warnings.push({
          field: 'audio.genre',
          message: 'No musical genre specified',
          suggestion: 'Consider adding genre keywords like "rock", "jazz", or "electronic"'
        });
      }

      if (parameters.audio.instruments.length === 0) {
        warnings.push({
          field: 'audio.instruments',
          message: 'No instruments specified',
          suggestion: 'Consider adding instrument names like "piano", "guitar", or "drums"'
        });
      }

      if (parameters.audio.tempo < 60 || parameters.audio.tempo > 200) {
        errors.push({
          field: 'audio.tempo',
          message: 'Tempo must be between 60 and 200 BPM',
          code: 'INVALID_TEMPO'
        });
      }
    }

    // Check if at least one type is specified
    if (!parameters.visual && !parameters.audio) {
      errors.push({
        field: 'parameters',
        message: 'At least one parameter type (visual or audio) must be specified',
        code: 'NO_PARAMETERS'
      });
    }

    // Check confidence level
    if (parameters.confidence < 0.3) {
      warnings.push({
        field: 'confidence',
        message: 'Low confidence in parameter extraction',
        suggestion: 'Consider providing more specific descriptions'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Suggest improvements for ambiguous or incomplete parameters
   */
  async suggestImprovements(parameters: ParsedParameters): Promise<string[]> {
    const suggestions: string[] = [];

    if (parameters.visual) {
      if (parameters.visual.style.length === 0) {
        suggestions.push('Add style descriptions like "realistic portrait" or "abstract landscape"');
      }
      
      if (parameters.visual.colors.length === 0) {
        suggestions.push('Specify colors like "warm colors", "blue and gold", or "monochrome"');
      }
      
      if (parameters.visual.themes.length === 0) {
        suggestions.push('Include themes like "nature", "urban", or "fantasy"');
      }
    }

    if (parameters.audio) {
      if (parameters.audio.genre.length === 0) {
        suggestions.push('Specify musical genre like "jazz", "rock", or "classical"');
      }
      
      if (parameters.audio.instruments.length === 0) {
        suggestions.push('Mention instruments like "piano and strings" or "electric guitar"');
      }
      
      if (parameters.audio.tempo === 120) { // Default tempo
        suggestions.push('Specify tempo like "slow ballad", "upbeat", or "120 BPM"');
      }
    }

    if (parameters.confidence < 0.5) {
      suggestions.push('Be more specific with descriptive words and avoid ambiguous terms');
    }

    if (parameters.ambiguities.length > 0) {
      suggestions.push('Clarify ambiguous terms for better results');
    }

    return suggestions;
  }

  /**
   * Extract intent from user input
   */
  async classifyIntent(text: string): Promise<'visual' | 'audio' | 'mixed'> {
    const normalizedText = this.textProcessor.normalize(text);
    return this.intentClassifier.classifyIntent(normalizedText);
  }

  /**
   * Analyze sentiment and mood from text input
   */
  async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    mood: string;
    confidence: number;
  }> {
    return this.sentimentAnalyzer.analyzeSentiment(text);
  }

  /**
   * Identify ambiguities in the parsed parameters
   */
  private identifyAmbiguities(
    text: string, 
    visual?: VisualParameters, 
    audio?: AudioParameters
  ): Array<{ field: string; possibleValues: string[]; suggestion?: string }> {
    const ambiguities: Array<{ field: string; possibleValues: string[]; suggestion?: string }> = [];

    // Check for ambiguous color terms
    if (visual?.colors) {
      for (const color of visual.colors) {
        if (['dark', 'light', 'bright', 'muted'].includes(color)) {
          ambiguities.push({
            field: 'visual.colors',
            possibleValues: ['specific color names', 'hex codes', 'color combinations'],
            suggestion: `"${color}" is ambiguous - consider specific colors like "dark blue" or "bright red"`
          });
        }
      }
    }

    // Check for ambiguous style terms
    if (visual?.style) {
      for (const style of visual.style) {
        if (['artistic', 'creative', 'beautiful'].includes(style)) {
          ambiguities.push({
            field: 'visual.style',
            possibleValues: ['realistic', 'abstract', 'cartoon', 'oil painting', 'digital art'],
            suggestion: `"${style}" is too general - specify a particular art style`
          });
        }
      }
    }

    // Check for ambiguous tempo descriptions
    if (audio && text.includes('fast') && !text.match(/\d+\s*bpm/i)) {
      ambiguities.push({
        field: 'audio.tempo',
        possibleValues: ['140 BPM', '160 BPM', '180 BPM'],
        suggestion: 'Specify exact BPM for "fast" tempo'
      });
    }

    return ambiguities;
  }

  /**
   * Generate helpful suggestions based on the input and extracted parameters
   */
  private generateSuggestions(
    text: string,
    visual?: VisualParameters,
    audio?: AudioParameters,
    ambiguities: Array<{ field: string; possibleValues: string[]; suggestion?: string }> = [],
    mood?: string
  ): string[] {
    const suggestions: string[] = [];

    // Add suggestions based on ambiguities
    suggestions.push(...ambiguities.map(a => a.suggestion).filter(Boolean) as string[]);

    // Add mood-based suggestions
    if (mood && mood !== 'neutral') {
      const moodSuggestions = this.sentimentAnalyzer.getMoodParameterSuggestions(
        mood, 
        visual && audio ? 'both' : visual ? 'visual' : audio ? 'audio' : 'both'
      );
      
      if (moodSuggestions.visual) {
        suggestions.push(...moodSuggestions.visual.slice(0, 2));
      }
      
      if (moodSuggestions.audio) {
        suggestions.push(...moodSuggestions.audio.slice(0, 2));
      }
    }

    // Suggest complementary parameters
    if (visual && !audio && text.length > 50) {
      suggestions.push('Consider adding background music to enhance your visual creation');
    }

    if (audio && !visual && text.length > 50) {
      suggestions.push('Consider adding visual elements to create a multimedia experience');
    }

    // Suggest more specific descriptions
    if (visual?.themes.length === 0) {
      suggestions.push('Add thematic elements like "sunset", "forest", or "cityscape" for better results');
    }

    if (audio?.structure === 'verse-chorus' && audio.genre.length > 0) {
      suggestions.push('Consider specifying song structure like "intro-verse-chorus-bridge-outro"');
    }

    return suggestions.slice(0, 6); // Limit to 6 suggestions to accommodate mood suggestions
  }
}