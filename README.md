# Spive2D

https://github.com/user-attachments/assets/2d333ede-a796-4f9f-a928-037dc6d1994b

A desktop application built with Tauri for viewing and interacting with Spine skeletal animations and Live2D models.

**Key Features**:

- 📂 Drag-and-drop model loading (single folder or single compressed file: zip or 7z only)
- 🎭 Dual support for Spine & Live2D models
- 🕹️ Real-time parameter controls
- 🎨 Animation/Skin switching UI
- 🖱️ Mouse interaction support
- 🖥️ Cross-platform (Windows/macOS/Linux)

## ⌨️ Keyboard Shortcuts

| Action                           | Shortcuts |
| -------------------------------- | --------- |
| 📂 Previous Directory            | `Q`       |
| 📁 Next Directory                | `W`       |
| ⏮️ Previous Scene                | `A`       |
| ⏭️ Next Scene                    | `S`       |
| ◀️ Previous Animation            | `Z`       |
| ▶️ Next Animation                | `X`       |
| 📷 Screenshots                   | `D`       |
| 💾 Export Animation (Spine only) | `C`       |

## 🚀 Development

1. Clone the repository:

   ```bash
   git clone https://github.com/lmmtrr/spive2d.git
   cd spive2d
   ```

2. Install dependencies:

   ```bash
   npm i
   ```

3. Start development server:

   ```bash
   npm run tauri dev
   ```

4. Package the application:

   ```bash
   npm run tauri build
   ```

## 🌐 Supported Versions

**🦴 Spine Runtimes:**

✅ Supported Formats:

- Spine 3.6-3.7 (.json only)

- Spine 3.8.xx (excludes 3.8.75)

- Spine 4.0-4.2 (.json & .skel)

🚫 Unsupported:

- Versions below 3.6

- Spine 3.6-3.7 binary (.skel)

- Spine 3.8.75 specifically

**🎭 Live2D Cubism:**

- Cubism 2.1 models (.model.json)
- Cubism 4.x models (.model3.json)

## 📦 Dependencies

- [Tauri](https://github.com/tauri-apps/tauri) ([MIT](https://github.com/tauri-apps/tauri/blob/dev/LICENSE_MIT))
- [Spine Runtimes](https://github.com/EsotericSoftware/spine-runtimes) ([LICENSE](https://github.com/EsotericSoftware/spine-runtimes/blob/master/LICENSE))
- [pixi-live2d-display](https://github.com/guansss/pixi-live2d-display) ([MIT](https://github.com/guansss/pixi-live2d-display/blob/master/LICENSE))

## 📄 Licenses

[MIT License](https://github.com/lmmtrr/spive2d/blob/main/LICENSE)
