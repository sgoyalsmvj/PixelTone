import { SuggestionEngine, AmbiguityResolution } from '../services/suggestionEngine';
import { ParsedParameters } from '@ai-studio/shared-types';

describe('SuggestionEngine', () => {
  let suggestionEngine: SuggestionEngine;

  beforeEach(() => {
    suggestionEngine = new SuggestionEngine();
  });

  describe('generateSuggestions', () => {
    it('should generate suggestions for empty visual parameters', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: [],
          colors: [],
          mood: '',
          composition: '',
          themes: []
        },
        confidence: 0.5,
        ambiguities: []
      };

      const suggestions = await suggestionEngine.generateSuggestions(parameters);

      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.type === 'improvement' && s.category === 'visual')).toBe(true);
      expect(suggestions.some(s => s.field === 'visual.style')).toBe(true);
      expect(suggestions.some(s => s.field === 'visual.colors')).toBe(true);
    });

    it('should generate suggestions for empty audio parameters', async () => {
      const parameters: ParsedParameters = {
        audio: {
          genre: [],
          instruments: [],
          tempo: 120,
          mood: '',
          structure: ''
        },
        confidence: 0.5,
        ambiguities: []
      };

      const suggestions = await suggestionEngine.generateSuggestions(parameters);

      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.type === 'improvement' && s.category === 'audio')).toBe(true);
      expect(suggestions.some(s => s.field === 'audio.genre')).toBe(true);
      expect(suggestions.some(s => s.field === 'audio.instruments')).toBe(true);
    });

    it('should generate high priority suggestions for missing critical elements', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: [],
          colors: [],
          mood: '',
          composition: '',
          themes: []
        },
        confidence: 0.2, // Low confidence
        ambiguities: []
      };

      const suggestions = await suggestionEngine.generateSuggestions(parameters);

      const highPrioritySuggestions = suggestions.filter(s => s.priority === 'high');
      expect(highPrioritySuggestions.length).toBeGreaterThan(0);
    });

    it('should generate enhancement suggestions for complete but basic parameters', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['photorealistic'],
          colors: ['blue'],
          mood: 'calm',
          composition: '',
          themes: []
        },
        confidence: 0.7,
        ambiguities: []
      };

      const suggestions = await suggestionEngine.generateSuggestions(parameters);

      expect(suggestions.some(s => s.type === 'enhancement')).toBe(true);
      expect(suggestions.some(s => s.field === 'visual.themes')).toBe(true);
    });

    it('should generate cross-modal suggestions', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['photorealistic'],
          colors: ['warm colors'],
          mood: 'peaceful',
          composition: '',
          themes: ['nature']
        },
        confidence: 0.7,
        ambiguities: []
      };

      const originalText = 'Create a beautiful peaceful landscape with warm colors in a photorealistic style showing nature themes';
      const suggestions = await suggestionEngine.generateSuggestions(parameters, originalText);

      expect(suggestions.some(s => s.category === 'general')).toBe(true);
    });

    it('should include examples in suggestions', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: [],
          colors: [],
          mood: '',
          composition: '',
          themes: []
        },
        confidence: 0.5,
        ambiguities: []
      };

      const suggestions = await suggestionEngine.generateSuggestions(parameters);

      const suggestionsWithExamples = suggestions.filter(s => s.examples && s.examples.length > 0);
      expect(suggestionsWithExamples.length).toBeGreaterThan(0);
    });

    it('should limit suggestions to reasonable number', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: [],
          colors: [],
          mood: '',
          composition: '',
          themes: []
        },
        audio: {
          genre: [],
          instruments: [],
          tempo: 120,
          mood: '',
          structure: ''
        },
        confidence: 0.2,
        ambiguities: []
      };

      const suggestions = await suggestionEngine.generateSuggestions(parameters);

      expect(suggestions.length).toBeLessThanOrEqual(8); // Should be limited
    });
  });

  describe('identifyAmbiguities', () => {
    it('should identify ambiguous color terms', () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['photorealistic'],
          colors: ['dark', 'bright', 'colorful'],
          mood: 'neutral',
          composition: '',
          themes: []
        },
        confidence: 0.6,
        ambiguities: []
      };

      const originalText = 'Create a photorealistic image with dark and bright colorful elements';
      const ambiguities = suggestionEngine.identifyAmbiguities(parameters, originalText);

      expect(ambiguities.length).toBeGreaterThan(0);
      expect(ambiguities.some(a => a.field === 'visual.colors')).toBe(true);
      expect(ambiguities.some(a => a.ambiguousTerm === 'dark')).toBe(true);
    });

    it('should identify ambiguous style terms', () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['artistic', 'beautiful', 'creative'],
          colors: ['blue'],
          mood: 'calm',
          composition: '',
          themes: []
        },
        confidence: 0.6,
        ambiguities: []
      };

      const originalText = 'Create an artistic and beautiful creative image';
      const ambiguities = suggestionEngine.identifyAmbiguities(parameters, originalText);

      expect(ambiguities.length).toBeGreaterThan(0);
      expect(ambiguities.some(a => a.field === 'visual.style')).toBe(true);
      expect(ambiguities.some(a => a.ambiguousTerm === 'artistic')).toBe(true);
    });

    it('should identify tempo ambiguities', () => {
      const parameters: ParsedParameters = {
        audio: {
          genre: ['rock'],
          instruments: ['guitar'],
          tempo: 120,
          mood: 'energetic',
          structure: ''
        },
        confidence: 0.6,
        ambiguities: []
      };

      const originalText = 'Create a fast rock song with guitar';
      const ambiguities = suggestionEngine.identifyAmbiguities(parameters, originalText);

      expect(ambiguities.some(a => a.field === 'audio.tempo')).toBe(true);
      expect(ambiguities.some(a => a.ambiguousTerm === 'fast')).toBe(true);
    });

    it('should provide specific alternatives for ambiguous terms', () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['artistic'],
          colors: ['dark'],
          mood: 'neutral',
          composition: '',
          themes: []
        },
        confidence: 0.6,
        ambiguities: []
      };

      const originalText = 'Create an artistic image with dark colors';
      const ambiguities = suggestionEngine.identifyAmbiguities(parameters, originalText);

      const colorAmbiguity = ambiguities.find(a => a.ambiguousTerm === 'dark');
      expect(colorAmbiguity).toBeDefined();
      expect(colorAmbiguity!.possibleValues.length).toBeGreaterThan(0);
      expect(colorAmbiguity!.suggestion).toContain('specific');
    });

    it('should not identify ambiguities for specific terms', () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['photorealistic', 'oil painting'],
          colors: ['deep blue', 'warm red'],
          mood: 'peaceful',
          composition: 'rule of thirds',
          themes: ['nature']
        },
        confidence: 0.8,
        ambiguities: []
      };

      const originalText = 'Create a photorealistic oil painting with deep blue and warm red colors';
      const ambiguities = suggestionEngine.identifyAmbiguities(parameters, originalText);

      expect(ambiguities.length).toBe(0);
    });
  });

  describe('suggestion prioritization', () => {
    it('should prioritize high priority suggestions first', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['artistic'], // Generic - should be high priority
          colors: [],
          mood: '',
          composition: '',
          themes: []
        },
        confidence: 0.2, // Low confidence - should be high priority
        ambiguities: []
      };

      const ambiguities: AmbiguityResolution[] = [{
        field: 'visual.style',
        ambiguousTerm: 'artistic',
        possibleValues: ['photorealistic', 'oil painting'],
        suggestion: 'Be more specific with art style',
        confidence: 0.3
      }];

      const suggestions = await suggestionEngine.generateSuggestions(parameters, '', ambiguities);

      const firstSuggestion = suggestions[0];
      expect(firstSuggestion.priority).toBe('high');
    });

    it('should include medium and low priority suggestions', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['photorealistic'],
          colors: ['blue'],
          mood: 'calm',
          composition: '',
          themes: []
        },
        confidence: 0.6,
        ambiguities: []
      };

      const suggestions = await suggestionEngine.generateSuggestions(parameters);

      const priorities = suggestions.map(s => s.priority);
      expect(priorities.includes('medium') || priorities.includes('low')).toBe(true);
    });
  });

  describe('suggestion categories', () => {
    it('should categorize visual suggestions correctly', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: [],
          colors: [],
          mood: '',
          composition: '',
          themes: []
        },
        confidence: 0.5,
        ambiguities: []
      };

      const suggestions = await suggestionEngine.generateSuggestions(parameters);

      const visualSuggestions = suggestions.filter(s => s.category === 'visual');
      expect(visualSuggestions.length).toBeGreaterThan(0);
    });

    it('should categorize audio suggestions correctly', async () => {
      const parameters: ParsedParameters = {
        audio: {
          genre: [],
          instruments: [],
          tempo: 120,
          mood: '',
          structure: ''
        },
        confidence: 0.5,
        ambiguities: []
      };

      const suggestions = await suggestionEngine.generateSuggestions(parameters);

      const audioSuggestions = suggestions.filter(s => s.category === 'audio');
      expect(audioSuggestions.length).toBeGreaterThan(0);
    });

    it('should categorize general suggestions correctly', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['photorealistic'],
          colors: ['blue'],
          mood: 'calm',
          composition: '',
          themes: []
        },
        confidence: 0.2, // Low confidence should generate general suggestions
        ambiguities: []
      };

      const suggestions = await suggestionEngine.generateSuggestions(parameters);

      const generalSuggestions = suggestions.filter(s => s.category === 'general');
      expect(generalSuggestions.length).toBeGreaterThan(0);
    });
  });
});