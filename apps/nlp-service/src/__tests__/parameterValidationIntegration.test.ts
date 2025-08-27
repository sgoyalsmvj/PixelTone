import { NLPService } from '../services/nlpService';
import { ParsedParameters } from '@ai-studio/shared-types';

describe('Parameter Validation and Suggestion Integration', () => {
  let nlpService: NLPService;

  beforeEach(() => {
    nlpService = new NLPService();
  });

  describe('Complete validation workflow', () => {
    it('should validate, normalize, and suggest improvements for visual parameters', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['artistic', 'beautiful'], // Generic terms
          colors: ['dark', 'bright'], // Ambiguous terms
          mood: '',
          composition: '',
          themes: []
        },
        confidence: 0.4,
        ambiguities: []
      };

      // Test validation
      const validation = await nlpService.validateParameters(parameters);
      expect(validation.isValid).toBe(true);
      expect(validation.warnings.length).toBeGreaterThan(0);

      // Test normalization
      const normalized = await nlpService.normalizeParameters(parameters);
      expect(normalized.visual!.style).toEqual(['artistic', 'beautiful']); // Should be normalized
      expect(normalized.visual!.colors).toEqual(['dark', 'bright']);

      // Test suggestions
      const suggestions = await nlpService.suggestImprovements(normalized);
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.includes('specific'))).toBe(true);

      // Test completeness check
      const isComplete = await nlpService.isCompleteForGeneration(normalized);
      expect(isComplete).toBe(true); // Should be complete despite warnings

      // Test severity
      const severity = await nlpService.getValidationSeverity(normalized);
      expect(['warning', 'info']).toContain(severity);
    });

    it('should handle audio parameters with validation and suggestions', async () => {
      const parameters: ParsedParameters = {
        audio: {
          genre: [],
          instruments: [],
          tempo: 250, // Invalid tempo
          mood: '',
          structure: ''
        },
        confidence: 0.6,
        ambiguities: []
      };

      // Test validation - should catch invalid tempo
      const validation = await nlpService.validateParameters(parameters);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(e => e.code === 'INVALID_TEMPO_RANGE')).toBe(true);

      // Test normalization - should fix tempo
      const normalized = await nlpService.normalizeParameters(parameters);
      expect(normalized.audio!.tempo).toBe(200); // Should be clamped

      // Test validation after normalization
      const validationAfterNorm = await nlpService.validateParameters(normalized);
      expect(validationAfterNorm.isValid).toBe(true);

      // Test suggestions for empty fields
      const suggestions = await nlpService.suggestImprovements(normalized);
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.includes('genre'))).toBe(true);

      // Test completeness - should be incomplete due to empty fields
      const isComplete = await nlpService.isCompleteForGeneration(normalized);
      expect(isComplete).toBe(false);
    });

    it('should handle mixed parameters with cross-modal suggestions', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['photorealistic'],
          colors: ['warm colors'],
          mood: 'peaceful',
          composition: 'rule of thirds',
          themes: ['nature']
        },
        confidence: 0.8,
        ambiguities: []
      };

      // Test validation - should be valid
      const validation = await nlpService.validateParameters(parameters);
      expect(validation.isValid).toBe(true);
      expect(validation.warnings.length).toBe(0);

      // Test suggestions - might suggest adding audio
      const suggestions = await nlpService.suggestImprovements(parameters);
      // Note: Cross-modal suggestions require original text context

      // Test completeness
      const isComplete = await nlpService.isCompleteForGeneration(parameters);
      expect(isComplete).toBe(true);

      // Test severity - should be success
      const severity = await nlpService.getValidationSeverity(parameters);
      expect(severity).toBe('success');
    });

    it('should handle empty parameters with appropriate error handling', async () => {
      const parameters: ParsedParameters = {
        confidence: 0.1,
        ambiguities: []
      };

      // Test validation - should fail
      const validation = await nlpService.validateParameters(parameters);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(e => e.code === 'NO_PARAMETERS')).toBe(true);

      // Test completeness
      const isComplete = await nlpService.isCompleteForGeneration(parameters);
      expect(isComplete).toBe(false);

      // Test severity
      const severity = await nlpService.getValidationSeverity(parameters);
      expect(severity).toBe('error');
    });

    it('should provide contextual suggestions based on parameter content', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['photorealistic'],
          colors: [],
          mood: 'peaceful',
          composition: '',
          themes: ['nature']
        },
        confidence: 0.6,
        ambiguities: []
      };

      // Apply smart defaults
      const normalized = await nlpService.normalizeParameters(parameters);
      
      // Should have applied smart defaults based on mood and themes
      expect(normalized.visual!.colors.length).toBeGreaterThan(0); // Should have colors from mood mapping
      expect(normalized.visual!.colors).toContain('soft blue'); // Expected color for peaceful mood

      // Test suggestions
      const suggestions = await nlpService.suggestImprovements(normalized);
      expect(suggestions.length).toBeGreaterThan(0);
    });

    it('should handle malformed data gracefully', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: null as any,
          colors: 'not an array' as any,
          mood: 123 as any,
          composition: undefined as any,
          themes: [null, '', 'valid'] as any
        },
        confidence: 'invalid' as any,
        ambiguities: null as any
      };

      // Test validation - should catch type errors
      const validation = await nlpService.validateParameters(parameters);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);

      // Test normalization - should fix what it can
      const normalized = await nlpService.normalizeParameters(parameters);
      expect(normalized.visual!.style).toEqual(['photorealistic']); // Smart defaults applied
      expect(normalized.visual!.colors).toEqual([]);
      expect(normalized.visual!.themes).toEqual(['valid']);
      expect(normalized.confidence).toBe(0);
      expect(normalized.ambiguities).toEqual([]);

      // Test validation after normalization
      const validationAfterNorm = await nlpService.validateParameters(normalized);
      expect(validationAfterNorm.isValid).toBe(true); // Should be valid after normalization
    });
  });

  describe('Performance and edge cases', () => {
    it('should handle large parameter sets efficiently', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: Array(50).fill('photorealistic'),
          colors: Array(50).fill('blue'),
          mood: 'calm',
          composition: 'rule of thirds',
          themes: Array(50).fill('nature')
        },
        audio: {
          genre: Array(50).fill('rock'),
          instruments: Array(50).fill('guitar'),
          tempo: 120,
          mood: 'energetic',
          structure: 'verse-chorus'
        },
        confidence: 0.7,
        ambiguities: Array(50).fill('field')
      };

      const startTime = Date.now();
      
      const validation = await nlpService.validateParameters(parameters);
      const normalized = await nlpService.normalizeParameters(parameters);
      const suggestions = await nlpService.suggestImprovements(normalized);
      
      const endTime = Date.now();
      const processingTime = endTime - startTime;

      // Should complete within reasonable time (less than 1 second)
      expect(processingTime).toBeLessThan(1000);
      
      // Should limit array sizes
      expect(normalized.visual!.style.length).toBeLessThanOrEqual(10);
      expect(normalized.visual!.colors.length).toBeLessThanOrEqual(10);
      expect(normalized.ambiguities.length).toBeLessThanOrEqual(10);
      
      // Should still provide valid results
      expect(validation.isValid).toBe(true);
      expect(suggestions.length).toBeGreaterThan(0);
    });

    it('should handle unicode and special characters', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['フォトリアリスティック', 'réaliste', 'художественный'],
          colors: ['赤', 'bleu', 'красный'],
          mood: 'спокойный',
          composition: 'règle des tiers',
          themes: ['自然', 'naturaleza']
        },
        confidence: 0.6,
        ambiguities: []
      };

      const validation = await nlpService.validateParameters(parameters);
      const normalized = await nlpService.normalizeParameters(parameters);
      
      expect(validation.isValid).toBe(true);
      expect(normalized.visual!.style.length).toBeGreaterThan(0);
      expect(normalized.visual!.colors.length).toBeGreaterThan(0);
    });

    it('should maintain consistency across multiple calls', async () => {
      const parameters: ParsedParameters = {
        visual: {
          style: ['photorealistic'],
          colors: ['blue'],
          mood: 'calm',
          composition: '',
          themes: ['nature']
        },
        confidence: 0.7,
        ambiguities: []
      };

      // Run multiple times and ensure consistent results
      const results = await Promise.all([
        nlpService.validateParameters(parameters),
        nlpService.validateParameters(parameters),
        nlpService.validateParameters(parameters)
      ]);

      // All results should be identical
      expect(results[0].isValid).toBe(results[1].isValid);
      expect(results[0].isValid).toBe(results[2].isValid);
      expect(results[0].errors.length).toBe(results[1].errors.length);
      expect(results[0].warnings.length).toBe(results[1].warnings.length);
    });
  });
});