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
import { ParameterValidator } from './parameterValidator';
import { SuggestionEngine, AmbiguityResolution } from './suggestionEngine';
import { ParameterNormalizer } from './parameterNormalizer';

/**
 * Main NLP service implementation
 */
export class NLPService implements INLPService {
  private textProcessor = new TextProcessor();
  private intentClassifier = new IntentClassifier();
  private parameterExtractor = new ParameterExtractor();
  private sentimentAnalyzer = new SentimentAnalyzer();
  private parameterValidator = new ParameterValidator();
  private suggestionEngine = new SuggestionEngine();
  private parameterNormalizer = new ParameterNormalizer();

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

      // Create initial parameters object
      let parameters: ParsedParameters = {
        visual,
        audio,
        confidence: overallConfidence,
        ambiguities: []
      };

      // Normalize parameters
      parameters = this.parameterNormalizer.normalizeParameters(parameters, {
        applyDefaults: false,
        sanitizeInput: true,
        standardizeTerms: true,
        removeInvalidEntries: true
      });

      // Apply smart defaults based on context
      parameters = this.parameterNormalizer.applySmartDefaults(parameters);

      // Identify ambiguities using the suggestion engine
      const ambiguityResolutions = this.suggestionEngine.identifyAmbiguities(parameters, normalizedText);
      parameters.ambiguities = ambiguityResolutions.map(a => a.field);

      // Generate comprehensive suggestions
      const suggestions = await this.suggestionEngine.generateSuggestions(
        parameters, 
        normalizedText, 
        ambiguityResolutions
      );

      const processingTime = Date.now() - startTime;

      return {
        parameters,
        confidence: parameters.confidence,
        ambiguities: ambiguityResolutions,
        suggestions: suggestions.map(s => s.message),
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
    return this.parameterValidator.validateParameters(parameters);
  }

  /**
   * Suggest improvements for ambiguous or incomplete parameters
   */
  async suggestImprovements(parameters: ParsedParameters): Promise<string[]> {
    const suggestions = await this.suggestionEngine.generateSuggestions(parameters);
    return suggestions.map(s => s.message);
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
   * Normalize parameters with default options
   */
  async normalizeParameters(parameters: ParsedParameters): Promise<ParsedParameters> {
    let normalized = this.parameterNormalizer.normalizeParameters(parameters);
    normalized = this.parameterNormalizer.applySmartDefaults(normalized);
    return normalized;
  }

  /**
   * Check if parameters are complete enough for generation
   */
  async isCompleteForGeneration(parameters: ParsedParameters): Promise<boolean> {
    return this.parameterValidator.isCompleteForGeneration(parameters);
  }

  /**
   * Get validation severity level for UI feedback
   */
  async getValidationSeverity(parameters: ParsedParameters): Promise<'error' | 'warning' | 'info' | 'success'> {
    return this.parameterValidator.getValidationSeverity(parameters);
  }
}