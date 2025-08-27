/**
 * Intent classification service to distinguish visual vs audio requests
 */
export class IntentClassifier {
  private visualKeywords = new Set([
    // Visual styles and techniques
    'painting', 'drawing', 'sketch', 'illustration', 'artwork', 'image', 'picture',
    'photo', 'photograph', 'portrait', 'landscape', 'abstract', 'realistic',
    'cartoon', 'anime', 'digital art', 'oil painting', 'watercolor', 'pencil',
    
    // Visual elements
    'color', 'colors', 'bright', 'dark', 'light', 'shadow', 'contrast',
    'composition', 'perspective', 'depth', 'texture', 'pattern', 'shape',
    'line', 'curve', 'geometric', 'organic', 'symmetry', 'balance',
    
    // Visual moods and styles
    'vibrant', 'muted', 'pastel', 'neon', 'monochrome', 'colorful',
    'minimalist', 'detailed', 'complex', 'simple', 'elegant', 'bold',
    'subtle', 'dramatic', 'serene', 'chaotic', 'organized',
    
    // Visual subjects
    'person', 'people', 'face', 'eyes', 'hands', 'body', 'figure',
    'animal', 'nature', 'tree', 'flower', 'mountain', 'ocean', 'sky',
    'building', 'architecture', 'city', 'street', 'room', 'interior',
    
    // Visual effects
    'lighting', 'glow', 'shine', 'reflection', 'mirror', 'glass',
    'transparent', 'opaque', 'blur', 'focus', 'sharp', 'soft'
  ]);

  private audioKeywords = new Set([
    // Musical instruments
    'piano', 'guitar', 'violin', 'drums', 'bass', 'saxophone', 'trumpet',
    'flute', 'clarinet', 'cello', 'harp', 'organ', 'synthesizer', 'keyboard',
    'electric guitar', 'acoustic guitar', 'drum kit', 'percussion',
    
    // Musical genres
    'rock', 'pop', 'jazz', 'classical', 'blues', 'country', 'folk',
    'electronic', 'techno', 'house', 'ambient', 'hip hop', 'rap',
    'reggae', 'funk', 'soul', 'r&b', 'metal', 'punk', 'indie',
    
    // Musical elements
    'melody', 'harmony', 'rhythm', 'beat', 'tempo', 'chord', 'note',
    'scale', 'key', 'pitch', 'tone', 'timbre', 'dynamics', 'volume',
    'loud', 'quiet', 'soft', 'forte', 'crescendo', 'diminuendo',
    
    // Musical structure
    'verse', 'chorus', 'bridge', 'intro', 'outro', 'solo', 'riff',
    'progression', 'sequence', 'pattern', 'loop', 'sample',
    
    // Audio production
    'sound', 'audio', 'music', 'song', 'track', 'recording', 'mix',
    'master', 'reverb', 'echo', 'delay', 'distortion', 'filter',
    'equalizer', 'compression', 'stereo', 'mono', 'surround',
    
    // Tempo and mood
    'fast', 'slow', 'upbeat', 'downtempo', 'energetic', 'calm',
    'peaceful', 'aggressive', 'smooth', 'rough', 'flowing', 'choppy'
  ]);

  private mixedKeywords = new Set([
    // Creative terms that could apply to both
    'create', 'generate', 'make', 'produce', 'design', 'compose',
    'artistic', 'creative', 'beautiful', 'stunning', 'amazing',
    'mood', 'feeling', 'emotion', 'atmosphere', 'vibe', 'style',
    'modern', 'vintage', 'retro', 'futuristic', 'contemporary',
    'experimental', 'traditional', 'innovative', 'unique', 'original'
  ]);

  /**
   * Classify the intent of the input text
   */
  classifyIntent(text: string): 'visual' | 'audio' | 'mixed' {
    const normalizedText = text.toLowerCase();
    const words = normalizedText.split(/\s+/);
    
    let visualScore = 0;
    let audioScore = 0;
    let mixedScore = 0;

    // Count keyword matches
    for (const word of words) {
      // Check for multi-word phrases first
      const phrases = this.extractPhrases(normalizedText);
      for (const phrase of phrases) {
        if (this.visualKeywords.has(phrase)) visualScore += 2;
        if (this.audioKeywords.has(phrase)) audioScore += 2;
        if (this.mixedKeywords.has(phrase)) mixedScore += 1;
      }

      // Check individual words
      if (this.visualKeywords.has(word)) visualScore += 1;
      if (this.audioKeywords.has(word)) audioScore += 1;
      if (this.mixedKeywords.has(word)) mixedScore += 0.5;
    }

    // Check for explicit indicators
    if (this.hasExplicitVisualIndicators(normalizedText)) visualScore += 3;
    if (this.hasExplicitAudioIndicators(normalizedText)) audioScore += 3;

    // Determine intent based on scores
    const totalScore = visualScore + audioScore;
    
    if (totalScore === 0) {
      // No clear indicators, default to mixed
      return 'mixed';
    }

    const visualRatio = visualScore / totalScore;
    const audioRatio = audioScore / totalScore;

    // If both scores are significant, it's mixed
    if (visualScore > 0 && audioScore > 0 && Math.abs(visualRatio - audioRatio) < 0.3) {
      return 'mixed';
    }

    // Return the dominant intent
    return visualScore > audioScore ? 'visual' : 'audio';
  }

  /**
   * Extract common phrases from text
   */
  private extractPhrases(text: string): string[] {
    const phrases: string[] = [];
    
    // Common 2-word phrases
    const words = text.split(/\s+/);
    for (let i = 0; i < words.length - 1; i++) {
      phrases.push(`${words[i]} ${words[i + 1]}`);
    }

    // Common 3-word phrases
    for (let i = 0; i < words.length - 2; i++) {
      phrases.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
    }

    return phrases;
  }

  /**
   * Check for explicit visual indicators
   */
  private hasExplicitVisualIndicators(text: string): boolean {
    const visualIndicators = [
      'draw', 'paint', 'sketch', 'illustrate', 'design', 'create image',
      'make picture', 'generate art', 'visual', 'artwork', 'image of',
      'picture of', 'show me', 'looks like', 'appears', 'see'
    ];

    return visualIndicators.some(indicator => text.includes(indicator));
  }

  /**
   * Check for explicit audio indicators
   */
  private hasExplicitAudioIndicators(text: string): boolean {
    const audioIndicators = [
      'play', 'sing', 'compose', 'create music', 'make song',
      'generate audio', 'sounds like', 'hear', 'listen', 'music',
      'song', 'track', 'audio', 'sound', 'musical', 'tune'
    ];

    return audioIndicators.some(indicator => text.includes(indicator));
  }

  /**
   * Get confidence score for the classification
   */
  getClassificationConfidence(text: string): number {
    const normalizedText = text.toLowerCase();
    const words = normalizedText.split(/\s+/);
    
    let totalMatches = 0;
    let totalWords = words.length;

    for (const word of words) {
      if (this.visualKeywords.has(word) || 
          this.audioKeywords.has(word) || 
          this.mixedKeywords.has(word)) {
        totalMatches++;
      }
    }

    // Base confidence on keyword density, but be more conservative
    const keywordDensity = totalMatches / totalWords;
    
    // More conservative confidence calculation
    let confidence = Math.min(keywordDensity * 1.5, 0.8);
    
    // Boost confidence for explicit indicators
    if (this.hasExplicitVisualIndicators(normalizedText) || 
        this.hasExplicitAudioIndicators(normalizedText)) {
      confidence = Math.min(confidence + 0.2, 0.9);
    }

    // Reduce confidence for very generic terms
    const genericTerms = ['something', 'nice', 'good', 'create', 'make'];
    const hasGenericTerms = genericTerms.some(term => normalizedText.includes(term));
    if (hasGenericTerms && totalMatches <= 1) {
      confidence = Math.min(confidence * 0.6, 0.4);
    }

    return Math.max(confidence, 0.1); // Minimum confidence of 0.1
  }
}