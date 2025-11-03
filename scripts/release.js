#!/usr/bin/env node

/**
 * 主发布脚本
 * 执行完整的发布流程：版本递增、构建、提交、打 tag、推送、发布到 npm、创建 GitHub Release
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import updateChangelog from './update-changelog.js';
import createGitHubRelease from './create-github-release.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const packageJsonPath = join(rootDir, 'package.json');

/**
 * 读取 package.json
 */
function readPackageJson() {
  const content = readFileSync(packageJsonPath, 'utf-8');
  return JSON.parse(content);
}

/**
 * 写入 package.json
 */
function writePackageJson(pkg) {
  writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
}

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

/**
 * 执行 shell 命令
 */
function exec(command, options = {}) {
  try {
    execSync(command, { 
      stdio: 'inherit', 
      cwd: rootDir,
      ...options 
    });
    return true;
  } catch (error) {
    console.error(`错误: ${command} 执行失败`);
    throw error;
  }
}

/**
 * 检查是否有未提交的更改
 */
function checkCleanWorkingDirectory() {
  try {
    const status = execSync('git status --porcelain', { 
      encoding: 'utf-8',
      cwd: rootDir 
    }).trim();
    
    if (status) {
      console.error('❌ 工作目录有未提交的更改，请先提交或暂存所有更改');
      console.error(status);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ 无法检查 Git 状态');
    throw error;
  }
}

/**
 * 检查是否为 Git 仓库
 */
function checkGitRepo() {
  try {
    execSync('git rev-parse --git-dir', { 
      stdio: 'ignore',
      cwd: rootDir 
    });
  } catch (error) {
    console.error('❌ 当前目录不是 Git 仓库');
    process.exit(1);
  }
}

/**
 * 检查构建产物是否存在
 */
async function checkBuildOutput() {
  const distPath = join(rootDir, 'dist');
  try {
    const fs = await import('fs/promises');
    const stats = await fs.stat(distPath);
    if (!stats.isDirectory()) {
      throw new Error('dist 不是目录');
    }
  } catch (error) {
    console.error('❌ dist 目录不存在，请先运行 pnpm build');
    process.exit(1);
  }
}

/**
 * 主发布流程
 */
async function main() {
  const args = process.argv.slice(2);
  const skipNpm = args.includes('--skip-npm');
  const skipGithub = args.includes('--skip-github');
  const dryRun = args.includes('--dry-run');

  console.log('🚀 开始发布流程...\n');

  // 检查 Git 仓库
  checkGitRepo();

  // 读取当前版本
  const pkg = readPackageJson();
  const currentVersion = pkg.version;
  console.log(`📦 当前版本: ${currentVersion}`);

  // 递增版本
  const newVersion = incrementPatchVersion(currentVersion);
  console.log(`📈 新版本: ${newVersion}\n`);

  if (dryRun) {
    console.log('🔍 模拟运行模式 - 不会实际执行任何操作');
    console.log(`将会执行的操作:`);
    console.log(`  1. 更新版本号: ${currentVersion} → ${newVersion}`);
    console.log(`  2. 更新 CHANGELOG.md`);
    console.log(`  3. 构建项目 (pnpm build)`);
    console.log(`  4. 提交更改 (git commit)`);
    console.log(`  5. 创建 Git tag (v${newVersion})`);
    console.log(`  6. 推送到远程仓库`);
    if (!skipNpm) {
      console.log(`  7. 发布到 npm`);
    }
    if (!skipGithub) {
      console.log(`  8. 创建 GitHub Release`);
    }
    return;
  }

  // 检查工作目录是否干净
  checkCleanWorkingDirectory();

  // 更新版本号
  console.log('📝 更新版本号...');
  pkg.version = newVersion;
  writePackageJson(pkg);
  console.log(`✅ 版本号已更新为 ${newVersion}`);

  // 更新 CHANGELOG
  console.log('\n📋 更新 CHANGELOG...');
  await updateChangelog(newVersion);
  console.log('✅ CHANGELOG 已更新');

  // 构建项目
  console.log('\n🔨 构建项目...');
  exec('pnpm build');
  console.log('✅ 构建完成');

  // 检查构建产物
  await checkBuildOutput();

  // 提交更改
  console.log('\n📤 提交更改...');
  exec(`git add package.json CHANGELOG.md`);
  exec(`git commit -m "chore: bump version to ${newVersion}"`);
  console.log('✅ 更改已提交');

  // 创建 Git tag
  console.log(`\n🏷️  创建 Git tag v${newVersion}...`);
  exec(`git tag -a v${newVersion} -m "Release v${newVersion}"`);
  console.log(`✅ Tag v${newVersion} 已创建`);

  // 推送到远程仓库
  console.log('\n📤 推送到远程仓库...');
  exec('git push');
  exec(`git push --tags`);
  console.log('✅ 已推送到远程仓库');

  // 发布到 npm
  if (!skipNpm) {
    console.log('\n📦 发布到 npm...');
    try {
      exec('npm publish --access public');
      console.log(`✅ 已发布到 npm: ${pkg.name}@${newVersion}`);
    } catch (error) {
      console.error('❌ npm 发布失败');
      console.error('提示: 请确保已登录 npm (npm login)');
      throw error;
    }
  } else {
    console.log('\n⏭️  跳过 npm 发布 (使用 --skip-npm)');
  }

  // 创建 GitHub Release
  if (!skipGithub) {
    console.log('\n🐙 创建 GitHub Release...');
    try {
      await createGitHubRelease(newVersion);
      console.log(`✅ GitHub Release v${newVersion} 已创建`);
    } catch (error) {
      console.error('❌ GitHub Release 创建失败');
      console.error('提示: 请确保已安装 GitHub CLI (gh) 并已登录');
      throw error;
    }
  } else {
    console.log('\n⏭️  跳过 GitHub Release (使用 --skip-github)');
  }

  console.log(`\n🎉 发布完成! 版本 ${newVersion} 已发布`);
}

main().catch((error) => {
  console.error('\n❌ 发布失败:', error.message);
  process.exit(1);
});
