#!/usr/bin/env node

/**
 * 版本递增脚本（仅 patch）
 * 仅更新 package.json 中的版本号，不执行其他操作
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const packageJsonPath = join(rootDir, 'package.json');

/**
 * 递增 patch 版本号
 */
function incrementPatchVersion(version) {
  const parts = version.split('.');
  const major = parseInt(parts[0], 10);
  const minor = parseInt(parts[1], 10);
  const patch = parseInt(parts[2] || '0', 10);
  return `${major}.${minor}.${patch + 1}`;
}

// 读取 package.json
const content = readFileSync(packageJsonPath, 'utf-8');
const pkg = JSON.parse(content);

// 递增版本
const currentVersion = pkg.version;
const newVersion = incrementPatchVersion(currentVersion);

pkg.version = newVersion;

// 写入 package.json
writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');

console.log(`版本号已更新: ${currentVersion} → ${newVersion}`);
