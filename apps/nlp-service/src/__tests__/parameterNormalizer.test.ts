import { ParameterNormalizer } from '../services/parameterNormalizer';
import { ParsedParameters } from '@ai-studio/shared-types';

describe('ParameterNormalizer', () => {
  let normalizer: ParameterNormalizer;

  beforeEach(() => {
    normalizer = new ParameterNormalizer();
  });

  describe('normalizeParameters', () => {
    it('should normalize visual parameters with default options', () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['  PHOTO  ', 'realistic', ''],
          colors: ['RED', 'blue', 'CRIMSON'],
          mood: '  Peaceful  ',
          composition: 'Rule of Thirds',
          themes: ['nature', 'LANDSCAPE', '']
        },
        confidence: 1.5, // Invalid - should be clamped
        ambiguities: ['field1', '', 'field2']
      };

      const normalized = normalizer.normalizeParameters(parameters);

      expect(normalized.visual!.style).toEqual(['photorealistic']);
      expect(normalized.visual!.colors).toEqual(['red', 'blue']);
      expect(normalized.visual!.mood).toBe('peaceful');
      expect(normalized.visual!.composition).toBe('rule of thirds');
      expect(normalized.visual!.themes).toEqual(['nature', 'landscape']);
      expect(normalized.confidence).toBe(1); // Clamped to max
      expect(normalized.ambiguities).toEqual(['field1', 'field2']);
    });

    it('should normalize audio parameters with standardization', () => {
      const parameters: ParsedParameters = {
        audio: {
          genre: ['rock and roll', 'EDM', 'hiphop'],
          instruments: ['guitars', 'pianos', 'drums'],
          tempo: 250, // Invalid - should be clamped
          mood: '  ENERGETIC  ',
          structure: 'Verse-Chorus'
        },
        confidence: 0.7,
        ambiguities: []
      };

      const normalized = normalizer.normalizeParameters(parameters);

      expect(normalized.audio!.genre).toEqual(['rock', 'electronic', 'hip-hop']);
      expect(normalized.audio!.instruments).toEqual(['guitar', 'piano', 'drums']);
      expect(normalized.audio!.tempo).toBe(200); // Clamped to max
      expect(normalized.audio!.mood).toBe('energetic');
      expect(normalized.audio!.structure).toBe('verse-chorus');
    });

    it('should remove invalid entries when option is enabled', () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['valid', '', null as any, 123 as any, 'another'],
          colors: ['red', '', undefined as any],
          mood: 'calm',
          composition: '',
          themes: ['nature', '', 'landscape']
        },
        confidence: 0.6,
        ambiguities: []
      };

      const normalized = normalizer.normalizeParameters(parameters, {
        removeInvalidEntries: true,
        sanitizeInput: true,
        standardizeTerms: false,
        applyDefaults: false
      });

      expect(normalized.visual!.style).toEqual(['valid', 'another']);
      expect(normalized.visual!.colors).toEqual(['red']);
      expect(normalized.visual!.themes).toEqual(['nature', 'landscape']);
    });

    it('should apply defaults when option is enabled', () => {
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

      const normalized = normalizer.normalizeParameters(parameters, {
        applyDefaults: true,
        sanitizeInput: false,
        standardizeTerms: false,
        removeInvalidEntries: false
      });

      // Should have all default fields
      expect(normalized.visual).toHaveProperty('style');
      expect(normalized.visual).toHaveProperty('colors');
      expect(normalized.visual).toHaveProperty('mood');
      expect(normalized.visual).toHaveProperty('composition');
      expect(normalized.visual).toHaveProperty('themes');
    });

    it('should handle empty or null parameters gracefully', () => {
      const parameters: ParsedParameters = {
        confidence: 0.5,
        ambiguities: []
      };

      const normalized = normalizer.normalizeParameters(parameters);

      expect(normalized.visual).toBeUndefined();
      expect(normalized.audio).toBeUndefined();
      expect(normalized.confidence).toBe(0.5);
      expect(normalized.ambiguities).toEqual([]);
    });

    it('should limit array sizes to prevent excessive parameters', () => {
      const parameters: ParsedParameters = {
        visual: {
          style: Array(15).fill('style'), // More than limit
          colors: Array(12).fill('color'), // More than limit
          mood: 'calm',
          composition: '',
          themes: Array(20).fill('theme') // More than limit
        },
        confidence: 0.6,
        ambiguities: []
      };

      const normalized = normalizer.normalizeParameters(parameters);

      expect(normalized.visual!.style.length).toBeLessThanOrEqual(10);
      expect(normalized.visual!.colors.length).toBeLessThanOrEqual(10);
      expect(normalized.visual!.themes.length).toBeLessThanOrEqual(10);
    });

    it('should remove duplicates from arrays', () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['photorealistic', 'realistic', 'photo'], // Should standardize to same
          colors: ['red', 'crimson', 'red'], // Duplicates
          mood: 'calm',
          composition: '',
          themes: ['nature', 'nature', 'landscape']
        },
        confidence: 0.6,
        ambiguities: []
      };

      const normalized = normalizer.normalizeParameters(parameters);

      expect(normalized.visual!.style).toEqual(['photorealistic']);
      expect(normalized.visual!.colors).toEqual(['red']);
      expect(normalized.visual!.themes).toEqual(['nature', 'landscape']);
    });
  });

  describe('applySmartDefaults', () => {
    it('should suggest styles based on themes', () => {
      const parameters: ParsedParameters = {
        visual: {
          style: [],
          colors: [],
          mood: '',
          composition: '',
          themes: ['nature', 'landscape']
        },
        confidence: 0.6,
        ambiguities: []
      };

      const result = normalizer.applySmartDefaults(parameters);

      expect(result.visual!.style.length).toBeGreaterThan(0);
      expect(result.visual!.style).toContain('photorealistic');
    });

    it('should suggest colors based on mood', () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['photorealistic'],
          colors: [],
          mood: 'peaceful',
          composition: '',
          themes: []
        },
        confidence: 0.6,
        ambiguities: []
      };

      const result = normalizer.applySmartDefaults(parameters);

      expect(result.visual!.colors.length).toBeGreaterThan(0);
    });

    it('should suggest instruments based on genre', () => {
      const parameters: ParsedParameters = {
        audio: {
          genre: ['rock'],
          instruments: [],
          tempo: 120,
          mood: '',
          structure: ''
        },
        confidence: 0.6,
        ambiguities: []
      };

      const result = normalizer.applySmartDefaults(parameters);

      expect(result.audio!.instruments.length).toBeGreaterThan(0);
      expect(result.audio!.instruments).toContain('guitar');
    });

    it('should suggest structure based on genre', () => {
      const parameters: ParsedParameters = {
        audio: {
          genre: ['rock'],
          instruments: ['guitar'],
          tempo: 120,
          mood: '',
          structure: ''
        },
        confidence: 0.6,
        ambiguities: []
      };

      const result = normalizer.applySmartDefaults(parameters);

      expect(result.audio!.structure).toBeTruthy();
      expect(result.audio!.structure).toContain('verse-chorus');
    });

    it('should handle unknown themes and genres gracefully', () => {
      const parameters: ParsedParameters = {
        visual: {
          style: [],
          colors: [],
          mood: 'unknown_mood',
          composition: '',
          themes: ['unknown_theme']
        },
        audio: {
          genre: ['unknown_genre'],
          instruments: [],
          tempo: 120,
          mood: '',
          structure: ''
        },
        confidence: 0.6,
        ambiguities: []
      };

      const result = normalizer.applySmartDefaults(parameters);

      // Should provide fallback defaults
      expect(result.visual!.style).toEqual(['photorealistic']);
      expect(result.visual!.colors).toEqual(['natural colors']);
      expect(result.audio!.instruments).toEqual(['piano']);
      expect(result.audio!.structure).toBe('verse-chorus');
    });
  });

  describe('validateNormalizedParameters', () => {
    it('should validate correct normalized parameters', () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['photorealistic'],
          colors: ['blue'],
          mood: 'calm',
          composition: 'rule of thirds',
          themes: ['nature']
        },
        confidence: 0.7,
        ambiguities: []
      };

      const isValid = normalizer.validateNormalizedParameters(parameters);
      expect(isValid).toBe(true);
    });

    it('should reject parameters with no visual or audio', () => {
      const parameters: ParsedParameters = {
        confidence: 0.7,
        ambiguities: []
      };

      const isValid = normalizer.validateNormalizedParameters(parameters);
      expect(isValid).toBe(false);
    });

    it('should reject parameters with invalid types', () => {
      const parameters: ParsedParameters = {
        visual: {
          style: 'not an array' as any,
          colors: ['blue'],
          mood: 'calm',
          composition: '',
          themes: []
        },
        confidence: 0.7,
        ambiguities: []
      };

      const isValid = normalizer.validateNormalizedParameters(parameters);
      expect(isValid).toBe(false);
    });

    it('should reject parameters with invalid tempo', () => {
      const parameters: ParsedParameters = {
        audio: {
          genre: ['rock'],
          instruments: ['guitar'],
          tempo: 300, // Invalid
          mood: 'energetic',
          structure: 'verse-chorus'
        },
        confidence: 0.7,
        ambiguities: []
      };

      const isValid = normalizer.validateNormalizedParameters(parameters);
      expect(isValid).toBe(false);
    });

    it('should reject parameters with invalid confidence', () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['photorealistic'],
          colors: ['blue'],
          mood: 'calm',
          composition: '',
          themes: []
        },
        confidence: 1.5, // Invalid
        ambiguities: []
      };

      const isValid = normalizer.validateNormalizedParameters(parameters);
      expect(isValid).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle malformed input gracefully', () => {
      const parameters: ParsedParameters = {
        visual: {
          style: [null, undefined, '', '   ', 'valid'] as any,
          colors: [123, true, 'blue'] as any,
          mood: null as any,
          composition: undefined as any,
          themes: ['theme1', '', null] as any
        },
        confidence: 'invalid' as any,
        ambiguities: [null, '', 'valid'] as any
      };

      const normalized = normalizer.normalizeParameters(parameters, {
        removeInvalidEntries: true,
        sanitizeInput: true,
        standardizeTerms: true,
        applyDefaults: true
      });

      expect(normalized.visual!.style).toEqual(['valid']);
      expect(normalized.visual!.colors).toEqual(['blue']);
      expect(normalized.visual!.mood).toBe('');
      expect(normalized.visual!.composition).toBe('');
      expect(normalized.visual!.themes).toEqual(['theme1']);
      expect(normalized.confidence).toBe(0); // Default for invalid
      expect(normalized.ambiguities).toEqual(['valid']);
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000);
      const parameters: ParsedParameters = {
        visual: {
          style: [longString],
          colors: [longString],
          mood: longString,
          composition: longString,
          themes: [longString]
        },
        confidence: 0.6,
        ambiguities: []
      };

      const normalized = normalizer.normalizeParameters(parameters);

      // Should handle long strings without crashing
      expect(normalized.visual!.style).toBeDefined();
      expect(normalized.visual!.colors).toBeDefined();
      expect(normalized.visual!.mood).toBeDefined();
    });
  });
});