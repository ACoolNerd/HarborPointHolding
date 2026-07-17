# Harbor Point Holding — Deployment Guide

## Quick Start

### Local Development (Docker)
```bash
docker compose up
```
- **Web**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/dashboard
- **Leads DB**: `leads.json` (persisted locally)

### Export Static Site
```bash
npm run deploy:export
```
Creates `dist/` folder with all static HTML, CSS, assets ready for hosting.

---

## Deployment Targets

### 1️⃣ GitHub Pages (Automatic)
**Setup:**
1. Ensure repo is public: GitHub → Settings → Visibility → Public
2. Enable Pages: Settings → Pages → Build and deployment → Deploy from a branch → `gh-pages`
3. Push to main branch:
```bash
git add -A
git commit -m "deployment update"
git push origin main
```

**Result:** Automatic CI/CD workflow deploys to `https://acoolnerd.github.io/HarborPointHolding`

**GitHub Actions Workflow:** `.github/workflows/deploy.yml` (auto-runs on push)

---

### 2️⃣ FTP/SFTP to Shared Hosting or VPS
**Setup:**
1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Add your FTP credentials:
```
FTP_HOST=your-server.com
FTP_PORT=21
FTP_USER=cpanel-username
FTP_PASS=your-password
FTP_REMOTE_PATH=/public_html
```

3. Deploy:
```bash
npm run deploy:ftp
```

**Requirements:**
- lftp installed: `brew install lftp` (macOS) or `apt install lftp` (Linux)
- Or provide .ftp-mirror script alternative

**Credentials:** Never commit `.env.local` — it's in `.gitignore`

---

### 3️⃣ Docker to VPS/Cloud (DigitalOcean, Heroku, etc.)
**Option A — DigitalOcean App Platform:**
```bash
doctl apps create --spec app.yaml
```

**Option B — Heroku:**
```bash
heroku login
heroku create harborpoint-holding
heroku container:push web
heroku container:release web
```

**Option C — AWS/EC2:**
Push Docker image to ECR, pull on EC2, run via docker-compose.

---

## Sharing Links with Owner

### Live Production URLs

**Main Hub:**
```
https://acoolnerd.github.io/HarborPointHolding
```

**Kassandra Agent Hub:**
```
https://acoolnerd.github.io/HarborPointHolding/kassandra
```

**1000 Farmington Avenue Deal Room:**
```
https://acoolnerd.github.io/HarborPointHolding/kassandra/deals/1000-farmington-avenue.html
(Requires passcode: 1000-FARMINGTON)
```

**Specific Kassandra Services:**
- Sell My House (West Hartford): `/kassandra/sell-my-house-west-hartford.html`
- Home Value Inquiry: `/kassandra/home-value-west-hartford.html`
- Inherited Property: `/kassandra/inherited-property-connecticut.html`
- Commercial Properties: `/kassandra/sell-commercial-property-connecticut.html`
- Multifamily Dispositions: `/kassandra/sell-multifamily-property-connecticut.html`
- As-Is Sales: `/kassandra/sell-house-as-is-connecticut.html`
- Contact/Intake: `/kassandra/contact.html`

**Admin Dashboard (Local Only):**
```
http://localhost:3000/dashboard
```

---

## Deployment Dashboard

Interactive dashboard for all deployment targets and shareable links:

```bash
npm run dashboard
```

Opens: `deployment-dashboard.html` with copy-to-clipboard for all commands and links.

---

## Environment Variables

### Required for CRM Integration
```
HUBSPOT_PORTAL_ID=xxxxxxxx
HUBSPOT_FORM_GUID=xxxxxxxx
CALENDLY_URL=https://calendly.com/kassandra/consultation
```

### Optional for Deployment
```
GITHUB_REPO=ACoolNerd/HarborPointHolding
GITHUB_PAGES_BRANCH=gh-pages

FTP_HOST=your-server.com
FTP_PORT=21
FTP_USER=username
FTP_PASS=password
FTP_REMOTE_PATH=/public_html
```

**Important:** Create `.env.local` (in .gitignore) for development. Never commit real credentials.

---

## CI/CD Workflow

**File:** `.github/workflows/deploy.yml`

**Triggers:**
- On push to `main` branch
- Manual trigger via `workflow_dispatch`

**Steps:**
1. Checkout code
2. Setup Node 18
3. Install dependencies
4. Export static site (`npm run deploy:export`)
5. Configure GitHub Pages
6. Upload artifact to GitHub Pages
7. Deploy to `https://acoolnerd.github.io/HarborPointHolding`

**Status:** View on GitHub → Actions tab

---

## Directory Structure

```
HarborPointHolding/
├── server.js                 # Express backend (local only)
├── package.json              # Dependencies & scripts
├── docker-compose.yml        # Local containerization
├── Dockerfile                # Node 18-alpine build
├── deploy.js                 # Deployment CLI tool
├── .env.example              # Environment template
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions CI/CD
├── scripts/
│   ├── generate-dashboard.js # Shareable links dashboard
│   └── ...
├── index.html                # Harbor Point Holding hub
├── hp-*.html                 # Lane-specific pages
├── kassandra/                # Kassandra Gonzales agent pages
│   ├── index.html            # Agent home
│   ├── deals/1000-farmington-avenue.html
│   └── ...
├── assets/                   # Logos & brand assets
├── docs/                     # Documentation
├── leads.json                # Local lead database
└── dist/                     # Static export (created on deploy)
```

---

## Troubleshooting

### Docker won't start
```bash
docker compose down --remove-orphans
docker compose up --build
```

### FTP deployment fails
- Verify lftp installed: `which lftp`
- Check credentials in `.env.local`
- Test connection manually: `lftp user@host`
- View `.ftp-mirror` script for alternate approach

### GitHub Pages not updating
- Check Actions tab for workflow errors
- Ensure repo is public
- Verify gh-pages branch exists in Settings → Pages
- Force rebuild: Edit `.github/workflows/deploy.yml` → commit → push

### Lead form submissions not working
- Backend must be running locally or on server (`npm start`)
- Check leads.json file has write permissions
- Verify HubSpot credentials in environment variables

---

## Deployment Checklist

Before sharing with owner:

- [ ] Local dev running: `docker compose up`
- [ ] Static export works: `npm run deploy:export`
- [ ] GitHub Pages live: https://acoolnerd.github.io/HarborPointHolding
- [ ] All links tested and working
- [ ] .env.local created with credentials
- [ ] .gitignore includes .env.local
- [ ] GitHub Actions workflow passing
- [ ] Deployment dashboard generated
- [ ] Owner URLs prepared and tested
- [ ] Mobile responsive check on production links

---

## Quick Reference

```bash
# Local development
npm run start                  # Start server
npm run dev                    # With auto-reload

# Build & test
npm install                    # Install dependencies
npm run deploy:export          # Export static site

# Deploy
npm run deploy:local           # Docker compose up
npm run deploy:github          # Push to GitHub (auto-deploys)
npm run deploy:ftp             # Manual FTP upload
npm run dashboard              # Generate deployment dashboard
```

---

**Created:** July 17, 2026 | **Repository:** github.com/ACoolNerd/HarborPointHolding
