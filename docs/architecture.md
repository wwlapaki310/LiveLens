# LiveLens Architecture

## System Overview

LiveLens is a browser-based real-time visual description service that captures camera feed and provides natural language descriptions using Vision Language Models.

## Architecture Diagram

```
┌───────────────────────────────────────────────────────────┐
│                    User Interface                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │  Camera  │  │  Mode    │  │  Description Panel   │  │
│  │  Preview │  │ Selector │  │  (Text Output)       │  │
│  └─────┬────┘  └─────┬─────┘  └──────────────────────┘  │
└────────┼────────────┼───────────────────────────────────┘
         │            │
         │            ▼
         │     ┌──────────────┐
         │     │ Mode Manager │
         │     └──────┬───────┘
         │            │
         ▼            ▼
  ┌──────────────────────────────────┐
  │     Frame Capture Engine         │
  │  - WebRTC getUserMedia           │
  │  - Canvas-based frame extraction │
  │  - Base64 encoding               │
  └───────────┬──────────────────────┘
             │
       ┌─────┴──────┐
       │            │
       ▼            ▼
┌────────────┐  ┌─────────────┐
│ On-device  │  │   Cloud     │
│  VLM Path  │  │  VLM Path   │
└─────┬──────┘  └──────┬──────┘
      │                │
      ▼                ▼
┌────────────┐  ┌─────────────┐
│ MediaPipe/ │  │   Gemini    │
│TensorFlow  │  │     API     │
│   .js      │  │             │
└─────┬──────┘  └──────┬──────┘
      │                │
      └────────┬───────┘
               │
               ▼
     ┌──────────────────┐
     │ Description      │
     │ Rendering Engine │
     └──────────────────┘
```

## Component Details

### 1. Camera Module
- **Technology**: WebRTC getUserMedia API
- **Function**: Captures real-time video stream from smartphone camera
- **Output**: Video stream to `<video>` element

### 2. Frame Capture Engine
- **Technology**: HTML5 Canvas API
- **Function**: 
  - Extracts frames at configurable intervals (default: 2 seconds)
  - Converts frames to Base64 encoded images
  - Optimizes image size for API transmission
- **Input**: Video stream
- **Output**: Base64 image data

### 3. Mode Manager
- **Function**: Switches between on-device and cloud processing
- **States**:
  - `on-device`: Uses browser-based VLM
  - `cloud`: Uses Gemini API

### 4. On-device VLM Path
- **Option A**: MediaPipe Image Classification
  - Lightweight, fast inference
  - Limited description capabilities
  - Good for object recognition
  
- **Option B**: TensorFlow.js with COCO-SSD
  - Object detection
  - Bounding boxes
  - Limited to pre-trained categories

**MVP Strategy**: Start with simple object detection, then upgrade to full VLM

### 5. Cloud VLM Path
- **Service**: Google Gemini API (gemini-1.5-flash)
- **Function**:
  - Sends Base64 image to API
  - Receives natural language description
  - Handles rate limiting and errors
- **Advantages**: 
  - High-quality descriptions
  - Contextual understanding
  - No model loading time

### 6. Description Rendering
- **Function**: Displays VLM output to user
- **Features**:
  - Real-time text updates
  - Timestamp display
  - Auto-scroll for long descriptions
  - Text-to-speech support (future)

## Data Flow

```
1. User starts camera
   ↓
2. Video stream rendered to <video> element
   ↓
3. Timer triggers frame capture (every 2s)
   ↓
4. Canvas draws current video frame
   ↓
5. Canvas converts to Base64 JPEG
   ↓
6. Route to selected VLM path
   ↓
   ├→ [On-device]: Process with local model
   └→ [Cloud]: POST to Gemini API
   ↓
7. Receive description
   ↓
8. Render to description panel
   ↓
9. Loop back to step 3
```

## API Integration

### Gemini API Request Format

```javascript
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent

Headers:
  Content-Type: application/json

Body:
{
  "contents": [{
    "parts": [
      {
        "text": "Describe what you see in this image in one sentence."
      },
      {
        "inline_data": {
          "mime_type": "image/jpeg",
          "data": "<base64_encoded_image>"
        }
      }
    ]
  }]
}
```

### Response Handling
- Extract text from `candidates[0].content.parts[0].text`
- Handle API errors gracefully
- Implement retry logic with exponential backoff

## Performance Considerations

### Capture Interval
- **Default**: 2 seconds
- **Rationale**: Balance between real-time feel and API cost
- **Configurable**: User can adjust (0.5s - 10s)

### Image Optimization
- **Resolution**: 640x480 (default)
- **Format**: JPEG with 0.8 quality
- **Size**: ~50-100KB per frame

### API Rate Limits
- **Gemini Free Tier**: 60 requests/minute
- **Safety**: Implement client-side rate limiting
- **Fallback**: Queue requests or show warning

## Security & Privacy

1. **HTTPS Required**: Camera access only on secure connections
2. **Local Processing**: Images not stored on server
3. **API Key**: Stored in config, not committed to Git
4. **User Consent**: Explicit camera permission request

## Future Enhancements

1. **Text-to-Speech**: Audio descriptions via Web Speech API
2. **Multi-language**: Support Japanese, English, etc.
3. **Advanced VLM**: Upgrade on-device model (e.g., MobileVLM)
4. **Gesture Control**: Trigger capture with hand gestures
5. **Offline Mode**: Cache descriptions for common scenes
6. **AR Overlay**: Direct text overlay on Xreal display

## Development Roadmap

### Phase 1: MVP (Week 1)
- ✅ Basic camera capture
- ✅ Gemini API integration
- ✅ Simple UI
- ⬜ On-device placeholder (TensorFlow.js COCO-SSD)

### Phase 2: Enhancement (Week 2)
- ⬜ Improve on-device model
- ⬜ Add text-to-speech
- ⬜ Optimize UI for Xreal

### Phase 3: Polish (Week 3)
- ⬜ Multi-language support
- ⬜ Performance optimization
- ⬜ User testing & feedback

## Technical Decisions

### Why Vanilla JavaScript?
- **Simplicity**: No build process, no dependencies
- **Performance**: Minimal overhead
- **Deployment**: Single HTML file deployable anywhere
- **Learning**: Easy to understand and modify

### Why Gemini over GPT-4V?
- **Cost**: More generous free tier
- **Speed**: Faster response times (gemini-1.5-flash)
- **API**: Simpler integration
- **Google Ecosystem**: Better for future Google services integration

### Why MediaPipe/TensorFlow.js?
- **Browser Native**: No server required
- **Privacy**: All processing stays on device
- **Latency**: Instant inference (no network round trip)
- **Offline**: Works without internet

## Deployment Options

1. **GitHub Pages**: Free hosting for static site
2. **Netlify/Vercel**: Easy HTTPS setup
3. **Local Server**: For development/testing
4. **Progressive Web App**: Installable on smartphone

## Testing Strategy

1. **Unit Tests**: Test individual functions (frame capture, API calls)
2. **Integration Tests**: Test full flow (camera → VLM → display)
3. **User Testing**: Real-world usage with Xreal glasses
4. **Performance Tests**: Measure latency, battery impact

## Metrics to Track

- **Latency**: Time from capture to description display
- **Accuracy**: Quality of descriptions (user feedback)
- **Battery**: Impact on smartphone battery life
- **API Costs**: Cloud API usage per session
- **User Engagement**: Average session duration
