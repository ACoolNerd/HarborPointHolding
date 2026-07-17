#!/usr/bin/env node
/**
 * Harbor Point Holding — Deployment CLI
 * Supports: FTP/SFTP uploads, GitHub Pages static export, local builds
 * Usage: node deploy.js [target] [--env=production]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load environment
require('dotenv').config({ path: '.env.local' });

const TARGETS = {
  ftp: 'Deploy to FTP/SFTP server',
  github: 'Deploy static site to GitHub Pages',
  local: 'Build & serve locally (docker-compose)',
  export: 'Export static HTML only',
};

const DEPLOY_CONFIG = {
  ftp: {
    host: process.env.FTP_HOST || 'your-server.com',
    port: parseInt(process.env.FTP_PORT || '21'),
    user: process.env.FTP_USER || '',
    pass: process.env.FTP_PASS || '',
    remotePath: process.env.FTP_REMOTE_PATH || '/public_html',
  },
  github: {
    repo: process.env.GITHUB_REPO || 'ACoolNerd/HarborPointHolding',
    branch: process.env.GITHUB_PAGES_BRANCH || 'gh-pages',
  },
};

async function deploy(target = 'local', env = 'development') {
  console.log(`\n🚀 HARBOR POINT HOLDING DEPLOYMENT`);
  console.log(`   Target: ${target} | Environment: ${env}\n`);

  if (!TARGETS[target]) {
    console.error(`❌ Unknown target: ${target}`);
    console.log(`   Available: ${Object.keys(TARGETS).join(', ')}`);
    process.exit(1);
  }

  try {
    switch (target) {
      case 'local':
        await deployLocal();
        break;
      case 'export':
        await exportStatic();
        break;
      case 'github':
        await deployGitHub();
        break;
      case 'ftp':
        await deployFTP(env);
        break;
      default:
        console.error('Unknown target');
    }
  } catch (error) {
    console.error(`\n❌ Deployment failed: ${error.message}`);
    process.exit(1);
  }
}

async function deployLocal() {
  console.log('📦 Building Docker image...');
  execSync('docker compose build', { stdio: 'inherit' });

  console.log('✅ Starting local server...');
  console.log('   🌐 http://localhost:3000');
  console.log('   📊 Dashboard: http://localhost:3000/dashboard\n');

  execSync('docker compose up', { stdio: 'inherit' });
}

async function exportStatic() {
  console.log('📄 Exporting static site...');
  
  const distDir = path.join(__dirname, 'dist');
  if (fs.existsSync(distDir)) {
    execSync(`rm -rf ${distDir}`);
  }
  fs.mkdirSync(distDir);

  // Copy public files
  const filesToCopy = [
    'index.html',
    '404.html',
    'privacy.html',
    'terms.html',
    'favicon.svg',
    'robots.txt',
    'sitemap.xml',
    'dashboard.html',
    'assets',
    'kassandra',
    'docs',
  ];

  filesToCopy.forEach((file) => {
    const src = path.join(__dirname, file);
    const dest = path.join(distDir, file);
    if (fs.existsSync(src)) {
      execSync(`cp -r ${src} ${dest}`);
    }
  });

  console.log(`✅ Static export complete: ${distDir}`);
  console.log(`   Ready for GitHub Pages or static hosting\n`);
}

async function deployGitHub() {
  console.log('📤 Deploying to GitHub Pages...');

  // Export static files
  await exportStatic();

  const distDir = path.join(__dirname, 'dist');

  // Initialize gh-pages if needed
  try {
    execSync('npx gh-pages --version', { stdio: 'ignore' });
  } catch {
    console.log('   Installing gh-pages...');
    execSync('npm install --save-dev gh-pages', { stdio: 'inherit' });
  }

  // Deploy
  execSync(`npx gh-pages -d dist`, { stdio: 'inherit' });

  console.log(`\n✅ GitHub Pages deployment complete!`);
  console.log(`   📍 https://${DEPLOY_CONFIG.github.repo.split('/')[0]}.github.io/HarborPointHolding\n`);
}

async function deployFTP(env) {
  const config = DEPLOY_CONFIG.ftp;

  if (!config.user || !config.pass) {
    console.error('❌ FTP credentials missing.');
    console.error('   Set FTP_USER, FTP_PASS, FTP_HOST in .env.local\n');
    process.exit(1);
  }

  console.log(`📤 Preparing FTP upload...`);
  console.log(`   Host: ${config.host}:${config.port}`);
  console.log(`   Remote: ${config.remotePath}\n`);

  // Export static first
  await exportStatic();

  const distDir = path.join(__dirname, 'dist');

  // Install lftp if not present
  try {
    execSync('which lftp', { stdio: 'ignore' });
  } catch {
    console.log('⚠️  lftp not found. Install with: brew install lftp (macOS) or apt install lftp (Linux)');
    console.log('   Or use the Node-based FTP library instead.\n');
    console.log('   Creating .ftp-mirror script for manual mirror:\n');

    const mirrorScript = `#!/bin/bash
# FTP Mirror Script for Harbor Point Holding
open ${config.host}:${config.port}
user ${config.user} ${config.pass}
mirror -R -e ${distDir} ${config.remotePath}/
quit
`;
    fs.writeFileSync('.ftp-mirror', mirrorScript);
    console.log('   Created: .ftp-mirror');
    console.log('   Usage: lftp < .ftp-mirror\n');
    process.exit(0);
  }

  // Use lftp for mirror
  const ftpScript = `
open ${config.host}:${config.port}
user ${config.user} ${config.pass}
mirror -R -e ${distDir} ${config.remotePath}/
quit
`;

  fs.writeFileSync('.ftp-script', ftpScript);

  try {
    execSync(`lftp < .ftp-script`, { stdio: 'inherit' });
    console.log(`\n✅ FTP deployment complete!`);
    console.log(`   📍 ${env === 'production' ? 'https' : 'http'}://${config.host}${config.remotePath}\n`);
  } finally {
    fs.unlinkSync('.ftp-script');
  }
}

// CLI entry
const target = process.argv[2] || 'local';
const envArg = process.argv.find((a) => a.startsWith('--env='))?.split('=')[1] || 'development';

console.log(`\n📋 Available Targets:`);
Object.entries(TARGETS).forEach(([key, desc]) => {
  console.log(`   ${key.padEnd(10)} — ${desc}`);
});

deploy(target, envArg).catch((err) => {
  console.error(err);
  process.exit(1);
});
