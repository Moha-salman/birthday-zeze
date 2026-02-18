# TypeScript Video Converter Library

A TypeScript library for converting video files to audio with automatic transcript generation using browser APIs.

## Features

- 🎬 **Video to Audio Conversion**: Extract audio from video files in various formats
- 📝 **Automatic Transcription**: Generate text transcripts using Web Speech API
- 🔄 **Type-Safe**: Full TypeScript support with comprehensive type definitions
- 🎯 **Modular Architecture**: Clean separation of concerns with individual classes
- 💾 **File Management**: Built-in utilities for downloading audio and transcript files
- 📊 **Progress Tracking**: Real-time progress callbacks during conversion

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

This will compile TypeScript files from `src/` to `dist/`.

## Usage

### Basic Example

```typescript
import { VideoConverter, FileHandler } from './main';

// Create converter instance
const converter = new VideoConverter();

// Set up event listeners
converter.setListeners({
  onProgress: (progress) => {
    console.log(`${progress.status}: ${progress.percentage}% - ${progress.message}`);
  },
  onComplete: (result) => {
    console.log('Conversion complete!', result);
    
    // Download audio file
    FileHandler.downloadAudio(
      result.audio.audioBlob,
      FileHandler.getBaseName(result.metadata.fileName),
      result.audio.format
    );
    
    // Download transcript if available
    if (result.transcript?.success) {
      FileHandler.downloadTranscript(
        result.transcript.text,
        FileHandler.getBaseName(result.metadata.fileName)
      );
    }
  },
  onError: (error) => {
    console.error('Conversion failed:', error);
  }
});

// Convert a video file
const videoFile = /* your video file */;
const config = VideoConverter.createDefaultConfig('webm');

await converter.convert(videoFile, config);
```

### Advanced Configuration

```typescript
import { VideoConverter, ConversionConfig } from './main';

const converter = new VideoConverter();

const config: ConversionConfig = {
  outputFormat: 'webm',
  audioBitrate: 128,
  enableTranscript: true,
  transcriptLanguage: 'en-US'
};

const result = await converter.convert(videoFile, config);
```

### Convert Multiple Files

```typescript
const files = [file1, file2, file3];
const results = await converter.convertMultiple(files, config);
```

## API Reference

### Classes

#### VideoConverter

Main class for video conversion operations.

**Methods:**
- `convert(videoFile, config)`: Convert a single video file
- `convertMultiple(videoFiles, config)`: Convert multiple video files
- `setListeners(listeners)`: Set event listeners
- `isTranscriptSupported()`: Check if transcription is supported
- `dispose()`: Clean up resources

#### AudioExtractor

Extracts audio from video files.

**Methods:**
- `extractAudio(videoFile, format)`: Extract audio in specified format
- `getVideoMetadata(videoFile)`: Get video file metadata
- `dispose()`: Clean up resources

#### TranscriptGenerator

Generates text transcripts from video/audio.

**Methods:**
- `generateTranscript(videoFile, language)`: Generate transcript
- `isSupported()`: Check if speech recognition is available
- `stop()`: Stop current transcription
- `dispose()`: Clean up resources

#### FileHandler

Static utility class for file operations.

**Methods:**
- `downloadBlob(blob, options)`: Download a blob
- `downloadUrl(url, fileName)`: Download from URL
- `downloadText(text, fileName, mimeType)`: Download text as file
- `downloadAudio(audioBlob, baseName, format)`: Download audio file
- `downloadTranscript(transcript, baseName)`: Download transcript
- `isVideoFile(file)`: Check if file is a video
- `getFileExtension(fileName)`: Get file extension
- `getBaseName(fileName)`: Get base name without extension
- `formatFileSize(bytes)`: Format file size to human-readable string
- `formatDuration(seconds)`: Format duration to human-readable string

### Types

See `src/types.ts` for full type definitions including:
- `VideoFormat`
- `AudioFormat`
- `ConversionStatus`
- `ConversionConfig`
- `VideoMetadata`
- `AudioResult`
- `TranscriptResult`
- `ConversionResult`
- `ConversionProgress`
- `ConversionEventListeners`
- `DownloadOptions`

## Browser Support

- **Chrome**: ✅ Full support (recommended)
- **Firefox**: ⚠️ Audio extraction works, limited transcription
- **Edge**: ⚠️ Audio extraction works, limited transcription
- **Safari**: ⚠️ Limited support

## Technical Details

### Audio Extraction
- Uses Web Audio API and MediaRecorder API
- Supports WebM output format (most compatible)
- Handles AudioContext lifecycle to prevent memory leaks

### Transcription
- Uses Web Speech API (requires internet connection)
- Cloud-based processing
- Best results with clear audio
- Supports multiple languages

## Requirements

- Modern browser with Web Audio API support
- Internet connection for transcription (Web Speech API is cloud-based)
- TypeScript 5.3+ for development

## File Structure

```
src/
├── types.ts                 # Type definitions and interfaces
├── VideoConverter.ts        # Main converter class
├── AudioExtractor.ts        # Audio extraction logic
├── TranscriptGenerator.ts   # Transcript generation logic
├── FileHandler.ts           # File utility functions
└── main.ts                  # Main entry point and exports
```

## License

MIT
