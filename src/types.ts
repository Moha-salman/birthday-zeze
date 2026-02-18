/**
 * Type definitions for video to audio converter with transcript generation
 */

/**
 * Supported video file formats
 */
export type VideoFormat = 'mp4' | 'webm' | 'mov' | 'avi' | 'mkv';

/**
 * Supported audio output formats
 */
export type AudioFormat = 'webm' | 'mp3' | 'wav' | 'ogg';

/**
 * Conversion status states
 */
export type ConversionStatus = 
  | 'pending'
  | 'processing'
  | 'extracting-audio'
  | 'generating-transcript'
  | 'completed'
  | 'failed';

/**
 * Configuration for video conversion
 */
export interface ConversionConfig {
  /** Output audio format */
  outputFormat: AudioFormat;
  /** Audio bitrate in kbps */
  audioBitrate?: number;
  /** Enable transcript generation */
  enableTranscript: boolean;
  /** Language for transcript (ISO 639-1 code) */
  transcriptLanguage?: string;
}

/**
 * Video file metadata
 */
export interface VideoMetadata {
  /** Original file name */
  fileName: string;
  /** File size in bytes */
  fileSize: number;
  /** MIME type */
  mimeType: string;
  /** Duration in seconds */
  duration?: number;
  /** Video width in pixels */
  width?: number;
  /** Video height in pixels */
  height?: number;
}

/**
 * Audio conversion result
 */
export interface AudioResult {
  /** Audio blob */
  audioBlob: Blob;
  /** Audio URL for playback */
  audioUrl: string;
  /** Output format */
  format: AudioFormat;
  /** Duration in seconds */
  duration: number;
}

/**
 * Transcript generation result
 */
export interface TranscriptResult {
  /** Full transcript text */
  text: string;
  /** Confidence score (0-1) */
  confidence?: number;
  /** Language detected */
  language: string;
  /** Whether transcription was successful */
  success: boolean;
  /** Error message if failed */
  error?: string;
}

/**
 * Complete conversion result
 */
export interface ConversionResult {
  /** Original video metadata */
  metadata: VideoMetadata;
  /** Audio conversion result */
  audio: AudioResult;
  /** Transcript result (if enabled) */
  transcript?: TranscriptResult;
  /** Conversion status */
  status: ConversionStatus;
  /** Processing time in milliseconds */
  processingTime: number;
}

/**
 * Progress callback for conversion
 */
export interface ConversionProgress {
  /** Current status */
  status: ConversionStatus;
  /** Progress percentage (0-100) */
  percentage: number;
  /** Current step description */
  message: string;
}

/**
 * Event listeners for conversion process
 */
export interface ConversionEventListeners {
  onProgress?: (progress: ConversionProgress) => void;
  onComplete?: (result: ConversionResult) => void;
  onError?: (error: Error) => void;
}

/**
 * File download options
 */
export interface DownloadOptions {
  /** File name for download */
  fileName: string;
  /** MIME type */
  mimeType: string;
}
