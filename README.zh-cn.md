# Spive2D

[English](README.md) | [日本語](README.ja.md) | 中文

https://github.com/user-attachments/assets/223c1507-fcc5-4636-81cc-fcee7f07db1b

一款使用 Tauri 构建的桌面应用程序，用于查看 Spine 骨骼动画和 Live2D 模型并与之交互。

**主要功能**:

- 📂 拖放加载模型（单个文件夹或单个压缩文件：仅限 zip 或 7z）
- 🎭 同时支持 Spine 和 Live2D 模型
- 🕹️ 实时参数控制
- 🎨 动画/皮肤切换界面
- 🖱️ 支持鼠标交互
- 🖥️ 跨平台 (Windows/macOS/Linux)

## ⌨️ 键盘快捷键

| 操作             | 快捷键                     |
| ---------------- | -------------------------- |
| 📂 上一个目录    | `Q`                        |
| 📁 下一个目录    | `W`                        |
| ⏮️ 上一个场景    | `A`                        |
| ⏭️ 下一个场景    | `S`                        |
| ◀️ 上一个动画    | `Z`                        |
| ▶️ 下一个动画    | `X`                        |
| 📷 导出图像      | `R`                        |
| 🖼️ 导出图像序列  | `D`                        |
| 💾 导出动画      | `C`                        |
| ⚙️ 打开/关闭设置 | `E`                        |
| 📝 添加到列表    | `V`                        |
| ❌ 退出     | `Ctrl/Cmd+W`, `Ctrl/Cmd+Q` |

- **添加到列表**: 将当前场景文本保存到列表中。请参考 [`py/copy_by_list.py`](py/copy_by_list.py) 来处理导出的列表。

## 🍎 macOS 用户须知

如果提示应用“已损坏，无法打开”，您可能需要移除隔离属性 (quarantine)。请在终端中运行以下命令：

```bash
xattr -dr com.apple.quarantine /path/to/spive2d_aarch64.app
```

## 🐧 Linux 用户须知

**GUI 方法**:
要运行可执行文件，请在文件属性中打开“**允许作为程序执行文件 (Executable as Program)**”的开关，然后选择“**作为程序运行 (Run as a Program)**”。

**终端方法**:
或者，您可以通过终端授予执行权限并运行该应用程序：

```bash
chmod +x /path/to/spive2d_linux_x64
./spive2d_linux_x64
```

## 🚀 开发

要设置本地开发环境，您需要安装以下工具。

**环境准备:**

- **Node.js & npm**: [下载并安装](https://nodejs.org/zh-cn/download)
  - _另请参阅: [npm 文档](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)_
- **Rust**: [安装 Rust](https://www.rust-lang.org/zh-CN/tools/install)
- **Tauri**: 根据您的操作系统，遵循 [Tauri 设置指南](https://v2.tauri.app/zh-cn/start/prerequisites/)。

**设置步骤:**

1.  **克隆仓库:**

    ```bash
    git clone https://github.com/lmmtrr/spive2d.git
    cd spive2d
    ```

2.  **安装依赖:**

    ```bash
    npm install
    ```

3.  **运行开发服务器:**

    ```bash
    npm run tauri dev
    ```

4.  **构建应用程序:**

    ```bash
    npm run tauri build
    ```

## 🌐 支持版本

**🦴 Spine 运行时:**

- Spine 3.6-4.2

**🎭 Live2D Cubism:**

- Cubism 2.1
- Cubism 4.x

## 📦 依赖项

- [Tauri](https://github.com/tauri-apps/tauri) ([MIT](https://github.com/tauri-apps/tauri/blob/dev/LICENSE_MIT))
- [Spine Runtimes](https://github.com/EsotericSoftware/spine-runtimes) ([LICENSE](https://github.com/EsotericSoftware/spine-runtimes/blob/master/LICENSE))
- [pixi-live2d-display](https://github.com/guansss/pixi-live2d-display) ([MIT](https://github.com/guansss/pixi-live2d-display/blob/master/LICENSE))

## 📄 许可证

[MIT 许可证](https://github.com/lmmtrr/spive2d/blob/main/LICENSE)
