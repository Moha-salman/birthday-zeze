/**
 * AudioExtractor - Extracts audio from video files
 */

import { AudioFormat, AudioResult, VideoMetadata } from './types';

export class AudioExtractor {
  private audioContext: AudioContext | null = null;

  /**
   * Extract audio from a video file
   * @param videoFile - The video file to extract audio from
   * @param format - Desired output audio format
   * @returns Promise resolving to audio result
   */
  async extractAudio(videoFile: File, format: AudioFormat = 'webm'): Promise<AudioResult> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const fileURL = URL.createObjectURL(videoFile);
      video.src = fileURL;

      video.addEventListener('loadedmetadata', async () => {
        try {
          this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const source = this.audioContext.createMediaElementSource(video);
          const destination = this.audioContext.createMediaStreamDestination();
          source.connect(destination);

          const mediaRecorder = new MediaRecorder(destination.stream);
          const chunks: Blob[] = [];

          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              chunks.push(e.data);
            }
          };

          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(chunks, { type: `audio/${format}` });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Close AudioContext to prevent resource leaks
            if (this.audioContext) {
              this.audioContext.close();
              this.audioContext = null;
            }
            
            URL.revokeObjectURL(fileURL);
            
            resolve({
              audioBlob,
              audioUrl,
              format,
              duration: video.duration
            });
          };

          mediaRecorder.start();
          video.play();

          video.onended = () => {
            mediaRecorder.stop();
            source.disconnect();
          };
        } catch (error) {
          if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
          }
          reject(new Error(`Failed to extract audio: ${error instanceof Error ? error.message : String(error)}`));
        }
      });

      video.addEventListener('error', () => {
        URL.revokeObjectURL(fileURL);
        reject(new Error('Failed to load video file'));
      });
    });
  }

  /**
   * Get video metadata
   * @param videoFile - The video file to analyze
   * @returns Promise resolving to video metadata
   */
  async getVideoMetadata(videoFile: File): Promise<VideoMetadata> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const fileURL = URL.createObjectURL(videoFile);
      video.src = fileURL;

      video.addEventListener('loadedmetadata', () => {
        const metadata: VideoMetadata = {
          fileName: videoFile.name,
          fileSize: videoFile.size,
          mimeType: videoFile.type,
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight
        };
        
        URL.revokeObjectURL(fileURL);
        resolve(metadata);
      });

      video.addEventListener('error', () => {
        URL.revokeObjectURL(fileURL);
        reject(new Error('Failed to load video metadata'));
      });
    });
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
