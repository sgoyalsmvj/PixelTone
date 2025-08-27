import natural from 'natural';
import nlp from 'compromise';

/**
 * Text preprocessing and normalization service
 */
export class TextProcessor {
  private stemmer = natural.PorterStemmer;
  private tokenizer = new natural.WordTokenizer();

  /**
   * Normalize and clean input text
   */
  normalize(text: string): string {
    // Remove extra whitespace and normalize
    let normalized = text.trim().toLowerCase();
    
    // Remove special characters but keep basic punctuation
    normalized = normalized.replace(/[^\w\s.,!?-]/g, ' ');
    
    // Normalize multiple spaces to single space
    normalized = normalized.replace(/\s+/g, ' ');
    
    // Remove leading/trailing punctuation from words
    normalized = normalized.replace(/\b[.,!?-]+\b/g, '');
    
    return normalized.trim();
  }

  /**
   * Tokenize text into words
   */
  tokenize(text: string): string[] {
    const normalized = this.normalize(text);
    return this.tokenizer.tokenize(normalized) || [];
  }

  /**
   * Extract key phrases and entities from text
   */
  extractKeyPhrases(text: string): string[] {
    const doc = nlp(text);
    
    // Extract nouns, adjectives, and noun phrases
    const nouns = doc.nouns().out('array') as string[];
    const adjectives = doc.adjectives().out('array') as string[];
    const nounPhrases = doc.match('#Adjective+ #Noun+').out('array') as string[];
    
    // Combine and deduplicate
    const keyPhrases = [...new Set([...nouns, ...adjectives, ...nounPhrases])];
    
    // Filter out common stop words and short phrases
    return keyPhrases.filter(phrase => 
      phrase.length > 2 && 
      !this.isStopWord(phrase.toLowerCase())
    );
  }

  /**
   * Stem words to their root form
   */
  stemWords(words: string[]): string[] {
    return words.map(word => this.stemmer.stem(word));
  }

  /**
   * Check if a word is a common stop word
   */
  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
    ]);
    return stopWords.has(word);
  }

  /**
   * Extract sentences from text
   */
  extractSentences(text: string): string[] {
    const tokenizer = new natural.SentenceTokenizer();
    const sentences = tokenizer.tokenize(text);
    return sentences.filter(sentence => sentence.trim().length > 0);
  }

  /**
   * Calculate text similarity using Jaro-Winkler distance
   */
  calculateSimilarity(text1: string, text2: string): number {
    return natural.JaroWinklerDistance(text1, text2, {});
  }
}