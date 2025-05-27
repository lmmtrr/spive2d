# Spive2D

https://github.com/user-attachments/assets/6157b44d-3c8c-4b9c-9545-b919afdf4d02

A desktop application built with Tauri for viewing and interacting with Spine skeletal animations and Live2D models.

**Key Features**:

- 📂 Drag-and-drop model loading (single folder or single compressed file: zip or 7z only)
  - **Note: Loading from compressed files is slow and not recommended.**
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

- Spine 3.6-4.2 (.json & .skel)

**🎭 Live2D Cubism:**

- Cubism 2.1 (.model.json)
- Cubism 4.x (.model3.json)

## 📦 Dependencies

- [Tauri](https://github.com/tauri-apps/tauri) ([MIT](https://github.com/tauri-apps/tauri/blob/dev/LICENSE_MIT))
- [Spine Runtimes](https://github.com/EsotericSoftware/spine-runtimes) ([LICENSE](https://github.com/EsotericSoftware/spine-runtimes/blob/master/LICENSE))
- [pixi-live2d-display](https://github.com/guansss/pixi-live2d-display) ([MIT](https://github.com/guansss/pixi-live2d-display/blob/master/LICENSE))

## 📄 Licenses

[MIT License](https://github.com/lmmtrr/spive2d/blob/main/LICENSE)
