# 发布脚本说明

本目录包含用于自动化 npm 发布、版本管理和 GitHub Release 的脚本。

## 脚本文件

- `release.js` - 主发布脚本，执行完整的发布流程
- `update-changelog.js` - CHANGELOG 更新脚本
- `create-github-release.js` - GitHub Release 创建脚本
- `version-patch.js` - 版本号递增脚本（仅 patch）

## 使用方法

### 完整发布流程

```bash
pnpm release
```

这会执行：
1. 自动递增 patch 版本号（如 0.1.0 → 0.1.1）
2. 更新 CHANGELOG.md
3. 构建项目
4. 提交更改并创建 Git tag
5. 推送到远程仓库
6. 发布到 npm
7. 创建 GitHub Release

### 仅准备发布（不发布到 npm 和 GitHub）

```bash
pnpm release:prep
```

### 仅发布到 npm（假设版本已更新）

```bash
pnpm release:only
```

### 仅递增版本号

```bash
pnpm version:patch
```

### 手动更新 CHANGELOG

```bash
pnpm changelog
# 或指定版本
pnpm changelog 0.1.1
```

## 命令行选项

`release.js` 支持以下选项：

- `--skip-npm` - 跳过 npm 发布
- `--skip-github` - 跳过 GitHub Release 创建
- `--dry-run` - 模拟运行，不执行实际操作

示例：

```bash
# 只创建 Git tag，不发布到 npm
pnpm release --skip-npm

# 完整发布但不创建 GitHub Release
pnpm release --skip-github

# 模拟运行，查看将要执行的操作
pnpm release --dry-run
```

## 前置要求

### npm 发布
- 需要登录 npm：`npm login`
- 需要 npm token（如果使用 CI/CD）

### GitHub Release
- 需要安装 GitHub CLI：https://cli.github.com/
- 需要登录：`gh auth login`

### Git
- 工作目录必须是干净的（无未提交的更改）
- 需要配置 Git 用户名和邮箱

## GitHub Actions 自动发布

项目包含 `.github/workflows/release.yml`，当推送 tag（格式：`v*`）时会自动：

1. 构建项目
2. 发布到 npm
3. 创建 GitHub Release

使用方法：

```bash
# 本地创建 tag 并推送
git tag v0.1.1
git push origin v0.1.1
```

GitHub Actions 会自动处理后续的构建和发布流程。

## 注意事项

- 发布前确保所有更改已提交
- 确保已构建最新的代码
- 版本号会自动递增 patch 版本
- CHANGELOG 会自动从 Git 提交历史生成

