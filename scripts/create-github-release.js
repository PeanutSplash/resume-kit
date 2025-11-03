#!/usr/bin/env node

/**
 * GitHub Release 创建脚本
 * 使用 GitHub CLI 创建 Release
 */

import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const changelogPath = join(rootDir, 'CHANGELOG.md');

/**
 * 检查 GitHub CLI 是否安装
 */
function checkGitHubCLI() {
  try {
    execSync('gh --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 从 CHANGELOG 中提取版本内容
 */
function extractVersionNotes(version) {
  try {
    const changelog = readFileSync(changelogPath, 'utf-8');
    
    // 匹配版本条目 (## [version] - date ... 到下一个 ## 或文件结尾)
    const versionPattern = new RegExp(
      `## \\[${version.replace(/\./g, '\\.')}\\] - [^\\n]+\\n\\n((?:[^#]|#(?!##))*?)(?=## |$)`,
      's'
    );
    
    const match = changelog.match(versionPattern);
    if (match && match[1]) {
      return match[1].trim();
    }
    
    return `Release ${version}`;
  } catch (error) {
    console.warn('无法读取 CHANGELOG，使用默认内容');
    return `Release ${version}`;
  }
}

/**
 * 创建 GitHub Release
 */
export default async function createGitHubRelease(version) {
  // 检查 GitHub CLI
  if (!checkGitHubCLI()) {
    throw new Error(
      'GitHub CLI (gh) 未安装。请安装: https://cli.github.com/\n' +
      '安装后运行: gh auth login'
    );
  }

  // 检查是否已登录
  try {
    execSync('gh auth status', { 
      stdio: 'ignore',
      cwd: rootDir 
    });
  } catch (error) {
    throw new Error(
      '未登录 GitHub CLI。请运行: gh auth login'
    );
  }

  // 获取版本说明
  const releaseNotes = extractVersionNotes(version);
  
  // 创建临时文件存储 release notes
  const tempNotesPath = join(rootDir, '.release-notes.tmp');
  const { writeFileSync, unlinkSync } = await import('fs');
  writeFileSync(tempNotesPath, releaseNotes, 'utf-8');

  try {
    // 使用 GitHub CLI 创建 Release
    console.log(`创建 GitHub Release v${version}...`);
    
    const command = `gh release create v${version} --title "v${version}" --notes-file "${tempNotesPath}"`;
    
    execSync(command, {
      stdio: 'inherit',
      cwd: rootDir
    });

    console.log(`✅ GitHub Release v${version} 创建成功`);
  } catch (error) {
    console.error('创建 GitHub Release 失败:', error.message);
    throw error;
  } finally {
    // 清理临时文件
    try {
      unlinkSync(tempNotesPath);
    } catch (error) {
      // 忽略删除失败
    }
  }
}

// 如果直接运行此脚本（检查是否为直接调用）
const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
                     import.meta.url.replace('file:///', '').replace(/\\/g, '/') === process.argv[1].replace(/\\/g, '/');
if (isMainModule) {
  const version = process.argv[2];
  if (!version) {
    console.error('用法: node create-github-release.js <version>');
    process.exit(1);
  }
  
  createGitHubRelease(version).catch((error) => {
    console.error('❌ 创建失败:', error.message);
    process.exit(1);
  });
}
