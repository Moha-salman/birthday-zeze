# birthday-zeze

A birthday celebration website for Zeze with an integrated video to MP3 converter with automatic transcription.

## Features

### 🎉 Birthday Celebration Page
- Interactive birthday celebration with animations
- Photo gallery and music player
- Fireworks effects and personalized messages
- Located at: `birthday-zeze_Version4.html` and `index.html`

### 🎬 Video to Audio Converter
- Convert video files to audio format (WebM)
- Automatic speech-to-text transcription
- Support for multiple video formats (MP4, WebM, MOV, AVI)
- Download audio and transcript files
- Located at: `video-converter.html`

### 📦 TypeScript Library
- Type-safe video/audio conversion library
- Modular class-based architecture
- Full TypeScript type definitions
- Source code in `src/` directory
- Compiled output in `dist/` directory
- See [TYPESCRIPT_README.md](TYPESCRIPT_README.md) for detailed documentation

## Usage

### Video Converter (HTML)
1. Open `video-converter.html` in a modern web browser (Chrome recommended)
2. Drag and drop video files or click to browse
3. Click "Convert to Audio & Generate Transcripts"
4. Download the generated audio and transcript files

### TypeScript Library
1. Install dependencies: `npm install`
2. Build the library: `npm run build`
3. Import in your TypeScript/JavaScript project:
```typescript
import { VideoConverter, FileHandler } from './dist/main.js';

const converter = new VideoConverter();
const config = VideoConverter.createDefaultConfig('webm');
await converter.convert(videoFile, config);
```
4. See `example.html` for a complete working example
5. See [TYPESCRIPT_README.md](TYPESCRIPT_README.md) for full API documentation

**Note:** The transcription feature uses the Web Speech API which:
- Works best in Google Chrome
- Requires an internet connection
- May have limitations with audio quality or background noise
- Supports English language by default

## Technical Details

### HTML Video Converter
The video converter uses:
- HTML5 File API for file handling
- Web Audio API for audio extraction
- MediaRecorder API for recording audio
- Web Speech API for transcription

### TypeScript Library
The TypeScript library provides:
- **VideoConverter**: Main class orchestrating the conversion process
- **AudioExtractor**: Handles audio extraction from video files
- **TranscriptGenerator**: Generates text transcripts using Web Speech API
- **FileHandler**: Utility class for file downloads and operations
- **Full type definitions**: Complete TypeScript type safety

File structure:
```
src/
├── types.ts                 # Type definitions and interfaces
├── VideoConverter.ts        # Main converter class
├── AudioExtractor.ts        # Audio extraction logic
├── TranscriptGenerator.ts   # Transcript generation logic
├── FileHandler.ts           # File utility functions
└── main.ts                  # Main entry point and exports
```

## Browser Support

- **Recommended:** Google Chrome (full feature support)
- **Limited:** Firefox, Edge (audio conversion works, transcription may be limited)
- **Safari:** May have limited support for some features