/**
 * FileHandler - Handles file downloads and file system operations
 */

import { DownloadOptions } from './types';

export class FileHandler {
  /**
   * Download a blob as a file
   * @param blob - The blob to download
   * @param options - Download options
   */
  static downloadBlob(blob: Blob, options: DownloadOptions): void {
    const url = URL.createObjectURL(blob);
    this.downloadUrl(url, options.fileName);
    // Small delay to ensure download starts before revoking the URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  /**
   * Download a file from a URL
   * @param url - The URL to download from
   * @param fileName - The name for the downloaded file
   */
  static downloadUrl(url: string, fileName: string): void {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Download text as a file
   * @param text - The text content to download
   * @param fileName - The name for the downloaded file
   * @param mimeType - MIME type (default: text/plain)
   */
  static downloadText(text: string, fileName: string, mimeType: string = 'text/plain'): void {
    const blob = new Blob([text], { type: mimeType });
    this.downloadBlob(blob, { fileName, mimeType });
  }

  /**
   * Download audio blob with appropriate file extension
   * @param audioBlob - The audio blob to download
   * @param baseName - Base file name (without extension)
   * @param format - Audio format
   */
  static downloadAudio(audioBlob: Blob, baseName: string, format: string): void {
    const fileName = `${baseName}.${format}`;
    this.downloadBlob(audioBlob, {
      fileName,
      mimeType: `audio/${format}`
    });
  }

  /**
   * Download transcript as text file
   * @param transcript - The transcript text
   * @param baseName - Base file name (without extension)
   */
  static downloadTranscript(transcript: string, baseName: string): void {
    const fileName = `${baseName}_transcript.txt`;
    this.downloadText(transcript, fileName);
  }

  /**
   * Validate if a file is a video file
   * @param file - File to validate
   * @returns True if file is a video, false otherwise
   */
  static isVideoFile(file: File): boolean {
    return file.type.startsWith('video/');
  }

  /**
   * Get file extension from file name
   * @param fileName - The file name
   * @returns File extension without the dot
   */
  static getFileExtension(fileName: string): string {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  }

  /**
   * Get base name without extension
   * @param fileName - The file name
   * @returns Base name without extension
   */
  static getBaseName(fileName: string): string {
    return fileName.replace(/\.[^/.]+$/, '');
  }

  /**
   * Format file size to human-readable string
   * @param bytes - File size in bytes
   * @returns Formatted string (e.g., "1.5 MB")
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Format duration to human-readable string
   * @param seconds - Duration in seconds
   * @returns Formatted string (e.g., "1:23:45")
   */
  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}
