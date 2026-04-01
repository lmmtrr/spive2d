# Spive2D

[English](README.md) | 日本語 | [中文](README.zh-cn.md)

https://github.com/user-attachments/assets/c8ad28e7-8414-4153-9585-e8c9a8039354

Spine スケルタルアニメーションと Live2D モデルを表示・操作するための Tauri 製デスクトップアプリケーションです。

**主な機能**:

- 📂 ドラッグ＆ドロップでモデルを読み込み（単一フォルダまたは単一圧縮ファイル：zip・7z のみ）
- 🎭 Spine と Live2D の両方に対応
- 🕹️ リアルタイムパラメータ制御
- 🎨 アニメーション/スキン切り替えUI
- 🖱️ マウスインタラクション対応
- 🖥️ クロスプラットフォーム (Windows/macOS/Linux)

## ⌨️ キーボードショートカット

| 操作                    | ショートカット             |
| ----------------------- | -------------------------- |
| 📂 前のディレクトリ     | `Q`                        |
| 📁 次のディレクトリ     | `W`                        |
| ⏮️ 前のシーン           | `A`                        |
| ⏭️ 次のシーン           | `S`                        |
| ◀️ 前のアニメーション   | `Z`                        |
| ▶️ 次のアニメーション   | `X`                        |
| 📷 画像を書出           | `R`                        |
| 🖼️ 連番画像を書出       | `D`                        |
| 💾 アニメーションを書出 | `C`                        |
| ⚙️ 設定を開く/閉じる    | `E`                        |
| 📝 リストに追加         | `V`                        |
| ❌ 終了                 | `Ctrl/Cmd+W`, `Ctrl/Cmd+Q` |

- **リストに追加**: 現在のシーンテキストをリストに保存します。エクスポートされたリストの処理については [`py/copy_by_list.py`](py/copy_by_list.py) を参照してください。

## 🍎 macOSユーザー向け

「アプリが壊れているため開けません」等のメッセージが表示されて起動できない場合は、ターミナルで以下のコマンドを実行してquarantine（隔離）属性を解除してください。

```bash
xattr -dr com.apple.quarantine /path/to/spive2d_aarch64.app
```

## 🐧 Linuxユーザー向け

**GUIでの実行**:
実行ファイルを実行するには、ファイルのプロパティ等で「**プログラムとして実行可能 (Executable as Program)**」のトグルスイッチをオンにして、「**プログラムとして実行 (Run as a Program)**」から実行してください。

**ターミナルでの実行**:
または、ターミナルから実行権限を付与して起動することもできます。

```bash
chmod +x /path/to/spive2d_linux_x64
./spive2d_linux_x64
```

## 🚀 開発

ローカル開発環境を構築するには、以下のツールをインストールしてください。

**前提条件:**

- **Bun**: [Bun のインストール](https://bun.sh)
- **Rust**: [Rust のインストール](https://www.rust-lang.org/ja/tools/install)
- **Tauri**: お使いのOSに合わせて [Tauri セットアップガイド](https://v2.tauri.app/start/prerequisites/) を参照してください。

**セットアップ手順:**

1.  **リポジトリをクローン:**

    ```bash
    git clone https://github.com/lmmtrr/spive2d.git
    cd spive2d
    ```

2.  **依存関係をインストール:**

    ```bash
    bun install
    ```

3.  **開発サーバーを起動:**

    ```bash
    bun run tauri dev
    ```

4.  **アプリケーションをビルド:**

    ```bash
    bun run tauri build
    ```

## 🌐 対応バージョン

**🦴 Spine ランタイム:**

- Spine 3.6-4.2

**🎭 Live2D Cubism:**

- Cubism 2.1
- Cubism 4.x

## 📦 依存関係

- [Tauri](https://github.com/tauri-apps/tauri) ([MIT](https://github.com/tauri-apps/tauri/blob/dev/LICENSE_MIT))
- [Spine Runtimes](https://github.com/EsotericSoftware/spine-runtimes) ([LICENSE](https://github.com/EsotericSoftware/spine-runtimes/blob/master/LICENSE))
- [pixi-live2d-display](https://github.com/guansss/pixi-live2d-display) ([MIT](https://github.com/guansss/pixi-live2d-display/blob/master/LICENSE))

## 📄 ライセンス

[MIT ライセンス](https://github.com/lmmtrr/spive2d/blob/main/LICENSE)
