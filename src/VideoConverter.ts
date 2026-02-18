/**
 * VideoConverter - Main class for converting videos to audio with transcripts
 */

import { AudioExtractor } from './AudioExtractor';
import { TranscriptGenerator } from './TranscriptGenerator';
import { FileHandler } from './FileHandler';
import {
  ConversionConfig,
  ConversionResult,
  ConversionStatus,
  ConversionEventListeners,
  AudioFormat
} from './types';

export class VideoConverter {
  private audioExtractor: AudioExtractor;
  private transcriptGenerator: TranscriptGenerator;
  private listeners: ConversionEventListeners = {};

  constructor() {
    this.audioExtractor = new AudioExtractor();
    this.transcriptGenerator = new TranscriptGenerator();
  }

  /**
   * Set event listeners for conversion process
   * @param listeners - Event listeners
   */
  setListeners(listeners: ConversionEventListeners): void {
    this.listeners = listeners;
  }

  /**
   * Emit progress event
   * @param status - Current status
   * @param percentage - Progress percentage
   * @param message - Progress message
   */
  private emitProgress(status: ConversionStatus, percentage: number, message: string): void {
    if (this.listeners.onProgress) {
      this.listeners.onProgress({ status, percentage, message });
    }
  }

  /**
   * Convert video to audio with optional transcript
   * @param videoFile - Video file to convert
   * @param config - Conversion configuration
   * @returns Promise resolving to conversion result
   */
  async convert(videoFile: File, config: ConversionConfig): Promise<ConversionResult> {
    const startTime = Date.now();

    try {
      // Validate file
      if (!FileHandler.isVideoFile(videoFile)) {
        throw new Error('File is not a video file');
      }

      this.emitProgress('processing', 0, 'Starting conversion...');

      // Get video metadata
      this.emitProgress('processing', 10, 'Reading video metadata...');
      const metadata = await this.audioExtractor.getVideoMetadata(videoFile);

      // Extract audio
      this.emitProgress('extracting-audio', 30, 'Extracting audio from video...');
      const audio = await this.audioExtractor.extractAudio(videoFile, config.outputFormat);

      // Generate transcript if enabled
      let transcript = undefined;
      if (config.enableTranscript) {
        this.emitProgress('generating-transcript', 60, 'Generating transcript...');
        transcript = await this.transcriptGenerator.generateTranscript(
          videoFile,
          config.transcriptLanguage || 'en-US'
        );
      }

      this.emitProgress('completed', 100, 'Conversion complete!');

      const result: ConversionResult = {
        metadata,
        audio,
        transcript,
        status: 'completed',
        processingTime: Date.now() - startTime
      };

      if (this.listeners.onComplete) {
        this.listeners.onComplete(result);
      }

      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      if (this.listeners.onError) {
        this.listeners.onError(errorObj);
      }

      throw errorObj;
    }
  }

  /**
   * Convert multiple video files in sequence
   * @param videoFiles - Array of video files to convert
   * @param config - Conversion configuration
   * @returns Promise resolving to array of conversion results
   */
  async convertMultiple(videoFiles: File[], config: ConversionConfig): Promise<ConversionResult[]> {
    const results: ConversionResult[] = [];

    for (let i = 0; i < videoFiles.length; i++) {
      const file = videoFiles[i];
      this.emitProgress('processing', 0, `Processing file ${i + 1} of ${videoFiles.length}: ${file.name}`);
      
      try {
        const result = await this.convert(file, config);
        results.push(result);
      } catch (error) {
        console.error(`Failed to convert ${file.name}:`, error);
        // Continue with next file
      }
    }

    return results;
  }

  /**
   * Check if transcript generation is supported
   * @returns True if supported, false otherwise
   */
  isTranscriptSupported(): boolean {
    return this.transcriptGenerator.isSupported();
  }

  /**
   * Create default conversion config
   * @param outputFormat - Desired output audio format
   * @returns Default configuration
   */
  static createDefaultConfig(outputFormat: AudioFormat = 'webm'): ConversionConfig {
    return {
      outputFormat,
      enableTranscript: true,
      transcriptLanguage: 'en-US'
    };
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.audioExtractor.dispose();
    this.transcriptGenerator.dispose();
  }
}
