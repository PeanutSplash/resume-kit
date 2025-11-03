# Changelog

## [0.1.2] - 2025-11-03

### Fixed
- improve CHANGELOG extraction logic in release workflow and script

### Other
- chore: add 'dist/' directory to .gitignore to prevent build artifacts from being tracked

## [0.1.1] - 2025-11-03

### Added
- add release automation scripts, CHANGELOG, and GitHub Actions workflow for npm publishing and version management

### Changed
- update component names from 'mr-' to 'rk-' in API documentation and source files for consistency. Update README and TypeScript definitions accordingly.

### Fixed
- correct regex in update-changelog script to properly clean commit messages

### Other
- chore: update release date in CHANGELOG for version 0.1.0
- init commit

# Changelog

所有重要的项目变更都会记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [0.1.0] - 2025-11-03

### Added
- 初始版本发布
- 支持基本信息、教育背景、工作经验、项目经验、技能等核心模块
- 提供三种内置模板：classic、modern、timeline
- 完整的 TypeScript 类型支持
- 基于 Lit 和 Tailwind CSS 构建

