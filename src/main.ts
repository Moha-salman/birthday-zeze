/**
 * Main entry point for video converter application
 * Exports all public APIs
 */

export { VideoConverter } from './VideoConverter';
export { AudioExtractor } from './AudioExtractor';
export { TranscriptGenerator } from './TranscriptGenerator';
export { FileHandler } from './FileHandler';

export * from './types';

/**
 * Example usage:
 * 
 * ```typescript
 * import { VideoConverter, FileHandler } from './main';
 * 
 * const converter = new VideoConverter();
 * 
 * // Set up event listeners
 * converter.setListeners({
 *   onProgress: (progress) => {
 *     console.log(`${progress.status}: ${progress.percentage}%`);
 *   },
 *   onComplete: (result) => {
 *     console.log('Conversion complete!', result);
 *     
 *     // Download audio file
 *     FileHandler.downloadAudio(
 *       result.audio.audioBlob,
 *       FileHandler.getBaseName(result.metadata.fileName),
 *       result.audio.format
 *     );
 *     
 *     // Download transcript if available
 *     if (result.transcript && result.transcript.success) {
 *       FileHandler.downloadTranscript(
 *         result.transcript.text,
 *         FileHandler.getBaseName(result.metadata.fileName)
 *       );
 *     }
 *   },
 *   onError: (error) => {
 *     console.error('Conversion failed:', error);
 *   }
 * });
 * 
 * // Convert a video file
 * const videoFile = document.querySelector('input[type="file"]').files[0];
 * const config = VideoConverter.createDefaultConfig('webm');
 * 
 * converter.convert(videoFile, config)
 *   .then(result => {
 *     console.log('Success!', result);
 *   })
 *   .catch(error => {
 *     console.error('Error:', error);
 *   });
 * ```
 */
