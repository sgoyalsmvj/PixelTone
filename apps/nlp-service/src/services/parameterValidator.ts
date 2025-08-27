import { 
  ParsedParameters, 
  VisualParameters, 
  AudioParameters,
  ValidationResult 
} from '@ai-studio/shared-types';

/**
 * Parameter validation service for parsed creative parameters
 */
export class ParameterValidator {
  
  /**
   * Validate parsed parameters for completeness and correctness
   */
  async validateParameters(parameters: ParsedParameters): Promise<ValidationResult> {
    const errors: Array<{ field: string; message: string; code: string }> = [];
    const warnings: Array<{ field: string; message: string; suggestion?: string }> = [];

    // Validate that at least one parameter type exists
    if (!parameters.visual && !parameters.audio) {
      errors.push({
        field: 'parameters',
        message: 'At least one parameter type (visual or audio) must be specified',
        code: 'NO_PARAMETERS'
      });
    }

    // Validate visual parameters
    if (parameters.visual) {
      this.validateVisualParameters(parameters.visual, errors, warnings);
    }

    // Validate audio parameters
    if (parameters.audio) {
      this.validateAudioParameters(parameters.audio, errors, warnings);
    }

    // Validate confidence level
    if (parameters.confidence < 0 || parameters.confidence > 1) {
      errors.push({
        field: 'confidence',
        message: 'Confidence must be between 0 and 1',
        code: 'INVALID_CONFIDENCE'
      });
    }

    // Warn about low confidence
    if (parameters.confidence < 0.3) {
      warnings.push({
        field: 'confidence',
        message: 'Low confidence in parameter extraction',
        suggestion: 'Consider providing more specific descriptions'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate visual parameters
   */
  private validateVisualParameters(
    visual: VisualParameters,
    errors: Array<{ field: string; message: string; code: string }>,
    warnings: Array<{ field: string; message: string; suggestion?: string }>
  ): void {
    // Validate style array
    if (!Array.isArray(visual.style)) {
      errors.push({
        field: 'visual.style',
        message: 'Style must be an array',
        code: 'INVALID_STYLE_TYPE'
      });
    } else {
      // Check for empty or invalid styles
      const invalidStyles = visual.style.filter(style => 
        typeof style !== 'string' || style.trim().length === 0
      );
      
      if (invalidStyles.length > 0) {
        errors.push({
          field: 'visual.style',
          message: 'All style entries must be non-empty strings',
          code: 'INVALID_STYLE_ENTRIES'
        });
      }

      // Warn about missing styles
      if (visual.style.length === 0) {
        warnings.push({
          field: 'visual.style',
          message: 'No visual style specified',
          suggestion: 'Consider adding style keywords like "realistic", "abstract", or "cartoon"'
        });
      }

      // Warn about overly generic styles
      const genericStyles = ['artistic', 'creative', 'beautiful', 'nice', 'good'];
      const hasGenericStyles = visual.style.some(style => 
        genericStyles.includes(style.toLowerCase())
      );
      
      if (hasGenericStyles) {
        warnings.push({
          field: 'visual.style',
          message: 'Generic style terms detected',
          suggestion: 'Use more specific style descriptions like "oil painting", "digital art", or "photorealistic"'
        });
      }
    }

    // Validate colors array
    if (!Array.isArray(visual.colors)) {
      errors.push({
        field: 'visual.colors',
        message: 'Colors must be an array',
        code: 'INVALID_COLORS_TYPE'
      });
    } else {
      // Check for invalid color entries
      const invalidColors = visual.colors.filter(color => 
        typeof color !== 'string' || color.trim().length === 0
      );
      
      if (invalidColors.length > 0) {
        errors.push({
          field: 'visual.colors',
          message: 'All color entries must be non-empty strings',
          code: 'INVALID_COLOR_ENTRIES'
        });
      }

      // Warn about missing colors
      if (visual.colors.length === 0) {
        warnings.push({
          field: 'visual.colors',
          message: 'No colors specified',
          suggestion: 'Consider adding color descriptions for better results'
        });
      }

      // Warn about ambiguous color terms
      const ambiguousColors = ['dark', 'light', 'bright', 'muted', 'colorful'];
      const hasAmbiguousColors = visual.colors.some(color => 
        ambiguousColors.includes(color.toLowerCase())
      );
      
      if (hasAmbiguousColors) {
        warnings.push({
          field: 'visual.colors',
          message: 'Ambiguous color terms detected',
          suggestion: 'Use specific color names like "deep blue", "warm red", or "forest green"'
        });
      }
    }

    // Validate mood
    if (typeof visual.mood !== 'string') {
      errors.push({
        field: 'visual.mood',
        message: 'Mood must be a string',
        code: 'INVALID_MOOD_TYPE'
      });
    } else if (visual.mood.trim().length === 0) {
      warnings.push({
        field: 'visual.mood',
        message: 'No mood specified',
        suggestion: 'Consider adding mood keywords like "peaceful", "energetic", or "dramatic"'
      });
    }

    // Validate composition
    if (typeof visual.composition !== 'string') {
      errors.push({
        field: 'visual.composition',
        message: 'Composition must be a string',
        code: 'INVALID_COMPOSITION_TYPE'
      });
    }

    // Validate themes array
    if (!Array.isArray(visual.themes)) {
      errors.push({
        field: 'visual.themes',
        message: 'Themes must be an array',
        code: 'INVALID_THEMES_TYPE'
      });
    } else {
      // Check for invalid theme entries
      const invalidThemes = visual.themes.filter(theme => 
        typeof theme !== 'string' || theme.trim().length === 0
      );
      
      if (invalidThemes.length > 0) {
        errors.push({
          field: 'visual.themes',
          message: 'All theme entries must be non-empty strings',
          code: 'INVALID_THEME_ENTRIES'
        });
      }

      // Suggest themes if none provided
      if (visual.themes.length === 0) {
        warnings.push({
          field: 'visual.themes',
          message: 'No themes specified',
          suggestion: 'Add thematic elements like "nature", "urban", or "fantasy" for better results'
        });
      }
    }
  }

  /**
   * Validate audio parameters
   */
  private validateAudioParameters(
    audio: AudioParameters,
    errors: Array<{ field: string; message: string; code: string }>,
    warnings: Array<{ field: string; message: string; suggestion?: string }>
  ): void {
    // Validate genre array
    if (!Array.isArray(audio.genre)) {
      errors.push({
        field: 'audio.genre',
        message: 'Genre must be an array',
        code: 'INVALID_GENRE_TYPE'
      });
    } else {
      // Check for invalid genre entries
      const invalidGenres = audio.genre.filter(genre => 
        typeof genre !== 'string' || genre.trim().length === 0
      );
      
      if (invalidGenres.length > 0) {
        errors.push({
          field: 'audio.genre',
          message: 'All genre entries must be non-empty strings',
          code: 'INVALID_GENRE_ENTRIES'
        });
      }

      // Warn about missing genres
      if (audio.genre.length === 0) {
        warnings.push({
          field: 'audio.genre',
          message: 'No musical genre specified',
          suggestion: 'Consider adding genre keywords like "rock", "jazz", or "electronic"'
        });
      }
    }

    // Validate instruments array
    if (!Array.isArray(audio.instruments)) {
      errors.push({
        field: 'audio.instruments',
        message: 'Instruments must be an array',
        code: 'INVALID_INSTRUMENTS_TYPE'
      });
    } else {
      // Check for invalid instrument entries
      const invalidInstruments = audio.instruments.filter(instrument => 
        typeof instrument !== 'string' || instrument.trim().length === 0
      );
      
      if (invalidInstruments.length > 0) {
        errors.push({
          field: 'audio.instruments',
          message: 'All instrument entries must be non-empty strings',
          code: 'INVALID_INSTRUMENT_ENTRIES'
        });
      }

      // Warn about missing instruments
      if (audio.instruments.length === 0) {
        warnings.push({
          field: 'audio.instruments',
          message: 'No instruments specified',
          suggestion: 'Consider adding instrument names like "piano", "guitar", or "drums"'
        });
      }
    }

    // Validate tempo
    if (typeof audio.tempo !== 'number') {
      errors.push({
        field: 'audio.tempo',
        message: 'Tempo must be a number',
        code: 'INVALID_TEMPO_TYPE'
      });
    } else {
      // Check tempo range
      if (audio.tempo < 60 || audio.tempo > 200) {
        errors.push({
          field: 'audio.tempo',
          message: 'Tempo must be between 60 and 200 BPM',
          code: 'INVALID_TEMPO_RANGE'
        });
      }

      // Warn about default tempo
      if (audio.tempo === 120) {
        warnings.push({
          field: 'audio.tempo',
          message: 'Using default tempo',
          suggestion: 'Specify tempo like "slow ballad", "upbeat", or specific BPM for better results'
        });
      }
    }

    // Validate mood
    if (typeof audio.mood !== 'string') {
      errors.push({
        field: 'audio.mood',
        message: 'Mood must be a string',
        code: 'INVALID_MOOD_TYPE'
      });
    } else if (audio.mood.trim().length === 0) {
      warnings.push({
        field: 'audio.mood',
        message: 'No mood specified',
        suggestion: 'Consider adding mood keywords like "uplifting", "melancholic", or "energetic"'
      });
    }

    // Validate structure
    if (typeof audio.structure !== 'string') {
      errors.push({
        field: 'audio.structure',
        message: 'Structure must be a string',
        code: 'INVALID_STRUCTURE_TYPE'
      });
    } else if (audio.structure.trim().length === 0) {
      warnings.push({
        field: 'audio.structure',
        message: 'No structure specified',
        suggestion: 'Consider specifying song structure like "verse-chorus" or "intro-verse-chorus-bridge-outro"'
      });
    }
  }

  /**
   * Check if parameters are complete enough for generation
   */
  isCompleteForGeneration(parameters: ParsedParameters): boolean {
    if (!parameters.visual && !parameters.audio) {
      return false;
    }

    if (parameters.visual) {
      const hasMinimalVisual = parameters.visual.style.length > 0 || 
                              parameters.visual.colors.length > 0 || 
                              parameters.visual.mood.length > 0 ||
                              parameters.visual.themes.length > 0;
      
      if (!hasMinimalVisual) {
        return false;
      }
    }

    if (parameters.audio) {
      const hasMinimalAudio = parameters.audio.genre.length > 0 || 
                             parameters.audio.instruments.length > 0 || 
                             parameters.audio.mood.length > 0;
      
      if (!hasMinimalAudio) {
        return false;
      }
    }

    return parameters.confidence >= 0.2; // Minimum confidence threshold
  }

  /**
   * Get validation severity level
   */
  getValidationSeverity(parameters: ParsedParameters): 'error' | 'warning' | 'info' | 'success' {
    if (!parameters.visual && !parameters.audio) {
      return 'error';
    }

    if (parameters.confidence < 0.3) {
      return 'warning';
    }

    if (parameters.ambiguities.length > 2) {
      return 'warning';
    }

    if (parameters.confidence >= 0.7 && parameters.ambiguities.length === 0) {
      return 'success';
    }

    return 'info';
  }
}