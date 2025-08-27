import { ParameterValidator } from '../services/parameterValidator';
import { ParsedParameters, VisualParameters, AudioParameters } from '@ai-studio/shared-types';

describe('ParameterValidator', () => {
  let validator: ParameterValidator;

  beforeEach(() => {
    validator = new ParameterValidator();
  });

  describe('validateParameters', () => {
    it('should validate complete visual parameters successfully', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['photorealistic', 'portrait'],
          colors: ['warm colors', 'golden hour'],
          mood: 'peaceful',
          composition: 'rule of thirds',
          themes: ['nature', 'sunset']
        },
        confidence: 0.8,
        ambiguities: []
      };

      const result = await validator.validateParameters(parameters);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it('should validate complete audio parameters successfully', async () => {
      const parameters: ParsedParameters = {
        audio: {
          genre: ['jazz', 'smooth'],
          instruments: ['piano', 'saxophone'],
          tempo: 90,
          mood: 'relaxing',
          structure: 'AABA'
        },
        confidence: 0.7,
        ambiguities: []
      };

      const result = await validator.validateParameters(parameters);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it('should return error when no parameters are provided', async () => {
      const parameters: ParsedParameters = {
        confidence: 0.5,
        ambiguities: []
      };

      const result = await validator.validateParameters(parameters);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('NO_PARAMETERS');
    });

    it('should return error for invalid tempo range', async () => {
      const parameters: ParsedParameters = {
        audio: {
          genre: ['rock'],
          instruments: ['guitar'],
          tempo: 250, // Invalid - too high
          mood: 'energetic',
          structure: 'verse-chorus'
        },
        confidence: 0.6,
        ambiguities: []
      };

      const result = await validator.validateParameters(parameters);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('INVALID_TEMPO_RANGE');
    });

    it('should return error for invalid confidence range', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['abstract'],
          colors: ['blue'],
          mood: 'calm',
          composition: '',
          themes: []
        },
        confidence: 1.5, // Invalid - too high
        ambiguities: []
      };

      const result = await validator.validateParameters(parameters);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe('INVALID_CONFIDENCE');
    });

    it('should return warnings for missing visual elements', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: [], // Empty - should warn
          colors: [], // Empty - should warn
          mood: '', // Empty - should warn
          composition: '',
          themes: [] // Empty - should warn
        },
        confidence: 0.5,
        ambiguities: []
      };

      const result = await validator.validateParameters(parameters);

      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.field === 'visual.style')).toBe(true);
      expect(result.warnings.some(w => w.field === 'visual.colors')).toBe(true);
      expect(result.warnings.some(w => w.field === 'visual.mood')).toBe(true);
    });

    it('should return warnings for missing audio elements', async () => {
      const parameters: ParsedParameters = {
        audio: {
          genre: [], // Empty - should warn
          instruments: [], // Empty - should warn
          tempo: 120, // Default - should warn
          mood: '', // Empty - should warn
          structure: '' // Empty - should warn
        },
        confidence: 0.5,
        ambiguities: []
      };

      const result = await validator.validateParameters(parameters);

      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.field === 'audio.genre')).toBe(true);
      expect(result.warnings.some(w => w.field === 'audio.instruments')).toBe(true);
      expect(result.warnings.some(w => w.field === 'audio.tempo')).toBe(true);
    });

    it('should warn about low confidence', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['abstract'],
          colors: ['blue'],
          mood: 'calm',
          composition: '',
          themes: []
        },
        confidence: 0.2, // Low confidence
        ambiguities: []
      };

      const result = await validator.validateParameters(parameters);

      expect(result.isValid).toBe(true);
      expect(result.warnings.some(w => w.field === 'confidence')).toBe(true);
    });

    it('should warn about generic style terms', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['artistic', 'beautiful'], // Generic terms
          colors: ['nice colors'], // Generic term
          mood: 'good',
          composition: '',
          themes: []
        },
        confidence: 0.6,
        ambiguities: []
      };

      const result = await validator.validateParameters(parameters);

      expect(result.isValid).toBe(true);
      expect(result.warnings.some(w => w.field === 'visual.style')).toBe(true);
    });

    it('should warn about ambiguous color terms', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['photorealistic'],
          colors: ['dark', 'bright', 'colorful'], // Ambiguous terms
          mood: 'neutral',
          composition: '',
          themes: []
        },
        confidence: 0.6,
        ambiguities: []
      };

      const result = await validator.validateParameters(parameters);

      expect(result.isValid).toBe(true);
      expect(result.warnings.some(w => w.field === 'visual.colors')).toBe(true);
    });

    it('should handle invalid data types gracefully', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: 'not an array' as any, // Invalid type
          colors: ['blue'],
          mood: 123 as any, // Invalid type
          composition: '',
          themes: []
        },
        confidence: 0.6,
        ambiguities: []
      };

      const result = await validator.validateParameters(parameters);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_STYLE_TYPE')).toBe(true);
      expect(result.errors.some(e => e.code === 'INVALID_MOOD_TYPE')).toBe(true);
    });
  });

  describe('isCompleteForGeneration', () => {
    it('should return true for complete visual parameters', () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['photorealistic'],
          colors: ['blue'],
          mood: 'calm',
          composition: '',
          themes: []
        },
        confidence: 0.5,
        ambiguities: []
      };

      const result = validator.isCompleteForGeneration(parameters);
      expect(result).toBe(true);
    });

    it('should return true for complete audio parameters', () => {
      const parameters: ParsedParameters = {
        audio: {
          genre: ['jazz'],
          instruments: ['piano'],
          tempo: 90,
          mood: 'relaxing',
          structure: ''
        },
        confidence: 0.5,
        ambiguities: []
      };

      const result = validator.isCompleteForGeneration(parameters);
      expect(result).toBe(true);
    });

    it('should return false for empty parameters', () => {
      const parameters: ParsedParameters = {
        confidence: 0.5,
        ambiguities: []
      };

      const result = validator.isCompleteForGeneration(parameters);
      expect(result).toBe(false);
    });

    it('should return false for incomplete visual parameters', () => {
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

      const result = validator.isCompleteForGeneration(parameters);
      expect(result).toBe(false);
    });

    it('should return false for very low confidence', () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['abstract'],
          colors: ['blue'],
          mood: 'calm',
          composition: '',
          themes: []
        },
        confidence: 0.1, // Too low
        ambiguities: []
      };

      const result = validator.isCompleteForGeneration(parameters);
      expect(result).toBe(false);
    });
  });

  describe('getValidationSeverity', () => {
    it('should return error for no parameters', () => {
      const parameters: ParsedParameters = {
        confidence: 0.5,
        ambiguities: []
      };

      const result = validator.getValidationSeverity(parameters);
      expect(result).toBe('error');
    });

    it('should return warning for low confidence', () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['abstract'],
          colors: ['blue'],
          mood: 'calm',
          composition: '',
          themes: []
        },
        confidence: 0.2, // Low confidence
        ambiguities: []
      };

      const result = validator.getValidationSeverity(parameters);
      expect(result).toBe('warning');
    });

    it('should return warning for many ambiguities', () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['abstract'],
          colors: ['blue'],
          mood: 'calm',
          composition: '',
          themes: []
        },
        confidence: 0.6,
        ambiguities: ['field1', 'field2', 'field3'] // Many ambiguities
      };

      const result = validator.getValidationSeverity(parameters);
      expect(result).toBe('warning');
    });

    it('should return success for high confidence and no ambiguities', () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['photorealistic'],
          colors: ['warm colors'],
          mood: 'peaceful',
          composition: 'rule of thirds',
          themes: ['nature']
        },
        confidence: 0.8, // High confidence
        ambiguities: [] // No ambiguities
      };

      const result = validator.getValidationSeverity(parameters);
      expect(result).toBe('success');
    });

    it('should return info for moderate parameters', () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['abstract'],
          colors: ['blue'],
          mood: 'calm',
          composition: '',
          themes: []
        },
        confidence: 0.5,
        ambiguities: ['visual.style']
      };

      const result = validator.getValidationSeverity(parameters);
      expect(result).toBe('info');
    });
  });
});