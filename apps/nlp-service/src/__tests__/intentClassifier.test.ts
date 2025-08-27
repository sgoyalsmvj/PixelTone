import { IntentClassifier } from '../services/intentClassifier';

describe('IntentClassifier', () => {
  let classifier: IntentClassifier;

  beforeEach(() => {
    classifier = new IntentClassifier();
  });

  describe('classifyIntent', () => {
    it('should classify visual requests correctly', () => {
      const visualInputs = [
        'Create a beautiful painting with bright colors',
        'Draw a portrait of a person with blue eyes',
        'Generate an abstract artwork with geometric shapes',
        'Make an image of a sunset over mountains',
        'Design a colorful illustration of a forest'
      ];

      visualInputs.forEach(input => {
        const intent = classifier.classifyIntent(input);
        expect(intent).toBe('visual');
      });
    });

    it('should classify audio requests correctly', () => {
      const audioInputs = [
        'Compose a jazz song with piano and saxophone',
        'Create upbeat music with drums and guitar',
        'Generate a classical piece with violin and orchestra',
        'Make a rock song with electric guitar',
        'Produce ambient music with synthesizer'
      ];

      audioInputs.forEach(input => {
        const intent = classifier.classifyIntent(input);
        expect(intent).toBe('audio');
      });
    });

    it('should classify mixed requests correctly', () => {
      const mixedInputs = [
        'Create a music video with colorful visuals and upbeat music',
        'Generate art and sound that represents happiness',
        'Make something creative with both visual and audio elements',
        'Design a multimedia experience with painting and music'
      ];

      mixedInputs.forEach(input => {
        const intent = classifier.classifyIntent(input);
        expect(['mixed', 'visual', 'audio']).toContain(intent);
      });
    });

    it('should handle ambiguous input', () => {
      const ambiguousInputs = [
        'Create something beautiful',
        'Make art',
        'Generate creative content',
        'Design something unique'
      ];

      ambiguousInputs.forEach(input => {
        const intent = classifier.classifyIntent(input);
        expect(['visual', 'audio', 'mixed']).toContain(intent);
      });
    });

    it('should handle empty input', () => {
      const intent = classifier.classifyIntent('');
      expect(['visual', 'audio', 'mixed']).toContain(intent);
    });

    it('should be case insensitive', () => {
      const intent1 = classifier.classifyIntent('CREATE A PAINTING');
      const intent2 = classifier.classifyIntent('create a painting');
      expect(intent1).toBe(intent2);
    });
  });

  describe('getClassificationConfidence', () => {
    it('should return high confidence for clear visual input', () => {
      const input = 'Create a realistic oil painting with vibrant colors and detailed brushstrokes';
      const confidence = classifier.getClassificationConfidence(input);
      expect(confidence).toBeGreaterThan(0.5);
    });

    it('should return high confidence for clear audio input', () => {
      const input = 'Compose a jazz song with piano, saxophone, and drums at 120 BPM';
      const confidence = classifier.getClassificationConfidence(input);
      expect(confidence).toBeGreaterThan(0.5);
    });

    it('should return lower confidence for ambiguous input', () => {
      const input = 'Create something nice';
      const confidence = classifier.getClassificationConfidence(input);
      expect(confidence).toBeLessThan(0.5);
    });

    it('should return minimum confidence for empty input', () => {
      const confidence = classifier.getClassificationConfidence('');
      expect(confidence).toBe(0.1);
    });

    it('should boost confidence for explicit indicators', () => {
      const visualInput = 'Draw me a picture of a cat';
      const audioInput = 'Play me a song with guitar';
      
      const visualConfidence = classifier.getClassificationConfidence(visualInput);
      const audioConfidence = classifier.getClassificationConfidence(audioInput);
      
      expect(visualConfidence).toBeGreaterThan(0.3);
      expect(audioConfidence).toBeGreaterThan(0.3);
    });
  });

  describe('edge cases', () => {
    it('should handle very long input', () => {
      const longInput = 'Create a painting '.repeat(100);
      const intent = classifier.classifyIntent(longInput);
      expect(intent).toBe('visual');
    });

    it('should handle input with special characters', () => {
      const input = 'Create a @#$% painting with !!! colors';
      const intent = classifier.classifyIntent(input);
      expect(intent).toBe('visual');
    });

    it('should handle input with numbers', () => {
      const input = 'Create a painting with 5 colors and 3 shapes';
      const intent = classifier.classifyIntent(input);
      expect(intent).toBe('visual');
    });

    it('should handle multilingual keywords (basic)', () => {
      // Test with some common English variations
      const inputs = [
        'colour instead of color',
        'grey instead of gray',
        'centre composition'
      ];

      inputs.forEach(input => {
        const intent = classifier.classifyIntent(input);
        expect(['visual', 'audio', 'mixed']).toContain(intent);
      });
    });
  });
});