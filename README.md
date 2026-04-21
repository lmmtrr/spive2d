# Spive2D

English | [日本語](README.ja.md) | [中文](README.zh-cn.md)

https://github.com/user-attachments/assets/c8ad28e7-8414-4153-9585-e8c9a8039354

A desktop application built with Tauri for viewing and interacting with Spine skeletal animations and Live2D models.

**Key Features**:

- 📂 Drag-and-drop model loading (single folder or single compressed file: zip or 7z only)
- 🎭 Dual support for Spine & Live2D models
- 🕹️ Real-time parameter controls
- 🎨 Animation/Skin switching UI
- 🖱️ Mouse interaction support
- 🖥️ Cross-platform (Windows/macOS/Linux)

## ⌨️ Keyboard Shortcuts

| Action                   | Shortcuts                  |
| ------------------------ | -------------------------- |
| 📂 Previous Directory    | `Q`                        |
| 📁 Next Directory        | `W`                        |
| ⏮️ Previous Scene        | `A`                        |
| ⏭️ Next Scene            | `S`                        |
| ◀️ Previous Animation    | `Z`                        |
| ▶️ Next Animation        | `X`                        |
| 📷 Export Image          | `E`                        |
| 🖼️ Export Image Sequence | `D`                        |
| 💾 Export Animation      | `C`                        |
| ⚙️ Open/Close Settings   | `R`                        |
| 📝 Append to List        | `V`                        |
| ❌ Exit                  | `Ctrl/Cmd+W`, `Ctrl/Cmd+Q` |

- **Append to List**: Saves the current scene text to a list. See [`py/copy_by_list.py`](py/copy_by_list.py) for processing the exported list.

## 🍎 Note for macOS Users

If the application displays a message saying it is damaged and cannot be opened, you may need to remove the quarantine attribute. Run the following command in your terminal:

```bash
xattr -dr com.apple.quarantine /path/to/spive2d_aarch64.app
```

## 🐧 Note for Linux Users

**GUI Method**:
To run the executable file, please turn on the **"Executable as Program"** toggle switch in the file properties and execute it with **"Run as a Program"**.

**Terminal Method**:
Alternatively, you can grant execution permission and run the application from the terminal:

```bash
chmod +x /path/to/spive2d_linux_x64
./spive2d_linux_x64
```

## 🚀 Development

To set up a local development environment, you'll need to install the following tools.

**Prerequisites:**

- **Bun**: [Install Bun](https://bun.sh)
- **Rust**: [Install Rust](https://www.rust-lang.org/tools/install)
- **Tauri**: Follow the [Tauri setup guide](https://v2.tauri.app/start/prerequisites/) for your specific OS.

**Setup Steps:**

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/lmmtrr/spive2d.git
    cd spive2d
    ```

2.  **Install dependencies:**

    ```bash
    bun install
    ```

3.  **Run the development server:**

    ```bash
    bun run tauri dev
    ```

4.  **Build the application:**

    ```bash
    bun run tauri build
    ```

### 🧪 Testing

Run unit tests and E2E tests:

```bash
# Run Unit tests
bun run test:unit

# Run E2E tests
bun run test:e2e:attachment
bun run test:e2e:background
bun run test:e2e:export
bun run test:e2e:live2d
bun run test:e2e:playback
bun run test:e2e:resize
bun run test:e2e:switch
bun run test:e2e:vreg

# Run all tests (Unit + All E2E)
bun run test
```

## 🌐 Supported Versions

**🦴 Spine Runtimes:**

- Spine 3.6-4.2

**🎭 Live2D Cubism:**

- Cubism 2.1
- Cubism 4.x

## 📦 Dependencies

- [Tauri](https://github.com/tauri-apps/tauri) ([MIT](https://github.com/tauri-apps/tauri/blob/dev/LICENSE_MIT))
- [Spine Runtimes](https://github.com/EsotericSoftware/spine-runtimes) ([LICENSE](https://github.com/EsotericSoftware/spine-runtimes/blob/master/LICENSE))
- [pixi-live2d-display](https://github.com/guansss/pixi-live2d-display) ([MIT](https://github.com/guansss/pixi-live2d-display/blob/master/LICENSE))

## 📄 Licenses

[MIT License](https://github.com/lmmtrr/spive2d/blob/main/LICENSE)
