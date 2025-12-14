# Codebuff Daily Operations Guide

How to work with Codebuff locally for daily development tasks.

---

## Daily Startup Routine

### Every Day: Start Services (once)

```bash
# Terminal 1 - Database (keep open)
bun run start-db

# Wait for "✅ PostgreSQL is running on localhost:5432"

# Terminal 2 - Backend (keep open)
bun run start-server

# Wait for "🚀 Server is running on port 4242"

# Terminal 3 - Web Dashboard (keep open)
bun run start-web

# Wait for "✅ Ready on http://localhost:3000"

# Terminal 4 - CLI (optional, or use web dashboard)
bun run start-bin

# You're ready to work!
```

### Daily Startup - Verify It Works

```bash
# In a new terminal, verify all services:
curl http://localhost:4242    # Backend
curl http://localhost:3000     # Web dashboard
docker ps | grep postgres      # Database
```

---

## Using Codebuff

### Via CLI (Terminal 4)

#### Start a Coding Task

```bash
# Once Codebuff starts, you see:
# Welcome to Codebuff!
# Available agents: base, validator, context-pruner, ...
# 
# Type your task:

"Add type annotations to all functions in utils.ts"
# Press Enter

# Expected flow:
# 1. "🔍 Analyzing your codebase..."
# 2. "📊 Found 12 functions in utils.ts"
# 3. "🤔 Planning changes with Gemini-3-Pro..."
# 4. "✏️  Applying changes..."
# 5. "✅ Completed! Review the changes."
```

#### Common Commands

```bash
# List available agents
agents

# Show help
help

# Clear screen
clear

# Exit
exit
```

#### Select Different Agents

```bash
# Default: base agent (uses Gemini-3-Pro-Preview)
"My coding task here"

# Use validator to review code
@validator "Review the code quality in main.ts"

# Use researcher to investigate
@researcher "Find usage of deprecated API"

# Use thinker for complex reasoning
@thinker "Design the architecture for new feature"

# Available agents: base, validator, reviewer, thinker, researcher, file-explorer, context-pruner
```

### Via Web Dashboard (http://localhost:3000)

#### 1. Login
- Open http://localhost:3000
- Click **Login** → **GitHub**
- Authorize the OAuth app
- You're logged in

#### 2. Create/Select Project
- Click **Projects**
- Click **+ New Project**
- Enter project path (e.g., `/path/to/your/repo`)
- Click **Create**

#### 3. Run an Agent
- Click the project
- Click **Run Agent**
- Select agent: **base** (default, uses Gemini-3-Pro-Preview)
- Type your prompt in the text box
- Click **Send** or press Enter
- Watch real-time response streaming

#### 4. Review Changes
- Codebuff shows:
  - Original code
  - Modified code
  - Diff view
- In your IDE, review the actual changes
- Accept or discard changes in git

---

## Workflow Examples

### Example 1: Add Error Handling

**Task**: Add try-catch blocks to all API calls

```bash
# In CLI:
"Add error handling to all API calls in api/handlers.ts"

# Codebuff will:
# 1. Read api/handlers.ts
# 2. Find all fetch/request calls
# 3. Wrap with try-catch
# 4. Add proper error logging
# 5. Show changes

# Then in your IDE:
git diff  # Review changes
git add .
git commit -m "feat: add error handling to API handlers"
```

### Example 2: Refactor Component

**Task**: Improve React component performance

```bash
# In CLI:
"Refactor UserCard component to use memoization and useCallback"

# Codebuff will:
# 1. Analyze UserCard component
# 2. Identify unnecessary re-renders
# 3. Add React.memo wrapper
# 4. Add useCallback hooks
# 5. Show improvements

# Review and commit
```

### Example 3: Write Tests

**Task**: Generate tests for utility functions

```bash
# In CLI:
"Write comprehensive unit tests for utils.ts functions using Jest"

# Codebuff will:
# 1. Analyze utility functions
# 2. Generate test cases for each function
# 3. Cover edge cases
# 4. Create __tests__/utils.test.ts
# 5. Show test file

# Review and save
npm test  # Verify tests pass
```

### Example 4: Review Code

**Task**: Get code quality review

```bash
# In CLI:
@reviewer "Review the security of auth/login.ts"

# Codebuff will:
# 1. Read auth/login.ts
# 2. Check for security issues
# 3. Find vulnerabilities
# 4. Suggest improvements
# 5. Provide detailed feedback

# Follow the recommendations
```

---

## Cost Optimization (Model Selection)

### Understanding Credits

- Each model call costs credits
- Local credits = testing only (not real money)
- Model costs vary by tier:
  - **Lite** (`--lite`): 1-2 credits
  - **Normal** (default): 3-5 credits
  - **Max** (`--max`): 10-15 credits

### Strategy

```bash
# For simple tasks, use lite (fast & cheap)
bun run start-bin --lite
# "Add a comment to this function"

# For normal tasks, use default (balanced)
bun run start-bin
# "Refactor this component"

# For complex reasoning, use max (best quality)
bun run start-bin --max
# "Design a new authentication system"
```

### Check Credit Usage

```bash
# In web dashboard:
# → Dashboard shows credit balance
# → Each task shows credits consumed

# To add more credits:
bun run start-studio
# → credit_ledger table → edit your entry
```

---

## Monitoring & Debugging

### Check if Services Are Running

```bash
# Database
docker ps | grep postgres
docker logs <container-id>

# Backend logs
# Check Terminal 2 where you ran: bun run start-server

# Web logs
# Check Terminal 3 where you ran: bun run start-web

# CLI logs
# Terminal 4 output shows live execution
```

### Common Runtime Issues

#### Task Fails - "Backend Error"
```bash
# Check backend is running (Terminal 2)
curl http://localhost:4242

# If error, restart:
# Terminal 2: Ctrl+C
# Terminal 2: bun run start-server
```

#### No Credits
```bash
# Database GUI: bun run start-studio
# Edit credit_ledger table - your entry
# Set principal = 10000, balance = 10000
```

#### Model API Error (OpenRouter)
```bash
# Verify API key is set
infisical secrets list | grep OPEN_ROUTER

# If missing, set it:
infisical secrets set OPEN_ROUTER_API_KEY=sk-or-YOUR_KEY

# Restart backend:
# Terminal 2: Ctrl+C && bun run start-server
```

#### Database Issues
```bash
# Check database is running
docker ps | grep postgres

# If down, restart:
# Terminal 1: Ctrl+C
# Terminal 1: bun run start-db

# If corrupted, reset:
docker-compose down
docker-compose up -d
infisical run -- bun --cwd packages/internal run db:migrate
```

---

## File Organization

### Your Project Structure

```
my-project/
├── src/
│   ├── components/
│   ├── utils/
│   ├── api/
│   └── ...
├── .git/
├── package.json
└── ... (your files)
```

### Codebuff Changes

Codebuff:
1. **Never** creates backups
2. **Does** modify files in place
3. **Uses** git to track changes

**Best Practice**: Commit before each Codebuff run

```bash
git add .
git commit -m "before: codebuff task"

# Now use Codebuff - changes go to working directory
# Review with: git diff

# If bad: git checkout .
# If good: git add . && git commit -m "after: codebuff changes"
```

---

## Performance Tips

### 1. Use Project Scope

Don't run Codebuff on huge projects (100k+ files):

```bash
# Bad - entire repo
cd /massive/monorepo
bun run start-bin
"Update dependency"  # Slow analysis

# Good - specific package
cd /massive/monorepo/packages/my-package
bun run start-bin
"Update dependency"  # Fast analysis
```

### 2. Be Specific in Tasks

```bash
# Vague - Codebuff wastes time
"Improve code"

# Specific - Codebuff acts fast
"Add error handling to fetchUser function in api/users.ts"
```

### 3. Use --lite for Small Tasks

```bash
# For simple changes, use lite mode
bun run start-bin --lite
"Add JSDoc comment to parseDate function"

# For complex changes, use max mode
bun run start-bin --max
"Refactor database query logic for performance"
```

### 4. Restart Services Daily

```bash
# At end of day:
# Terminal 1-4: Ctrl+C (all terminals)

# Next day, restart fresh:
bun run start-db
bun run start-server
bun run start-web
bun run start-bin
```

---

## Typical Daily Workflow

```
9:00 AM - Start services
├─ Terminal 1: bun run start-db
├─ Terminal 2: bun run start-server
├─ Terminal 3: bun run start-web
└─ Terminal 4: bun run start-bin

9:10 AM - Task 1: Add feature
├─ git commit -m "before: feature task"
├─ In CLI: "Add user profile page"
├─ Review changes: git diff
└─ git commit -m "after: feature complete"

10:30 AM - Task 2: Fix bug
├─ git commit -m "before: bug fix"
├─ In CLI: "Fix the login timeout issue in auth.ts"
├─ Review: git diff
└─ git commit -m "fix: login timeout issue"

12:00 PM - Task 3: Refactor
├─ git commit -m "before: refactor"
├─ In CLI: @reviewer "Review and suggest refactoring for utils.ts"
├─ In CLI: "Implement the reviewer's suggestions"
└─ git commit -m "refactor: improve utils performance"

3:00 PM - Clean up
├─ Terminal 1-4: Ctrl+C (graceful shutdown)
└─ git log --oneline (review day's work)
```

---

## Database Management

### View Database

```bash
bun run start-studio

# Browse tables:
# - credit_ledger: Your credit balance
# - user_sessions: Active sessions
# - agent_runs: Execution history
# - ... (schema)
```

### Backup Database

```bash
# Codebuff doesn't store important data in DB for you
# (just agent metadata and credits)
# No need to backup unless using for something critical

# If needed:
docker exec <postgres-container> pg_dump -U manicode_user_local manicode_db_local > backup.sql
```

### Reset Database

```bash
# Warning: Deletes all local data

docker-compose down
docker volume rm codebuff_postgres_data  # Or similar name
docker-compose up -d

# Re-run migrations
infisical run -- bun --cwd packages/internal run db:migrate
```

---

## Environment Variables

### Check Current Configuration

```bash
infisical secrets list

# Should show:
# OPEN_ROUTER_API_KEY=sk-or-...
# DATABASE_URL=postgresql://...
# CODEBUFF_GITHUB_ID=...
# CODEBUFF_GITHUB_SECRET=...
# ... and more
```

### Update Configuration

```bash
# Add/update a secret
infisical secrets set VARIABLE_NAME=new_value

# Restart backend to use new value
# Terminal 2: Ctrl+C
# Terminal 2: bun run start-server
```

---

## Stopping & Resuming

### Safe Shutdown (End of Day)

```bash
# Terminal 1: Ctrl+C
# Terminal 2: Ctrl+C
# Terminal 3: Ctrl+C
# Terminal 4: Ctrl+C (or type "exit")

# All services stop gracefully
```

### Resume Next Day

```bash
# Just repeat startup routine
bun run start-db
bun run start-server
bun run start-web
bun run start-bin

# All state preserved
```

---

## Troubleshooting Quick Reference

| Problem | Fix |
|---------|-----|
| Services won't start | Check ports: `lsof -i :4242`, `lsof -i :3000`, `lsof -i :5432` |
| "Out of credits" | `bun run start-studio` → edit credit_ledger |
| "Backend disconnected" | Check Terminal 2 logs, restart: `bun run start-server` |
| "Database error" | Check Terminal 1, restart: `bun run start-db` |
| "API key invalid" | `infisical secrets set OPEN_ROUTER_API_KEY=sk-or-...` |
| Models not responding | Check OpenRouter.ai status & API key validity |
| Web dashboard blank | Check Terminal 3 logs, restart: `bun run start-web` |
| Changes not applied | Check git working directory is clean: `git status` |

---

## Next Steps

1. **Start services**: Follow Daily Startup Routine
2. **Run first task**: Use CLI or web dashboard
3. **Monitor performance**: Check model responses and credits
4. **Iterate**: Review changes, commit, repeat

---

**Last Updated**: November 28, 2025  
**Target Platform**: Linux, macOS, Windows (WSL)  
**Status**: Production Ready with Google Gemini Models
