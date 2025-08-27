import { TextProcessor } from '../services/textProcessor';

describe('TextProcessor', () => {
  let textProcessor: TextProcessor;

  beforeEach(() => {
    textProcessor = new TextProcessor();
  });

  describe('normalize', () => {
    it('should normalize basic text', () => {
      const input = '  Create a BEAUTIFUL painting with   bright colors!  ';
      const expected = 'create a beautiful painting with bright colors!';
      expect(textProcessor.normalize(input)).toBe(expected);
    });

    it('should remove special characters but keep basic punctuation', () => {
      const input = 'Create a @#$% painting with colors!!!';
      const expected = 'create a painting with colors!!!';
      expect(textProcessor.normalize(input)).toBe(expected);
    });

    it('should handle empty and whitespace-only strings', () => {
      expect(textProcessor.normalize('')).toBe('');
      expect(textProcessor.normalize('   ')).toBe('');
    });

    it('should normalize multiple spaces to single space', () => {
      const input = 'create    a     painting';
      const expected = 'create a painting';
      expect(textProcessor.normalize(input)).toBe(expected);
    });
  });

  describe('tokenize', () => {
    it('should tokenize simple text', () => {
      const input = 'Create a beautiful painting';
      const expected = ['create', 'a', 'beautiful', 'painting'];
      expect(textProcessor.tokenize(input)).toEqual(expected);
    });

    it('should handle punctuation correctly', () => {
      const input = 'Create a painting, with bright colors!';
      const tokens = textProcessor.tokenize(input);
      expect(tokens).toContain('create');
      expect(tokens).toContain('painting');
      expect(tokens).toContain('bright');
      expect(tokens).toContain('colors');
    });

    it('should return empty array for empty input', () => {
      expect(textProcessor.tokenize('')).toEqual([]);
    });
  });

  describe('extractKeyPhrases', () => {
    it('should extract nouns and adjectives', () => {
      const input = 'Create a beautiful red painting with vibrant colors';
      const phrases = textProcessor.extractKeyPhrases(input);
      
      expect(phrases.length).toBeGreaterThan(0);
      expect(phrases.some(phrase => phrase.includes('painting'))).toBe(true);
    });

    it('should filter out short phrases and stop words', () => {
      const input = 'The cat is on the mat';
      const phrases = textProcessor.extractKeyPhrases(input);
      
      expect(phrases).not.toContain('the');
      expect(phrases).not.toContain('is');
      expect(phrases).not.toContain('on');
    });

    it('should handle empty input', () => {
      const phrases = textProcessor.extractKeyPhrases('');
      expect(phrases).toEqual([]);
    });
  });

  describe('stemWords', () => {
    it('should stem words to their root form', () => {
      const words = ['painting', 'colors', 'beautiful', 'creating'];
      const stemmed = textProcessor.stemWords(words);
      
      expect(stemmed).toContain('paint');
      expect(stemmed).toContain('color');
      expect(stemmed).toContain('beauti');
      expect(stemmed).toContain('creat');
    });

    it('should handle empty array', () => {
      expect(textProcessor.stemWords([])).toEqual([]);
    });
  });

  describe('extractSentences', () => {
    it('should extract sentences from text', () => {
      const input = 'Create a painting. Make it colorful! Use bright colors.';
      const sentences = textProcessor.extractSentences(input);
      
      expect(sentences).toHaveLength(3);
      expect(sentences[0]).toContain('Create a painting');
      expect(sentences[1]).toContain('Make it colorful');
      expect(sentences[2]).toContain('Use bright colors');
    });

    it('should handle single sentence', () => {
      const input = 'Create a beautiful painting';
      const sentences = textProcessor.extractSentences(input);
      
      expect(sentences).toHaveLength(1);
      expect(sentences[0]).toBe(input);
    });

    it('should filter out empty sentences', () => {
      const input = 'Create a painting. . Make it colorful.';
      const sentences = textProcessor.extractSentences(input);
      
      expect(sentences.every(s => s.trim().length > 0)).toBe(true);
    });
  });

  describe('calculateSimilarity', () => {
    it('should return 1 for identical strings', () => {
      const text = 'create a painting';
      expect(textProcessor.calculateSimilarity(text, text)).toBe(1);
    });

    it('should return 0 for completely different strings', () => {
      const similarity = textProcessor.calculateSimilarity('painting', 'music');
      expect(similarity).toBeLessThan(0.5);
    });

    it('should return high similarity for similar strings', () => {
      const similarity = textProcessor.calculateSimilarity('painting', 'paint');
      expect(similarity).toBeGreaterThan(0.7);
    });
  });
});