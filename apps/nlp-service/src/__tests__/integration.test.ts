import { SentimentAnalyzer } from '../services/sentimentAnalyzer';
import { NLPService } from '../services/nlpService';
import { NLPInput } from '@ai-studio/shared-types';

describe('Sentiment Analysis Integration Tests', () => {
  let sentimentAnalyzer: SentimentAnalyzer;
  let nlpService: NLPService;

  beforeEach(() => {
    sentimentAnalyzer = new SentimentAnalyzer();
    nlpService = new NLPService();
  });

  describe('Enhanced Mood Mapping Integration', () => {
    it('should integrate mood mapping with visual parameter extraction', async () => {
      const input: NLPInput = {
        text: 'Create a joyful artwork with bright colors',
        type: 'visual'
      };

      const result = await nlpService.parseCreativeInput(input);

      expect(result.parameters.visual).toBeDefined();
      expect(result.parameters.visual?.mood).toBe('joyful');
      
      // Should include mood-mapped colors
      expect(result.parameters.visual?.colors).toEqual(
        expect.arrayContaining(['bright yellow', 'orange', 'warm colors', 'sunny'])
      );
      
      // Should include mood-mapped styles
      expect(result.parameters.visual?.style).toEqual(
        expect.arrayContaining(['vibrant', 'cheerful', 'expressive'])
      );
      
      // Should include mood-mapped themes
      expect(result.parameters.visual?.themes).toEqual(
        expect.arrayContaining(['celebration', 'sunshine', 'flowers', 'children playing'])
      );
    });

    it('should integrate mood mapping with audio parameter extraction', async () => {
      const input: NLPInput = {
        text: 'Compose energetic music with fast tempo',
        type: 'audio'
      };

      const result = await nlpService.parseCreativeInput(input);

      expect(result.parameters.audio).toBeDefined();
      expect(result.parameters.audio?.mood).toBe('energetic');
      
      // Should include mood-mapped genres
      expect(result.parameters.audio?.genre).toEqual(
        expect.arrayContaining(['rock', 'electronic', 'dance'])
      );
      
      // Should include mood-mapped instruments
      expect(result.parameters.audio?.instruments).toEqual(
        expect.arrayContaining(['electric guitar', 'drums', 'synthesizer', 'bass'])
      );
      
      // Should have adjusted tempo (1.4x modifier for energetic)
      expect(result.parameters.audio?.tempo).toBeGreaterThan(120);
    });

    it('should provide mood-based suggestions in response', async () => {
      const input: NLPInput = {
        text: 'Create something peaceful',
        type: 'mixed'
      };

      const result = await nlpService.parseCreativeInput(input);

      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.length).toBeGreaterThan(0);
      
      // Should include mood-specific suggestions
      const suggestionText = result.suggestions.join(' ');
      expect(suggestionText).toMatch(/peaceful|soft blue|green|gentle|nature|ambient|piano/i);
    });

    it('should calculate enhanced confidence scores', async () => {
      const specificInput: NLPInput = {
        text: 'Create a joyful, energetic, and vibrant artwork with bright yellow colors and cheerful themes',
        type: 'visual'
      };

      const genericInput: NLPInput = {
        text: 'Create art',
        type: 'visual'
      };

      const specificResult = await nlpService.parseCreativeInput(specificInput);
      const genericResult = await nlpService.parseCreativeInput(genericInput);

      expect(specificResult.confidence).toBeGreaterThan(genericResult.confidence);
      expect(specificResult.confidence).toBeGreaterThan(0.5);
      expect(genericResult.confidence).toBeLessThan(0.5);
    });

    it('should handle conflicting moods gracefully', async () => {
      const input: NLPInput = {
        text: 'Create beautiful but dark and mysterious artwork',
        type: 'visual'
      };

      const result = await nlpService.parseCreativeInput(input);

      expect(result.parameters.visual).toBeDefined();
      expect(result.parameters.visual?.mood).toBeTruthy();
      expect(result.confidence).toBeGreaterThan(0);
      
      // Should not crash and should provide some parameters
      expect(result.parameters.visual?.colors).toBeDefined();
      expect(result.parameters.visual?.style).toBeDefined();
    });

    it('should merge mood mappings with existing extracted parameters', async () => {
      const input: NLPInput = {
        text: 'Create a joyful oil painting with red colors in abstract style',
        type: 'visual'
      };

      const result = await nlpService.parseCreativeInput(input);

      expect(result.parameters.visual).toBeDefined();
      
      // Should keep extracted parameters
      expect(result.parameters.visual?.style).toContain('oil painting');
      expect(result.parameters.visual?.style).toContain('abstract');
      expect(result.parameters.visual?.colors).toContain('red');
      
      // Should add mood-mapped parameters
      expect(result.parameters.visual?.colors).toContain('bright yellow');
      expect(result.parameters.visual?.style).toContain('vibrant');
      expect(result.parameters.visual?.mood).toBe('joyful');
    });
  });

  describe('Confidence Scoring Accuracy', () => {
    it('should give higher confidence for multiple mood indicators', () => {
      const multipleIndicators = 'Create joyful, happy, bright, energetic, and cheerful artwork';
      const singleIndicator = 'Create happy artwork';
      
      const multipleResult = sentimentAnalyzer.analyzeSentiment(multipleIndicators);
      const singleResult = sentimentAnalyzer.analyzeSentiment(singleIndicator);
      
      expect(multipleResult.confidence).toBeGreaterThan(singleResult.confidence);
    });

    it('should consider text length in confidence calculation', () => {
      const longDescriptive = 'Create a beautiful, vibrant, and joyful artwork with bright colors, energetic composition, dynamic elements, and cheerful themes that inspire happiness and celebration';
      const shortDescriptive = 'Create joyful art';
      
      const longResult = sentimentAnalyzer.analyzeSentiment(longDescriptive);
      const shortResult = sentimentAnalyzer.analyzeSentiment(shortDescriptive);
      
      expect(longResult.confidence).toBeGreaterThan(shortResult.confidence);
    });

    it('should consider emotional word density', () => {
      const highDensity = 'amazing wonderful beautiful fantastic';
      const lowDensity = 'create a painting with some colors and shapes';
      
      const highResult = sentimentAnalyzer.analyzeSentiment(highDensity);
      const lowResult = sentimentAnalyzer.analyzeSentiment(lowDensity);
      
      expect(highResult.confidence).toBeGreaterThan(lowResult.confidence);
    });
  });

  describe('Mood Parameter Suggestions', () => {
    it('should provide appropriate visual suggestions for different moods', () => {
      const moods = ['joyful', 'peaceful', 'energetic', 'romantic', 'dark', 'mysterious'];
      
      moods.forEach(mood => {
        const suggestions = sentimentAnalyzer.getMoodParameterSuggestions(mood, 'visual');
        
        expect(suggestions.visual).toBeDefined();
        expect(suggestions.visual!.length).toBeGreaterThan(0);
        expect(suggestions.visual![0]).toContain('colors');
      });
    });

    it('should provide appropriate audio suggestions for different moods', () => {
      const moods = ['energetic', 'peaceful', 'romantic', 'intense', 'melancholic'];
      
      moods.forEach(mood => {
        const suggestions = sentimentAnalyzer.getMoodParameterSuggestions(mood, 'audio');
        
        expect(suggestions.audio).toBeDefined();
        expect(suggestions.audio!.length).toBeGreaterThan(0);
        expect(suggestions.audio![0]).toContain('genre');
      });
    });
  });
});