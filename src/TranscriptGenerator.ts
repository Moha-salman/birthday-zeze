/**
 * TranscriptGenerator - Generates text transcripts from video/audio files
 */

import { TranscriptResult } from './types';

export class TranscriptGenerator {
  private recognition: any = null;
  private isRecognitionAvailable: boolean;

  constructor() {
    // Check if Web Speech API is available
    this.isRecognitionAvailable = 
      'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  /**
   * Check if speech recognition is supported
   * @returns True if supported, false otherwise
   */
  isSupported(): boolean {
    return this.isRecognitionAvailable;
  }

  /**
   * Generate transcript from video file
   * @param videoFile - The video file to transcribe
   * @param language - Language code (default: 'en-US')
   * @returns Promise resolving to transcript result
   */
  async generateTranscript(videoFile: File, language: string = 'en-US'): Promise<TranscriptResult> {
    if (!this.isRecognitionAvailable) {
      return {
        text: '⚠️ Speech recognition is not supported in this browser.\n\nTo generate transcripts, please use Google Chrome or another browser with Web Speech API support.\n\nAlternatively, you can use third-party transcription services with the downloaded audio file.',
        success: false,
        language,
        error: 'Speech recognition not available'
      };
    }

    return new Promise((resolve, reject) => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = language;

      let transcript = '';
      let confidenceSum = 0;
      let confidenceCount = 0;
      
      const audio = document.createElement('audio');
      const fileURL = URL.createObjectURL(videoFile);
      audio.src = fileURL;

      this.recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript + '\n';
            confidenceSum += event.results[i][0].confidence;
            confidenceCount++;
          }
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        URL.revokeObjectURL(fileURL);
        
        if (transcript) {
          const avgConfidence = confidenceCount > 0 ? confidenceSum / confidenceCount : 0;
          resolve({
            text: transcript + '\n\n[Note: Transcription may be incomplete due to: ' + event.error + ']',
            success: true,
            language,
            confidence: avgConfidence,
            error: event.error
          });
        } else {
          resolve({
            text: `⚠️ Transcription failed: ${event.error}\n\nPlease ensure:\n- Your browser supports speech recognition\n- You have an internet connection\n- The video has clear audio\n\nYou can still use the downloaded audio file with other transcription services.`,
            success: false,
            language,
            error: event.error
          });
        }
      };

      this.recognition.onend = () => {
        URL.revokeObjectURL(fileURL);
        
        if (!transcript) {
          resolve({
            text: '⚠️ No speech detected in the video.\n\nPossible reasons:\n- The video has no audio\n- The audio quality is too low\n- The speech is in a different language\n\nYou can still use the downloaded audio file with other transcription services.',
            success: false,
            language,
            error: 'No speech detected'
          });
        } else {
          const avgConfidence = confidenceCount > 0 ? confidenceSum / confidenceCount : 0;
          resolve({
            text: transcript,
            success: true,
            language,
            confidence: avgConfidence
          });
        }
      };

      // Start recognition and play audio
      audio.addEventListener('loadedmetadata', () => {
        try {
          this.recognition.start();
          audio.play();

          audio.onended = () => {
            // Allow 1 second buffer for final speech processing before stopping
            setTimeout(() => {
              if (this.recognition) {
                this.recognition.stop();
              }
            }, 1000);
          };
        } catch (error) {
          reject(new Error(`Failed to start transcription: ${error instanceof Error ? error.message : String(error)}`));
        }
      });

      audio.addEventListener('error', () => {
        URL.revokeObjectURL(fileURL);
        reject(new Error('Failed to load video for transcription'));
      });
    });
  }

  /**
   * Stop current transcription process
   */
  stop(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
      this.recognition = null;
    }
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.stop();
  }
}
