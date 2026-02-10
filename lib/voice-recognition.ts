/**
 * Voice recognition utilities using Web Speech API
 */

export interface VoiceRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export class VoiceRecognition {
  private recognition: any;
  private isSupported: boolean;
  
  constructor() {
    // Check for browser support
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;
    
    this.isSupported = !!SpeechRecognition;
    
    if (this.isSupported) {
      this.recognition = new SpeechRecognition();
    }
  }

  /**
   * Check if voice recognition is supported
   */
  static isSupported(): boolean {
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  /**
   * Start voice recognition
   */
  start(
    options: VoiceRecognitionOptions,
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string) => void
  ): void {
    if (!this.isSupported || !this.recognition) {
      onError?.('Voice recognition is not supported in this browser');
      return;
    }

    // Configure recognition
    this.recognition.continuous = options.continuous ?? true;
    this.recognition.interimResults = options.interimResults ?? true;
    this.recognition.lang = options.language ?? 'en-US';

    // Handle results
    this.recognition.onresult = (event: any) => {
      const results = event.results;
      const lastResult = results[results.length - 1];
      const transcript = lastResult[0].transcript;
      const isFinal = lastResult.isFinal;
      
      onResult(transcript, isFinal);
    };

    // Handle errors
    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      onError?.(event.error);
    };

    // Handle end
    this.recognition.onend = () => {
      // Automatically restart if continuous mode
      if (options.continuous) {
        try {
          this.recognition.start();
        } catch (err) {
          // Ignore if already started
        }
      }
    };

    // Start recognition
    try {
      this.recognition.start();
    } catch (err) {
      console.error('Failed to start recognition:', err);
      onError?.('Failed to start voice recognition');
    }
  }

  /**
   * Stop voice recognition
   */
  stop(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  /**
   * Pause voice recognition
   */
  pause(): void {
    if (this.recognition) {
      this.recognition.abort();
    }
  }
}

/**
 * Supported languages for voice recognition
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'nl-NL', name: 'Dutch' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'pt-PT', name: 'Portuguese' },
];
