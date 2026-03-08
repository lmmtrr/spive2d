# Changelog

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
