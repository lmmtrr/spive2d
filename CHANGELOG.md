# Changelog

## [0.1.16] - 2026-03-20

### Added

- Reactive character transform and redesigned export UI
- Overhauled export preview with interactive zoom, pan, and full model context

### Fixed

- Robustness of Spine skeleton version detection
- Included margins in export preview rendering

## [0.1.15] - 2026-03-16

### Fixed

- Resolve missing spine attachments and UI state retention across models

## [0.1.14] - 2026-03-16

### Fixed

- Ignore per-curve fade times during export to prevent static frames

## [0.1.13] - 2026-03-15

### Fixed

- Resolve race conditions in Live2D renderer during rapid scene changes
- Filter out 0-duration animations to prevent application freezes

## [0.1.12] - 2026-03-15

### Fixed

- Re-published release due to immutable release constraints that affected v0.1.11 availability

## [0.1.11] - 2026-03-15

### Added

- Export preview in settings dialog
- Custom scale and separate margins support for export
- Unified export notifications into queue with refined status UI

### Fixed

- Improved export accuracy by synchronizing renderer state and capturing zoom/pan
- Fixed application of parameter and skin changes during export

### Changed

- Updated keyboard shortcuts for export and toggle

## [0.1.10] - 2026-03-11

### Added

- Background export system with queue and worker support
- Ctrl/Cmd+W and Ctrl/Cmd+Q shortcuts to exit application
- Auto-detection of Spine skeleton format from file content
- Support for .asset file extension
- On-the-fly resizing of atlas textures to match declared sizes

## [0.1.9] - 2026-03-09

### Fixed

- Prevent animation controller from shrinking below its content size
- Fix canvas flash on scene switch
- Gracefully handle missing atlas regions in Spine skeleton loading

## [0.1.8] - 2026-03-06

### Fixed

- Resolve memory leaks, race conditions, and potential crashes

## [0.1.7] - 2026-03-05

### Fixed

- Update and filter attachment checkboxes dynamically based on active skins and current animation
- Allow trailing commas in Spine JSON data

## [0.1.6] - 2026-03-05

### Fixed

- Prevent Drawables from disappearing when switching property categories

## [0.1.5] - 2026-03-05

### Fixed

- Prevent permanent loss of drawables when toggling parts
- Reapply animation when changing alpha mode

## [0.1.4] - 2026-03-03

### Fixed

- Prevent permanent loss of attachments when toggling skins
- Prevent overlapping models on rapid scene changes

## [0.1.3] - 2026-03-03

### Added

- Persist selected animation across scenes
- Persist selected skins across scenes
- Update dimensions dynamically on window resize and scene change

### Fixed

- Calculate bounds accurately regardless of selected skin
- Resolve NaN dimensions when filter is MipMap

## [0.1.2] - 2026-03-03

### Fixed

- Fix initial display of hidden attachments

## [0.1.1] - 2026-03-01

### Fixed

- Fixed error during export

## [0.1.0] - 2026-03-01

### Changed

- Rewritten in Svelte
