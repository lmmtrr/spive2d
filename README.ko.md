# Spive2D

[English](README.md) | [日本語](README.ja.md) | 한국어 | [中文](README.zh-cn.md)

https://github.com/user-attachments/assets/c20288f2-75a5-4f1f-b8df-4532e65a2f7b

Spine 스켈레탈 애니메이션과 Live2D 모델을 확인하고 조작할 수 있는 Tauri 기반 데스크톱 애플리케이션입니다.

**주요 기능**:

- 📂 드래그 앤 드롭으로 모델 불러오기 (단일 폴더 또는 단일 압축 파일: zip, 7z만 지원)
- 📦 Unity 리소스 파일의 직접 불러오기/해제 지원
- 🎭 Spine, Live2D 및 Layered Sprite (Unity 파일 전용) 모델 3가지 방식 지원
- 🔍 아틀라스 이미지에서 알파 모드 자동 감지 (PMA와 UNPACK 중에서만 선택되며, 지정된 NPM 설정은 덮어쓰지 않음)

## ⌨️ 키보드 단축키

| 조작                     | 단축키                     |
| ------------------------ | -------------------------- |
| 📂 이전 디렉토리         | `Q`                        |
| 📁 다음 디렉토리         | `W`                        |
| ⏮️ 이전 씬               | `A`                        |
| ⏭️ 다음 씬               | `S`                        |
| ◀️ 이전 애니메이션       | `Z`                        |
| ▶️ 다음 애니메이션       | `X`                        |
| 📷 이미지 내보내기       | `E`                        |
| 🖼️ 연속 이미지 내보내기   | `D`                        |
| 💾 애니메이션 내보내기   | `C`                        |
| 🦴 모델 파일 내보내기     | `R`                        |
| ⚙️ 설정 열기/닫기        | `F`                        |
| 📝 목록에 추가           | `V`                        |
| 🖥️ 전체 화면 전환        | `F11`                      |
| ❌ 종료                  | `Ctrl/Cmd+W`, `Ctrl/Cmd+Q` |

- **목록에 추가**: 현재 씬 텍스트를 목록에 저장합니다. 내보낸 목록 처리에 대한 내용은 [`py/copy_by_list.py`](py/copy_by_list.py)를 참조하세요.

## 🍎 macOS 사용자 안내

앱이 손상되어 열 수 없다는 메시지가 표시되는 경우 격리(quarantine) 속성을 제거해야 할 수 있습니다. 터미널에서 다음 명령을 실행하세요:

```bash
xattr -dr com.apple.quarantine /path/to/spive2d_aarch64.app
```

## 🐧 Linux 사용자 안내

**GUI 방법**:
실행 파일을 실행하려면 파일 속성에서 **"프로그램으로 실행 가능 (Executable as Program)"** 토글 스위치를 켜고 **"프로그램으로 실행 (Run as a Program)"**으로 실행하세요.

**터미널 방법**:
또는 터미널에서 실행 권한을 부여하고 애플리케이션을 실행할 수 있습니다:

```bash
chmod +x /path/to/spive2d_linux_x64
./spive2d_linux_x64
```

## 🚀 개발

로컬 개발 환경을 구축하려면 다음 도구를 설치해야 합니다.

**사전 요구 사항:**

- **Bun**: [Bun 설치](https://bun.sh)
- **Rust**: [Rust 설치](https://www.rust-lang.org/ko/tools/install)
- **Tauri**: 사용 중인 OS에 맞춰 [Tauri 설치 가이드](https://v2.tauri.app/start/prerequisites/)를 참조하세요.

**설치 단계:**

1.  **리포지토리 클론:**

    ```bash
    git clone https://github.com/lmmtrr/spive2d.git
    cd spive2d
    ```

2.  **의존성 설치:**

    ```bash
    bun install
    ```

3.  **개발 서버 실행:**

    ```bash
    bun run tauri dev
    ```

4.  **애플리케이션 빌드:**

    ```bash
    bun run tauri build
    ```

## 🌐 지원 버전

**🦴 Spine 런타임:**

- Spine 3.6-4.3

**🎭 Live2D Cubism:**

- Cubism 2.1
- Cubism 3.x - 5.x

**🖼️ Layered Sprite:**

- Unity Sprite / RectTransform 번들 파일

## 📦 의존성

- [Tauri](https://github.com/tauri-apps/tauri) ([MIT](https://github.com/tauri-apps/tauri/blob/dev/LICENSE_MIT))
- [Spine Runtimes](https://github.com/EsotericSoftware/spine-runtimes) ([LICENSE](https://github.com/EsotericSoftware/spine-runtimes/blob/master/LICENSE))
- [untitled-pixi-live2d-engine](https://github.com/Untitled-Story/untitled-pixi-live2d-engine) ([MIT](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/main/LICENSE))

## 📄 라이선스

[MIT 라이선스](https://github.com/lmmtrr/spive2d/blob/main/LICENSE)
