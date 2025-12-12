// LiveLens Configuration
// 設定: Gemini API キーをここに設定してください

const CONFIG = {
    // Gemini API Settings
    GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY_HERE', // ⚠️ ここにAPIキーを入力
    GEMINI_MODEL: 'gemini-1.5-flash',
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models',

    // Capture Settings
    DEFAULT_INTERVAL: 2000, // ミリ秒 (デフォルト: 2秒)
    IMAGE_QUALITY: 0.8,     // JPEG品質 (0.0 - 1.0)
    IMAGE_MAX_WIDTH: 640,   // 最大幅 (ピクセル)

    // On-device Model Settings
    // TensorFlow.js COCO-SSD モデル
    TFJS_MODEL_URL: 'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd',

    // Prompt Settings
    DESCRIPTION_PROMPT: '画像に映っているものを日本語で簡潔に説明してください。',
    
    // UI Settings
    MAX_DESCRIPTIONS: 10,   // 表示する最大記述数
};

// ⚠️ 重要: このファイルは.gitignoreに追加して、APIキーをGitにコミットしないでください
// 本番環境では環境変数を使用することを推奨します
