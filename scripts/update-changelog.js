#!/usr/bin/env node

/**
 * CHANGELOG 更新脚本
 * 解析 Git 提交历史并更新 CHANGELOG.md
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const changelogPath = join(rootDir, 'CHANGELOG.md');

/**
 * 获取 Git 提交历史（自上次 tag 以来的提交）
 */
function getCommitsSinceLastTag() {
  try {
    // 获取最新的 tag
    let lastTag;
    try {
      lastTag = execSync('git describe --tags --abbrev=0', {
        encoding: 'utf-8',
        cwd: rootDir,
        stdio: 'pipe'
      }).trim();
    } catch (error) {
      // 如果没有 tag，获取所有提交
      lastTag = null;
    }

    // 获取自上次 tag 以来的提交
    const gitLogCommand = lastTag
      ? `git log ${lastTag}..HEAD --pretty=format:"%h|%s|%ad" --date=short`
      : 'git log --pretty=format:"%h|%s|%ad" --date=short';

    const commits = execSync(gitLogCommand, {
      encoding: 'utf-8',
      cwd: rootDir,
      stdio: 'pipe'
    })
      .trim()
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [hash, ...messageParts] = line.split('|');
        const message = messageParts.slice(0, -1).join('|');
        const date = messageParts[messageParts.length - 1];
        return { hash, message, date };
      })
      .filter(commit => {
        // 过滤掉版本相关的提交
        return !commit.message.match(/^(chore|release|version):\s*(bump|version)/i);
      });

    return commits;
  } catch (error) {
    console.error('无法获取 Git 提交历史:', error.message);
    return [];
  }
}

/**
 * 分类提交消息
 */
function categorizeCommits(commits) {
  const categories = {
    Added: [],
    Changed: [],
    Fixed: [],
    Removed: [],
    Other: []
  };

  commits.forEach(commit => {
    const message = commit.message.toLowerCase();
    
    if (message.match(/^(add|feat|new):/)) {
      categories.Added.push(commit);
    } else if (message.match(/^(change|update|refactor|improve):/)) {
      categories.Changed.push(commit);
    } else if (message.match(/^(fix|bugfix):/)) {
      categories.Fixed.push(commit);
    } else if (message.match(/^(remove|delete|deprecate):/)) {
      categories.Removed.push(commit);
    } else {
      categories.Other.push(commit);
    }
  });

  return categories;
}

/**
 * 生成版本条目
 */
function generateVersionEntry(version, commits) {
  const today = new Date().toISOString().split('T')[0];
  const categories = categorizeCommits(commits);
  
  let entry = `## [${version}] - ${today}\n\n`;

  // 如果没有提交，添加默认说明
  if (commits.length === 0) {
    entry += '- 版本更新\n\n';
    return entry;
  }

  // 按分类输出
  const categoryLabels = {
    Added: '### Added',
    Changed: '### Changed',
    Fixed: '### Fixed',
    Removed: '### Removed'
  };

  let hasContent = false;
  for (const [key, label] of Object.entries(categoryLabels)) {
    if (categories[key].length > 0) {
      entry += `${label}\n`;
      categories[key].forEach(commit => {
        // 清理提交消息，移除类型前缀
        const cleanMessage = commit.message.replace(/^(add|feat|new|change|update|refactor|improve|fix|bugfix|remove|delete|deprecate):\s*/i, '').trim();
        entry += `- ${cleanMessage}\n`;
      });
      entry += '\n';
      hasContent = true;
    }
  }

  // 其他提交
  if (categories.Other.length > 0 && hasContent) {
    entry += `### Other\n`;
    categories.Other.forEach(commit => {
      entry += `- ${commit.message}\n`;
    });
    entry += '\n';
  } else if (!hasContent) {
    // 如果只有 Other 类型的提交，直接列出
    categories.Other.forEach(commit => {
      entry += `- ${commit.message}\n`;
    });
    entry += '\n';
  }

  return entry;
}

/**
 * 更新 CHANGELOG.md
 */
export default async function updateChangelog(version) {
  // 获取提交历史
  const commits = getCommitsSinceLastTag();
  console.log(`找到 ${commits.length} 个提交`);

  // 生成新版本条目
  const newEntry = generateVersionEntry(version, commits);

  // 读取现有 CHANGELOG
  let changelogContent = '';
  try {
    changelogContent = readFileSync(changelogPath, 'utf-8');
  } catch (error) {
    // 如果文件不存在，创建新的
    changelogContent = '# Changelog\n\n';
    changelogContent += '所有重要的项目变更都会记录在此文件中。\n\n';
    changelogContent += '格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，\n';
    changelogContent += '版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。\n\n';
  }

  // 在文件开头（# Changelog 之后）插入新条目
  const headerMatch = changelogContent.match(/^(# Changelog\n+)(.*)/s);
  if (headerMatch) {
    changelogContent = headerMatch[1] + newEntry + headerMatch[2];
  } else {
    changelogContent = '# Changelog\n\n' + newEntry + changelogContent;
  }

  // 写入文件
  writeFileSync(changelogPath, changelogContent, 'utf-8');
}

// 如果直接运行此脚本（检查是否为直接调用）
const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
                     import.meta.url.replace('file:///', '').replace(/\\/g, '/') === process.argv[1].replace(/\\/g, '/');
if (isMainModule) {
  const version = process.argv[2] || (() => {
    // 如果没有提供版本，从 package.json 读取
    try {
      const pkg = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf-8'));
      return pkg.version;
    } catch (error) {
      console.error('无法读取 package.json');
      process.exit(1);
    }
  })();
  
  if (!version) {
    console.error('用法: node update-changelog.js [version]');
    console.error('如果未提供版本，将从 package.json 读取');
    process.exit(1);
  }
  
  updateChangelog(version).then(() => {
    console.log('✅ CHANGELOG 已更新');
  }).catch((error) => {
    console.error('❌ 更新失败:', error.message);
    process.exit(1);
  });
}
