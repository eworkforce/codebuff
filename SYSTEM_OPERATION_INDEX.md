# Codebuff System Operation - Complete Documentation Index

Complete guide to installing, configuring, and operating Codebuff locally with Google Gemini models.

---

## 📚 Documentation Overview

### For First-Time Setup

**Start here if you're setting up Codebuff for the first time:**

1. **QUICK_START.md** (10 minutes)
   - Fastest path to getting Codebuff running
   - For users who want to get going immediately
   - Assumes you have prerequisites installed
   - **Time**: ~10 minutes

2. **LOCAL_INSTALLATION_GUIDE.md** (30-45 minutes)
   - Comprehensive step-by-step installation
   - Covers all prerequisites in detail
   - Detailed architecture overview
   - Complete troubleshooting
   - **Time**: 30-45 minutes first setup

### For Daily Operations

**Use these once you have Codebuff running:**

3. **DAILY_OPERATIONS.md**
   - Daily startup/shutdown procedures
   - Common workflow examples
   - Performance tips
   - Monitoring and debugging
   - **Read this** before each development session

### For Understanding the System

**For architecture and design knowledge:**

4. **WARP.md**
   - System architecture overview
   - Multi-agent system explanation
   - Development patterns
   - Key command reference
   - **Read this** for understanding how Codebuff works

5. **MODEL_CONFIGURATION_STATUS.md**
   - Detailed model configuration analysis
   - Which models are actually used
   - Infrastructure setup details

6. **GEMINI_MODEL_CONFIRMATION.md**
   - Confirmation that only Google Gemini is used
   - Principal model identification
   - Configuration status

---

## 🚀 Quick Navigation

### I want to...

**Get Codebuff running right now**
→ **QUICK_START.md** (10 min)

**Install Codebuff step by step**
→ **LOCAL_INSTALLATION_GUIDE.md** (30 min setup)

**Know how to start/stop it daily**
→ **DAILY_OPERATIONS.md** → "Daily Startup Routine"

**Understand the architecture**
→ **WARP.md** → "Architecture" section

**Know which models are being used**
→ **GEMINI_MODEL_CONFIRMATION.md** → "Executive Answer"

**Run my first coding task**
→ **DAILY_OPERATIONS.md** → "Using Codebuff" section

**Fix a problem**
→ **LOCAL_INSTALLATION_GUIDE.md** → "Troubleshooting" OR **DAILY_OPERATIONS.md** → "Troubleshooting Quick Reference"

---

## 📋 Pre-Installation Checklist

Before starting, verify you have:

```
□ Bun ≥1.3.0 installed                    (bun --version)
□ Docker installed and running             (docker --version)
□ Git installed                            (git --version)
□ OpenRouter API key (from openrouter.ai)
□ GitHub account for OAuth
□ Internet connection for model API calls
□ 4GB+ available disk space
□ 2GB+ available RAM
```

**Missing something?** → See **LOCAL_INSTALLATION_GUIDE.md** Phase 1

---

## ⚡ Typical User Journeys

### Journey 1: One-Time Setup
```
1. Read: QUICK_START.md (first 10 min)
2. Follow: All steps in QUICK_START.md
3. Test: Run a simple task in CLI
4. Success! → Move to Daily Operations
```

### Journey 2: Detailed Setup (First Time)
```
1. Read: LOCAL_INSTALLATION_GUIDE.md Phase 1-6
2. Follow: All prerequisites installation
3. Follow: Clone, configure, setup
4. Test: Verification checklist
5. Success! → Move to Daily Operations
```

### Journey 3: Daily Development
```
1. Each morning: Follow DAILY_OPERATIONS.md "Daily Startup Routine"
2. Run tasks: Use CLI or web dashboard
3. Review changes: git diff
4. Commit: git commit
5. Repeat: Next task
6. End of day: Graceful shutdown
```

### Journey 4: Troubleshooting
```
1. Problem occurs
2. Check: DAILY_OPERATIONS.md "Troubleshooting Quick Reference"
3. If not found: LOCAL_INSTALLATION_GUIDE.md "Troubleshooting"
4. If still unclear: Check specific service docs (backend, web, CLI)
```

---

## 🏗️ System Architecture

### Local Setup
```
┌──────────────────────────────────┐
│     Your Local Machine           │
├──────────────────────────────────┤
│                                  │
│  CLI/TUI    Web Dashboard        │
│     ↓           ↓               │
│  ┌──────────────────────────┐   │
│  │  Backend Server:4242     │   │
│  │  - WebSocket             │   │
│  │  - Agent Orchestration   │   │
│  │  - Tool Execution        │   │
│  └───────┬──────────────────┘   │
│          │                       │
│  ┌───────▼──────────────────┐   │
│  │  PostgreSQL:5432        │   │
│  │  - User Data            │   │
│  │  - Credit Ledger        │   │
│  │  - Agent Registry       │   │
│  └────────────────────────┘   │
│                                  │
└──────────────────────────────────┘
         │
         │ (HTTPS)
         │
    ┌────▼──────────────┐
    │  OpenRouter API   │
    │  Google Gemini    │
    │  Models           │
    └───────────────────┘
```

### Services & Ports

| Service | Port | Purpose |
|---------|------|---------|
| Backend | 4242 | WebSocket, Agent orchestration, LLM routing |
| Web Dashboard | 3000 | Next.js UI, authentication |
| PostgreSQL | 5432 | User data, credits, agent registry |
| CLI | stdout | Terminal UI, direct prompts |

---

## 🎯 Models Used

### Default Configuration

| Mode | Model | Use Case |
|------|-------|----------|
| **lite** | `google/gemini-2.5-flash` | Fast, simple tasks |
| **normal** (default) | `google/gemini-2.5-pro` | General coding |
| **max** (best) | `google/gemini-3-pro-preview` | Complex reasoning |
| **experimental** | `google/gemini-3-pro-preview` | Research |

### How Models Work

1. You give Codebuff a task
2. Backend selects appropriate Gemini model based on mode
3. Request sent to OpenRouter API (online)
4. Google Gemini processes your request
5. Response streamed back to your CLI/dashboard
6. Changes applied to your code locally

**All processing is online** - models run in Google's cloud via OpenRouter

---

## 🔐 Credentials Required

### OpenRouter API Key
- **Where to get**: https://openrouter.ai (free account)
- **Purpose**: Access to Google Gemini models
- **Format**: `sk-or-...` (starts with `sk-or-`)
- **Setup**: `infisical secrets set OPEN_ROUTER_API_KEY=sk-or-YOUR_KEY`

### GitHub OAuth App
- **Where to create**: https://github.com/settings/developers
- **Purpose**: Local authentication
- **Setup**: See LOCAL_INSTALLATION_GUIDE.md Phase 2.2

### Database URL
- **Format**: `postgresql://user:password@host:port/database`
- **Default**: `postgresql://manicode_user_local:secretpassword_local@localhost:5432/manicode_db_local`
- **Setup**: `infisical secrets set DATABASE_URL=postgresql://...`

---

## ⚙️ Configuration Files

### Key Files in Repository

| File | Purpose |
|------|---------|
| `.env.example` | Template for all environment variables |
| `.envrc` | direnv configuration |
| `.agents/` | Agent definitions (all use Gemini) |
| `common/src/old-constants.ts` | Model configuration & tier selection |
| `backend/src/llm-apis/` | LLM API routing |
| `docker-compose.yml` | Database container config |

### How to Update Configuration

```bash
# Check current config
infisical secrets list

# Update a setting
infisical secrets set VARIABLE_NAME=new_value

# Restart affected service to apply
# (e.g., restart backend for API key changes)
```

---

## 📊 Operations Checklist

### Daily Morning (5 min)
```bash
□ Terminal 1: bun run start-db
  └─ Wait: "PostgreSQL is running..."
□ Terminal 2: bun run start-server
  └─ Wait: "Server running on 4242"
□ Terminal 3: bun run start-web
  └─ Wait: "Ready on http://localhost:3000"
□ Terminal 4: bun run start-bin
  └─ Wait: "Welcome to Codebuff!"
□ Verify: All services running
```

### During Day (as needed)
```bash
□ Use CLI or web dashboard
□ Run coding tasks
□ Review changes: git diff
□ Commit changes: git commit
```

### Evening (2 min)
```bash
□ Finish current task
□ Commit all changes: git add . && git commit -m "..."
□ Terminal 1-4: Ctrl+C (graceful shutdown)
□ Verify: All services stopped
```

---

## 🐛 Common Issues & Solutions

### Services Won't Start
**Check**: Are ports in use?
```bash
lsof -i :4242  # Backend
lsof -i :3000  # Web
lsof -i :5432  # Database
```
**Fix**: Kill other processes or use different ports
→ **See**: LOCAL_INSTALLATION_GUIDE.md "Ports already in use"

### No Credits / Can't Run Tasks
**Check**: Do you have credits in database?
**Fix**: `bun run start-studio` → edit `credit_ledger` table
→ **See**: DAILY_OPERATIONS.md "No Credits"

### Backend Connection Error
**Check**: Is backend running?
```bash
curl http://localhost:4242
```
**Fix**: Restart backend (Terminal 2: Ctrl+C, then `bun run start-server`)
→ **See**: DAILY_OPERATIONS.md "Backend disconnected"

### API Key Invalid / Model Errors
**Check**: Is OPEN_ROUTER_API_KEY set correctly?
```bash
infisical secrets list | grep OPEN_ROUTER
```
**Fix**: Update key and restart backend
```bash
infisical secrets set OPEN_ROUTER_API_KEY=sk-or-YOUR_KEY
# Terminal 2: Ctrl+C && bun run start-server
```
→ **See**: DAILY_OPERATIONS.md "API key error"

### Database Connection Refused
**Check**: Is PostgreSQL running?
```bash
docker ps | grep postgres
```
**Fix**: Start database (Terminal 1: `bun run start-db`)
→ **See**: DAILY_OPERATIONS.md "Database error"

---

## 📈 Performance Optimization

### Model Selection Strategy

```bash
# ✅ Use --lite for simple tasks
bun run start-bin --lite
# "Add JSDoc comment"
# "Add console.log statement"

# ✅ Use default for normal tasks
bun run start-bin
# "Refactor this component"
# "Add error handling"

# ✅ Use --max for complex tasks
bun run start-bin --max
# "Design new architecture"
# "Implement complex algorithm"
```

### Project Scope Management

```bash
# ✅ Good: Specific directory
cd my-project/src/components
bun run start-bin
# Fast analysis of specific area

# ❌ Bad: Entire massive repo
cd /huge/monorepo
bun run start-bin
# Slow, unnecessary files analyzed
```

### Task Specificity

```bash
# ✅ Specific
"Add error handling to fetchUser function in api/users.ts"

# ❌ Vague
"Improve code"
```

---

## 🔗 Documentation Links

### Internal Docs
- **QUICK_START.md** - 10-minute setup
- **LOCAL_INSTALLATION_GUIDE.md** - Detailed installation
- **DAILY_OPERATIONS.md** - Daily workflows
- **WARP.md** - Architecture & development
- **CONTRIBUTING.md** - Development guidelines

### External Resources
- **OpenRouter**: https://openrouter.ai
- **Codebuff Docs**: https://codebuff.com/docs
- **Discord**: https://codebuff.com/discord
- **GitHub**: https://github.com/CodebuffAI/codebuff

---

## 📞 Getting Help

### If you're stuck:

1. **Check troubleshooting**
   - DAILY_OPERATIONS.md - Quick fixes
   - LOCAL_INSTALLATION_GUIDE.md - Detailed solutions

2. **Check service logs**
   - Terminal 1 (db): Database logs
   - Terminal 2 (backend): Server logs
   - Terminal 3 (web): Application logs
   - Terminal 4 (CLI): Execution logs

3. **Verify configuration**
   ```bash
   # Check all secrets are set
   infisical secrets list
   
   # Check services are running
   docker ps
   lsof -i :4242
   lsof -i :3000
   ```

4. **Ask for help**
   - Discord: https://codebuff.com/discord
   - GitHub Issues: https://github.com/CodebuffAI/codebuff/issues

---

## 📝 Version Information

| Component | Version | Notes |
|-----------|---------|-------|
| Codebuff | Latest main | Always latest from GitHub |
| Bun | ≥1.3.0 | Package manager & runtime |
| Node.js | N/A | Not required (Bun instead) |
| PostgreSQL | 14+ | Docker container |
| Docker | Latest | For database container |
| Gemini Models | Latest | google/gemini-3-pro-preview, etc. |

---

## ✅ Verification Steps

### Verify Installation

```bash
# 1. All services running?
curl http://localhost:4242    # Should respond
curl http://localhost:3000     # Should respond
docker ps | grep postgres      # Should show container

# 2. Database working?
infisical run -- bun --cwd packages/internal run db:migrate
# Should show "Migrations completed"

# 3. CLI working?
# Terminal 4: Type "agents"
# Should show list of available agents

# 4. Model working?
# Terminal 4: Type "Tell me about Gemini"
# Should get response from Gemini model
```

### Verify Configuration

```bash
# 1. Models configured for Gemini?
grep ALLOWED_MODEL_PREFIXES common/src/old-constants.ts
# Should show: ['google']

# 2. OpenRouter API key set?
infisical secrets list | grep OPEN_ROUTER
# Should show your key (sk-or-...)

# 3. GitHub OAuth configured?
infisical secrets list | grep GITHUB
# Should show Client ID and Secret
```

---

## 🎓 Learning Path

### Beginner (Just want to use it)
1. QUICK_START.md
2. DAILY_OPERATIONS.md sections: "Using Codebuff"
3. Start running tasks

### Intermediate (Want to understand it)
1. LOCAL_INSTALLATION_GUIDE.md "Architecture"
2. WARP.md sections: "Architecture", "Communication Flow"
3. Try different agents and modes

### Advanced (Want to extend it)
1. WARP.md full document
2. CONTRIBUTING.md
3. Explore `.agents/` directory
4. Read backend code in `backend/src/`

---

## 📞 Support Channels

| Channel | Use For |
|---------|---------|
| **This Doc** | Quick answers, common issues |
| **Discord** | Community help, feature requests |
| **GitHub Issues** | Bug reports, technical issues |
| **Documentation** | In-depth learning |

---

**Last Updated**: November 28, 2025  
**Status**: ✅ Production Ready  
**Platform**: Linux, macOS, Windows (WSL)  
**Model Provider**: Google Gemini (via OpenRouter, online)
