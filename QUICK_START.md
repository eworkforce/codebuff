# Codebuff Quick Start (10 minutes)

**TL;DR**: Get Codebuff running locally in 10 minutes using online Gemini models.

---

## Prerequisites Check

Have these ready:
- ✅ Bun installed: `bun --version` (should show ≥1.3.0)
- ✅ Docker running: `docker --version`
- ✅ OpenRouter API key (free at https://openrouter.ai)
- ✅ GitHub account for OAuth

**Don't have them?** Install quickly:
```bash
# Bun
curl -fsSL https://bun.sh/install | bash

# direnv (Linux/macOS)
brew install direnv  # macOS
sudo apt-get install direnv  # Ubuntu/Debian

# Infisical
npm install -g @infisical/cli

# Docker - see LOCAL_INSTALLATION_GUIDE.md for platform-specific install
```

---

## Setup (5 minutes)

### 1. Clone & Enter Project
```bash
git clone https://github.com/CodebuffAI/codebuff.git
cd codebuff
```

### 2. Initialize Secrets
```bash
# Setup Infisical (browser opens automatically)
infisical init
# → Login with email or GitHub
# → Create/select project called "codebuff"

# Load dummy environment variables
infisical secrets set --file .env.example

# Set database URL
infisical secrets set DATABASE_URL=postgresql://manicode_user_local:secretpassword_local@localhost:5432/manicode_db_local

# Set your OpenRouter API key
infisical secrets set OPEN_ROUTER_API_KEY=sk-or-YOUR_KEY_HERE

# Set GitHub OAuth credentials (from https://github.com/settings/developers)
infisical secrets set CODEBUFF_GITHUB_ID=your_id
infisical secrets set CODEBUFF_GITHUB_SECRET=your_secret

# Generate and set auth secrets
infisical secrets set NEXTAUTH_SECRET=$(openssl rand -base64 32)
infisical secrets set API_KEY_ENCRYPTION_SECRET=$(openssl rand -base64 32)
```

### 3. Allow direnv
```bash
direnv allow
```

### 4. Install Dependencies
```bash
bun install
```

---

## Run (5 minutes)

### Open 4 Terminals

**Terminal 1 - Database:**
```bash
bun run start-db
# Keep open
```

**Terminal 2 - Backend:**
```bash
bun run start-server
# Expected: "🚀 Server is running on port 4242"
# Keep open
```

**Terminal 3 - Web:**
```bash
bun run start-web
# Expected: "Ready on http://localhost:3000"
# Keep open
```

**Terminal 4 - CLI:**
```bash
bun run start-bin
# Expected: "Welcome to Codebuff!"
```

---

## Add Credits

1. Open new terminal: `bun run start-studio`
2. Browser opens to database GUI
3. Go to **credit_ledger** table
4. Find your GitHub email row
5. Edit: Set `principal=10000`, `balance=10000`
6. Save

---

## Use It

### In CLI (Terminal 4):
```bash
# Type any coding task:
"Fix the typo in main.js"
"Add error handling to API"
"Create test for utils.ts"
# Press Enter
# Watch Gemini model process your request in real-time
```

### In Web Dashboard:
1. Open http://localhost:3000
2. Login with GitHub
3. Create/select project
4. Type prompt and hit Enter

---

## Done! 🎉

Your local Codebuff is running with:
- ✅ Google Gemini-3-Pro-Preview as primary model
- ✅ PostgreSQL database (local)
- ✅ OpenRouter for online model invocation
- ✅ GitHub OAuth authentication
- ✅ CLI and Web dashboard

---

## Common Issues

| Issue | Solution |
|-------|----------|
| "Backend not running" | Terminal 2: `bun run start-server` |
| "Database refused" | Terminal 1: `bun run start-db` |
| "No credits" | Run `bun run start-studio` and edit credit_ledger |
| "API key error" | Set it: `infisical secrets set OPEN_ROUTER_API_KEY=sk-or-...` |
| "OAuth fails" | Create app at https://github.com/settings/developers |

---

## Model Tiers

```bash
# Default (Normal) - Gemini-2.5-Pro
bun run start-bin

# Fast & Cheap - Gemini-2.5-Flash
bun run start-bin --lite

# Best Quality - Gemini-3-Pro-Preview
bun run start-bin --max
```

---

## Next Steps

1. Read **LOCAL_INSTALLATION_GUIDE.md** for detailed setup
2. Check **WARP.md** for architecture details
3. Try different agents (validator, reviewer, researcher)
4. Explore **web dashboard** at http://localhost:3000

---

**Need help?** Discord: https://codebuff.com/discord
