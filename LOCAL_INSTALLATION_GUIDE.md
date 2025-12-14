# Codebuff Local Installation & Operation Guide

**Target**: Install and run Codebuff locally with online Google Gemini model invocation via OpenRouter.

**Platform**: Linux, macOS, or Windows (WSL)  
**Time**: ~15-30 minutes for full setup

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        LOCAL MACHINE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  CLI/TUI (Port 3001 or stdout)                          │   │
│  │  Terminal User Interface with OpenTUI                   │   │
│  └─────────────────────────┬────────────────────────────────┘   │
│                            │                                    │
│  ┌─────────────────────────▼────────────────────────────────┐   │
│  │  Backend Server (Port 4242)                             │   │
│  │  - WebSocket connections                               │   │
│  │  - Agent orchestration                                 │   │
│  │  - Tool execution                                      │   │
│  │  - LLM API routing                                     │   │
│  └──┬──────────────────────────────────────────────────────┘   │
│     │                                                           │
│  ┌──▼──────────────────────────────────────────────────────┐   │
│  │  Database (PostgreSQL, Docker)                          │   │
│  │  - Agent registry                                      │   │
│  │  - User authentication                                │   │
│  │  - Credit ledger                                      │   │
│  │  - Agent execution history                            │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Web Dashboard (Port 3000)                             │   │
│  │  - Next.js application                                │   │
│  │  - Agent management UI                                │   │
│  │  - Authentication gateway                             │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │ (HTTPS)
                             │
        ┌────────────────────▼─────────────────────┐
        │      INTERNET / CLOUD                   │
        ├─────────────────────────────────────────┤
        │  OpenRouter API                        │
        │  (Google Gemini Model Inference)       │
        │  google/gemini-3-pro-preview           │
        │  google/gemini-2.5-pro                 │
        │  google/gemini-2.5-flash               │
        └─────────────────────────────────────────┘
```

---

## Prerequisites

### Required Tools

- **Bun** (≥1.3.0) - Fast JavaScript runtime & package manager
- **Docker** - For PostgreSQL database
- **Git** - For cloning repository
- **Node.js/npm** - For Infisical CLI (alternative to Bun)
- **direnv** - For environment variable management
- **Infisical CLI** - For secrets management

### Required Accounts & Keys

- **OpenRouter API Key** - For Google Gemini model access (FREE account with credits)
- **GitHub OAuth App** - For local authentication (free)
- **Infisical Account** - For secrets management (free account)

---

## Step-by-Step Installation

### Phase 1: Install Core Tools

#### 1.1 Install Bun
```bash
# macOS / Linux
curl -fsSL https://bun.sh/install | bash

# Windows (WSL)
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version  # Should show ≥1.3.0
```

#### 1.2 Install direnv
```bash
# macOS
brew install direnv

# Linux (Ubuntu/Debian)
sudo apt-get update && sudo apt-get install direnv

# Linux (Fedora)
sudo dnf install direnv

# Linux Mint (same as Ubuntu/Debian)
sudo apt-get install direnv
```

**Hook direnv into shell** (one-time setup):
```bash
# For zsh (default on macOS/Linux Mint)
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc && source ~/.zshrc

# For bash
echo 'eval "$(direnv hook bash)"' >> ~/.bashrc && source ~/.bashrc

# For fish
echo 'direnv hook fish | source' >> ~/.config/fish/config.fish && source ~/.config/fish/config.fish

# Verify
direnv version
```

#### 1.3 Install Docker
```bash
# macOS
brew install docker

# Linux (Ubuntu/Debian) - Full installation
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER  # Add user to docker group
newgrp docker  # Apply group membership

# Windows - Download Docker Desktop

# Verify
docker --version
docker run hello-world
```

#### 1.4 Install Infisical CLI
```bash
npm install -g @infisical/cli

# Verify
infisical --version
```

---

### Phase 2: Get Required Credentials

#### 2.1 OpenRouter API Key (for Gemini models)

1. Go to **https://openrouter.ai**
2. Sign up (free account)
3. Navigate to **Settings → API Keys**
4. Click **Create New API Key**
5. Copy the key (starts with `sk-or-...`)
6. **Keep this key safe** - you'll use it in environment setup

#### 2.2 GitHub OAuth App

1. Go to **https://github.com/settings/developers** (logged in)
2. Click **New OAuth App**
3. Fill in:
   - Application name: `Codebuff Local Dev`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click **Register application**
5. Copy:
   - **Client ID** → Use as `CODEBUFF_GITHUB_ID`
   - Click **Generate a new client secret** → Use as `CODEBUFF_GITHUB_SECRET`

#### 2.3 Infisical Setup

```bash
# Initialize Infisical
infisical init

# Browser opens automatically - login/register with GitHub or email
# Organization name: Your choice (e.g., "My Dev")
# Project name: codebuff

# Verify setup
infisical secrets list  # Should show empty or some variables
```

---

### Phase 3: Clone & Configure Repository

#### 3.1 Clone Repository

```bash
git clone https://github.com/CodebuffAI/codebuff.git
cd codebuff
```

#### 3.2 Configure Environment Variables

```bash
# Allow direnv to load .envrc
direnv allow

# Load all dummy environment variables from .env.example into Infisical
infisical secrets set --file .env.example

# Set the database URL (important!)
infisical secrets set DATABASE_URL=postgresql://manicode_user_local:secretpassword_local@localhost:5432/manicode_db_local

# Set your actual OpenRouter API key
infisical secrets set OPEN_ROUTER_API_KEY=sk-or-YOUR_KEY_HERE

# Set GitHub OAuth credentials
infisical secrets set CODEBUFF_GITHUB_ID=your_github_client_id
infisical secrets set CODEBUFF_GITHUB_SECRET=your_github_client_secret

# Generate a random 32+ character string for NextAuth secret
# (Linux: `openssl rand -base64 32`)
infisical secrets set NEXTAUTH_SECRET=your_generated_secret_here

# Similar for API_KEY_ENCRYPTION_SECRET
infisical secrets set API_KEY_ENCRYPTION_SECRET=your_generated_encryption_secret
```

#### 3.3 Install Dependencies

```bash
bun install

# This may take 2-5 minutes on first run
# Installs all packages across the monorepo
```

---

### Phase 4: Database Setup

#### 4.1 Start PostgreSQL Container

```bash
# Start the PostgreSQL database
bun run start-db

# Expected output:
# ✅ PostgreSQL is running on localhost:5432
# Database: manicode_db_local
# User: manicode_user_local
# Password: secretpassword_local

# Keep this terminal open while developing
```

#### 4.2 Run Database Migrations

**In a new terminal:**
```bash
cd /path/to/codebuff

# Run migrations
infisical run -- bun --cwd packages/internal run db:migrate

# Expected output:
# ✅ Migrations completed
```

#### 4.3 Access Database GUI (Optional)

```bash
# In a new terminal
bun run start-studio

# Browser opens to https://local.drizzle.studio/
# You can now browse/edit database tables
```

---

### Phase 5: Start Services (3 Terminals Required)

#### Terminal 1: Backend Server

```bash
# Terminal 1
cd /path/to/codebuff

# Start backend WebSocket server
bun run start-server

# Expected output:
# 🚀 Server is running on port 4242
# ✅ WebSocket server ready
# ✅ LLM integration initialized (Gemini models via OpenRouter)
```

**Keep this terminal open.**

#### Terminal 2: Web Dashboard

```bash
# Terminal 2 (new terminal)
cd /path/to/codebuff

# Start Next.js web application
bun run start-web

# Expected output:
# ✅ Database started
# ✅ Compiling application...
# ✅ Ready on http://localhost:3000
# ✅ PostgreSQL connected
```

**Keep this terminal open.**

#### Terminal 3: CLI Application

```bash
# Terminal 3 (new terminal)
cd /path/to/codebuff

# Start the CLI TUI
bun run start-bin

# Expected output:
# Welcome to Codebuff!
# ✅ Connected to backend (ws://localhost:4242)
# Available agents:
#   - base (🎯 Primary agent)
#   - validator
#   - context-pruner
#   - file-explorer
#   - researcher
#   - reviewer
#   - thinker
# 
# Type your coding task or press ? for help
```

---

### Phase 6: Authentication & Credits Setup

#### 6.1 Web Dashboard Login

1. Open **http://localhost:3000** in browser
2. Click **Login → GitHub**
3. Authorize the GitHub OAuth app
4. You're now logged in to the web dashboard

#### 6.2 Add Credits to Your Account

```bash
# Terminal 4 (new terminal)
cd /path/to/codebuff

# Open Drizzle Studio
bun run start-studio

# Browser opens to https://local.drizzle.studio/
```

**In Drizzle Studio:**
1. Click table: **credit_ledger**
2. Find your user entry (should have a row for your GitHub email)
3. Edit the row:
   - Set `principal` = `10000` (or desired amount)
   - Set `balance` = `10000` (match principal)
   - Leave other fields unchanged
4. Click **Save**
5. Refresh page to verify

#### 6.3 Verify in CLI

```bash
# Terminal 3 (CLI) - Refresh if needed
# You should see credit display in CLI: "Credits: 10000"

# Test with a simple command:
# Type: "Tell me about Gemini models"
# Press Enter

# CLI will:
# 1. Connect to backend
# 2. Invoke base agent with your prompt
# 3. Call OpenRouter API with google/gemini-3-pro-preview
# 4. Stream response back to CLI
```

---

## Verification Checklist

After setup, verify each component:

```bash
# 1. Check Bun
bun --version  # ≥1.3.0

# 2. Check Docker
docker ps  # Should show postgres container running

# 3. Check database connection
psql postgresql://manicode_user_local:secretpassword_local@localhost:5432/manicode_db_local -c "SELECT version();"

# 4. Check environment variables are loaded
echo $OPEN_ROUTER_API_KEY  # Should show your actual key (if using infisical run)
infisical secrets list | grep OPEN_ROUTER  # Should show your key

# 5. Check ports are available
netstat -an | grep -E "4242|3000|5432"  # Should show all three ports in LISTEN

# 6. Test CLI connection
# In Terminal 3 (CLI), type: "list agents"
# Should display available agents
```

---

## Running Codebuff Locally

### Standard Workflow

```bash
# 1. Open 4 terminals

# Terminal 1: Database
bun run start-db

# Terminal 2: Backend
bun run start-server

# Terminal 3: Web Dashboard
bun run start-web

# Terminal 4: CLI (or use web dashboard)
bun run start-bin
```

### Using the CLI

```bash
# In Terminal 4 (CLI)
# Type any coding task:

# Example 1: "Fix the typo in function foo"
# Example 2: "Add error handling to the API endpoint"
# Example 3: "Refactor this component for performance"
# Example 4: "Create a new test suite for utils"

# CLI will:
# 1. Analyze your project
# 2. Invoke Gemini model via OpenRouter (online)
# 3. Generate code changes
# 4. Apply changes locally
# 5. Show results in real-time
```

### Using Web Dashboard

1. Open **http://localhost:3000**
2. Click **Projects** → **+ New Project** or select existing
3. Enter your project path
4. Click **Run Agent**
5. Select **base** agent (uses Gemini-3-pro-preview)
6. Type your prompt
7. Watch real-time response streaming

---

## Model Configuration

### Models Available

| Model | Use Case | Tier |
|-------|----------|------|
| `google/gemini-3-pro-preview` | High-quality reasoning, complex tasks | Premium |
| `google/gemini-2.5-pro` | Balanced performance, general coding | Standard |
| `google/gemini-2.5-flash` | Fast execution, simple tasks | Economy |
| `google/gemini-2.5-flash-lite` | Context optimization, lightweight | Minimal |

### How Model Selection Works

```bash
# Backend automatically selects based on cost mode:

# User starts CLI without flags (default)
bun run start-bin
# → Backend uses: google/gemini-2.5-pro (normal mode)

# User starts with lite mode
bun run start-bin --lite
# → Backend uses: google/gemini-2.5-flash (fast, cheap)

# User starts with max mode
bun run start-bin --max
# → Backend uses: google/gemini-3-pro-preview (expensive, best quality)

# Configuration file: common/src/old-constants.ts
# Function: getModelForMode()
# Line: 132-164
```

---

## Troubleshooting

### Issue: "Failed to connect to backend"

**Solution:**
```bash
# Check if backend is running
curl http://localhost:4242

# If not, start backend
bun run start-server

# Check backend logs for errors
```

### Issue: "Database connection refused"

**Solution:**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# If not, start database
bun run start-db

# Reset if corrupted
docker-compose down
docker-compose up -d

# Re-run migrations
infisical run -- bun --cwd packages/internal run db:migrate
```

### Issue: "No credits - cannot run agents"

**Solution:**
```bash
# Open Drizzle Studio
bun run start-studio

# Navigate to credit_ledger table
# Find your entry (search by email or user ID)
# Edit: set principal = 1000, balance = 1000
# Save and refresh
```

### Issue: "OPEN_ROUTER_API_KEY not set"

**Solution:**
```bash
# Set it in Infisical
infisical secrets set OPEN_ROUTER_API_KEY=sk-or-YOUR_KEY_HERE

# Verify
infisical secrets list | grep OPEN_ROUTER

# Restart backend to load new key
# Terminal 2: Ctrl+C, then bun run start-server
```

### Issue: "GitHub OAuth fails to authorize"

**Solution:**
1. Verify GitHub OAuth app settings:
   - Go to **https://github.com/settings/developers**
   - Check **Authorization callback URL** = `http://localhost:3000/api/auth/callback/github`
   - Copy **Client ID** and **Client Secret**

2. Update in Infisical:
   ```bash
   infisical secrets set CODEBUFF_GITHUB_ID=correct_id
   infisical secrets set CODEBUFF_GITHUB_SECRET=correct_secret
   ```

3. Restart web server:
   ```bash
   # Terminal 3: Ctrl+C, then bun run start-web
   ```

### Issue: Ports already in use

**Solution:**
```bash
# Find process using port 4242 (backend)
lsof -i :4242
# Kill it: kill -9 PID

# Find process using port 3000 (web)
lsof -i :3000
# Kill it: kill -9 PID

# Find process using port 5432 (database)
lsof -i :5432
# Kill it or use different port

# Alternative: Use different ports
PORT=4243 bun run start-server
NEXT_PUBLIC_CODEBUFF_BACKEND_URL=localhost:4243 bun run start-web
```

---

## Development Commands Reference

```bash
# Core Commands
bun install              # Install dependencies (run after git pull)
bun run dev              # Start backend + web in background
bun run start-db         # Start PostgreSQL
bun run start-server     # Start backend (port 4242)
bun run start-web        # Start web dashboard (port 3000)
bun run start-bin        # Start CLI
bun run start-studio     # Open Drizzle Studio GUI

# Testing & Quality
bun test                 # Run all tests
bun test --watch         # Run tests in watch mode
bun run typecheck        # Type-check all packages
bun run format           # Format code with Prettier
bun run eslint --fix     # Fix ESLint issues

# Database
bun run start-studio                          # Database GUI
infisical run -- bun --cwd packages/internal run db:migrate  # Run migrations

# Publishing Agents (for running outside project)
bun run start-bin publish base context-pruner file-explorer file-picker researcher thinker reviewer
```

---

## Next Steps

After setup:

1. **Run your first task in CLI**
   ```bash
   bun run start-bin
   # Type: "List all functions in main.js"
   ```

2. **Use web dashboard**
   - Open http://localhost:3000
   - Select project and run agents through UI

3. **Explore agents**
   - Try different agents: validator, reviewer, researcher
   - Each uses Gemini models with different capabilities

4. **Review code changes**
   - Codebuff applies changes to your files automatically
   - Review diffs in your IDE
   - Commit/discard as needed

5. **Monitor usage**
   - Check credit usage in web dashboard
   - Credits are local - not connected to external system

---

## Architecture Notes

### Model Invocation Flow

```
CLI Command
    ↓
Backend WebSocket Server
    ↓
Agent Selection (base, validator, etc.)
    ↓
Prompt Construction + Agent Factory
    ↓
LLM API Routing (backend/src/llm-apis/openrouter.ts)
    ↓
OpenRouter HTTP Request
    ↓
Google Gemini Model (ONLINE via OpenRouter)
    ├─ google/gemini-3-pro-preview (primary)
    ├─ google/gemini-2.5-pro (balanced)
    ├─ google/gemini-2.5-flash (fast)
    └─ google/gemini-2.5-flash-lite (lightweight)
    ↓
Streaming Response Back to CLI/Web
    ↓
Display in Terminal or Dashboard
```

### Data Storage (Local Only)

- **PostgreSQL**: User data, credit ledger, agent registry
- **Git**: Project files and Codebuff changes (via git diff)
- **Memory**: Runtime state and WebSocket connections

All data remains on your local machine except for LLM API calls to OpenRouter.

---

## Support & Resources

- **Documentation**: https://codebuff.com/docs
- **Discord**: https://codebuff.com/discord
- **GitHub Issues**: https://github.com/CodebuffAI/codebuff/issues
- **Contributing**: CONTRIBUTING.md in repository

---

**Last Updated**: November 28, 2025  
**Target Codebuff Version**: Latest main branch  
**Target Gemini Models**: Gemini-3-pro-preview, Gemini-2.5 series
