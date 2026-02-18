# birthday-zeze

A birthday celebration website for Zeze with an integrated video to MP3 converter with automatic transcription.

## Features

### 🎉 Birthday Celebration Page
- Interactive birthday celebration with animations
- Photo gallery and music player
- Fireworks effects and personalized messages
- Located at: `birthday-zeze_Version4.html` and `index.html`

### 🎬 Video to MP3 Converter
- Convert video files to MP3 audio format
- Automatic speech-to-text transcription
- Support for multiple video formats (MP4, WebM, MOV, AVI)
- Download audio and transcript files
- Located at: `video-converter.html`

## Usage

### Video Converter
1. Open `video-converter.html` in a modern web browser (Chrome recommended)
2. Drag and drop video files or click to browse
3. Click "Convert to MP3 & Generate Transcripts"
4. Download the generated audio and transcript files

**Note:** The transcription feature uses the Web Speech API which:
- Works best in Google Chrome
- Requires an internet connection
- May have limitations with audio quality or background noise
- Supports English language by default

## Technical Details

The video converter uses:
- HTML5 File API for file handling
- Web Audio API for audio extraction
- MediaRecorder API for recording audio
- Web Speech API for transcription

## Browser Support

- **Recommended:** Google Chrome (full feature support)
- **Limited:** Firefox, Edge (audio conversion works, transcription may be limited)
- **Safari:** May have limited support for some features