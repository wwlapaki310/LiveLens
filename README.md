# LiveLens 👁️📱

**Real-time Visual Description Service for Xreal AR Glasses**

LiveLens provides real-time visual descriptions of your camera feed using Vision Language Models (VLM). Designed for Xreal AR glasses with smartphone camera streaming.

## 🎯 Features

- **Real-time Camera Streaming**: Access smartphone camera via WebRTC
- **Dual AI Mode**:
  - 🔷 On-device VLM (MediaPipe/TensorFlow.js)
  - ☁️ Cloud VLM (Gemini API)
- **Simple Web App**: No installation required, runs in browser
- **Responsive UI**: Works on smartphones and AR displays

## 🚀 Quick Start

1. Clone this repository
```bash
git clone https://github.com/wwlapaki310/LiveLens.git
cd LiveLens
```

2. Open `index.html` in your browser (HTTPS required for camera access)
```bash
# Using Python's HTTP server
python3 -m http.server 8000
```

3. For Gemini API mode, add your API key in `config.js`

## 📋 Requirements

- Modern web browser (Chrome, Safari, Edge)
- HTTPS connection (for camera access)
- Gemini API key (for cloud mode)

## 🏗️ Architecture

See [docs/architecture.md](docs/architecture.md) for detailed system design.

```
┌─────────────┐
│  Xreal AR   │ ← Display descriptions
└──────┬──────┘
       │
┌──────▼──────┐
│ Smartphone  │
│  Browser    │
│ ┌─────────┐ │
│ │ Camera  │ │
│ └────┬────┘ │
│      │      │
│ ┌────▼────┐ │
│ │LiveLens │ │
│ │Web App  │ │
│ └────┬────┘ │
└──────┼──────┘
       │
   ┌───▼────┐
   │  VLM   │
   │ Engine │
   └────────┘
   On-device / Cloud
```

## 📱 Usage

1. **Select AI Mode**: Choose between on-device or cloud processing
2. **Start Camera**: Grant camera permissions
3. **View Descriptions**: Real-time visual descriptions appear on screen
4. **Adjust Settings**: Configure capture interval and description detail

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Camera**: WebRTC getUserMedia API
- **On-device AI**: MediaPipe Vision Tasks
- **Cloud AI**: Google Gemini API
- **Styling**: CSS3 with Flexbox

## 📝 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

Developed by Satoru Wada (Sony Semiconductor Solutions)

## 🔗 Links

- GitHub: https://github.com/wwlapaki310/LiveLens
- Issues: https://github.com/wwlapaki310/LiveLens/issues
