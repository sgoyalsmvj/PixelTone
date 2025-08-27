import { ParameterExtractor } from '../services/parameterExtractor';

describe('ParameterExtractor', () => {
  let extractor: ParameterExtractor;

  beforeEach(() => {
    extractor = new ParameterExtractor();
  });

  describe('extractVisualParameters', () => {
    it('should extract visual styles correctly', () => {
      const input = 'Create a realistic oil painting with abstract elements';
      const params = extractor.extractVisualParameters(input);
      
      expect(params.style).toContain('realistic');
      expect(params.style).toContain('oil painting');
      expect(params.style).toContain('abstract');
    });

    it('should extract colors correctly', () => {
      const input = 'Paint with bright red, deep blue, and golden yellow colors';
      const params = extractor.extractVisualParameters(input);
      
      expect(params.colors).toContain('red');
      expect(params.colors).toContain('blue');
      expect(params.colors).toContain('yellow');
    });

    it('should extract hex colors', () => {
      const input = 'Use colors #FF0000 and #00FF00 in the design';
      const params = extractor.extractVisualParameters(input);
      
      // Colors are normalized to lowercase
      expect(params.colors).toContain('#ff0000');
      expect(params.colors).toContain('#00ff00');
    });

    it('should extract mood correctly', () => {
      const input = 'Create a peaceful and serene landscape painting';
      const params = extractor.extractVisualParameters(input);
      
      expect(params.mood).toBe('peaceful');
    });

    it('should extract composition information', () => {
      const input = 'Create a centered portrait with rule of thirds composition';
      const params = extractor.extractVisualParameters(input);
      
      expect(params.composition).toBe('centered');
    });

    it('should extract themes', () => {
      const input = 'Paint a nature scene with fantasy elements and magical creatures';
      const params = extractor.extractVisualParameters(input);
      
      expect(params.themes).toContain('nature');
      expect(params.themes).toContain('fantasy');
    });

    it('should handle empty input', () => {
      const params = extractor.extractVisualParameters('');
      
      expect(params.style).toEqual([]);
      expect(params.colors).toEqual([]);
      expect(params.mood).toBe('');
      expect(params.composition).toBe('');
      expect(params.themes).toEqual([]);
    });
  });

  describe('extractAudioParameters', () => {
    it('should extract genres correctly', () => {
      const input = 'Compose a jazz and blues fusion with rock elements';
      const params = extractor.extractAudioParameters(input);
      
      expect(params.genre).toContain('jazz');
      expect(params.genre).toContain('blues');
      expect(params.genre).toContain('rock');
    });

    it('should extract instruments correctly', () => {
      const input = 'Create music with piano, guitar, and drums';
      const params = extractor.extractAudioParameters(input);
      
      expect(params.instruments).toContain('piano');
      expect(params.instruments).toContain('guitar');
      expect(params.instruments).toContain('drums');
    });

    it('should extract tempo from BPM notation', () => {
      const input = 'Create a song at 140 BPM';
      const params = extractor.extractAudioParameters(input);
      
      expect(params.tempo).toBe(140);
    });

    it('should extract tempo from descriptive words', () => {
      const testCases = [
        { input: 'Create a slow ballad', expectedTempo: 70 },
        { input: 'Make fast upbeat music', expectedTempo: 140 },
        { input: 'Compose moderate tempo music', expectedTempo: 120 }
      ];

      testCases.forEach(({ input, expectedTempo }) => {
        const params = extractor.extractAudioParameters(input);
        expect(params.tempo).toBe(expectedTempo);
      });
    });

    it('should extract mood for audio', () => {
      const input = 'Create energetic and uplifting music';
      const params = extractor.extractAudioParameters(input);
      
      // The first matching mood keyword is returned
      expect(['energetic', 'joyful']).toContain(params.mood);
    });

    it('should extract structure information', () => {
      const input = 'Compose with verse-chorus-bridge structure';
      const params = extractor.extractAudioParameters(input);
      
      expect(params.structure).toBe('verse-chorus-bridge');
    });

    it('should use default values appropriately', () => {
      const input = 'Create some music';
      const params = extractor.extractAudioParameters(input);
      
      expect(params.tempo).toBe(120); // Default tempo
      expect(params.structure).toBe('verse-chorus'); // Default structure
    });

    it('should handle empty input', () => {
      const params = extractor.extractAudioParameters('');
      
      expect(params.genre).toEqual([]);
      expect(params.instruments).toEqual([]);
      expect(params.tempo).toBe(120);
      expect(params.mood).toBe('');
      expect(params.structure).toBe('verse-chorus');
    });
  });

  describe('complex scenarios', () => {
    it('should handle mixed visual and audio descriptions', () => {
      const input = 'Create a vibrant red and blue abstract painting with upbeat jazz music featuring piano and saxophone at 130 BPM';
      
      const visualParams = extractor.extractVisualParameters(input);
      const audioParams = extractor.extractAudioParameters(input);
      
      // Visual parameters
      expect(visualParams.colors).toContain('red');
      expect(visualParams.colors).toContain('blue');
      expect(visualParams.style).toContain('abstract');
      
      // Audio parameters
      expect(audioParams.genre).toContain('jazz');
      expect(audioParams.instruments).toContain('piano');
      expect(audioParams.instruments).toContain('saxophone');
      expect(audioParams.tempo).toBe(130);
    });

    it('should handle synonyms and variations', () => {
      const input = 'Paint a photorealistic portrait with crimson and azure colors';
      const params = extractor.extractVisualParameters(input);
      
      expect(params.style).toContain('realistic');
      expect(params.colors).toContain('red');
      expect(params.colors).toContain('blue');
    });

    it('should limit themes to reasonable number', () => {
      const input = 'Create art with nature forest trees mountains ocean sky clouds animals birds flowers plants grass rocks stones';
      const params = extractor.extractVisualParameters(input);
      
      expect(params.themes.length).toBeLessThanOrEqual(5);
    });

    it('should handle case insensitive extraction', () => {
      const input = 'CREATE A REALISTIC PAINTING WITH RED COLORS';
      const params = extractor.extractVisualParameters(input);
      
      expect(params.style).toContain('realistic');
      expect(params.colors).toContain('red');
    });

    it('should remove duplicate values', () => {
      const input = 'Create red and crimson and red colored painting';
      const params = extractor.extractVisualParameters(input);
      
      // Should not have duplicate red entries
      const redCount = params.colors.filter(color => color === 'red').length;
      expect(redCount).toBeLessThanOrEqual(1);
    });
  });

  describe('edge cases', () => {
    it('should handle very long input', () => {
      const longInput = 'Create a painting with red colors '.repeat(50);
      const params = extractor.extractVisualParameters(longInput);
      
      expect(params.colors).toContain('red');
    });

    it('should handle input with special characters', () => {
      const input = 'Create a @#$% painting with red!!! colors';
      const params = extractor.extractVisualParameters(input);
      
      expect(params.colors).toContain('red');
    });

    it('should validate tempo ranges', () => {
      const input = 'Create music at 300 BPM'; // Invalid tempo
      const params = extractor.extractAudioParameters(input);
      
      expect(params.tempo).toBe(120); // Should fall back to default
    });

    it('should handle RGB color notation', () => {
      const input = 'Use rgb(255, 0, 0) and rgba(0, 255, 0, 0.5) colors';
      const params = extractor.extractVisualParameters(input);
      
      expect(params.colors.some(color => color.includes('rgb'))).toBe(true);
    });
  });
});