# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

Codebuff is an open-source AI coding assistant that coordinates specialized agents through a multi-agent architecture. It supports both CLI and SDK usage, with a full web dashboard for agent management.

## Architecture

### Monorepo Structure

Codebuff uses Bun workspaces to organize multiple packages. All workspaces share common dependencies and patterns. Use `bun` (not `npm` or `yarn`) for all package management.

This is a Bun-based monorepo with the following key packages:

- **backend/**: Express WebSocket server on port 4242, LLM integration via OpenRouter, agent orchestration, tool execution
- **cli/**: Modern Terminal User Interface (TUI) using OpenTUI and React (new CLI entry point)
- **npm-app/**: Legacy CLI application (command-line client, uses WebSocket to connect to backend)
- **web/**: Next.js web application (port 3000) with agent dashboard, authentication, credit management
- **sdk/**: TypeScript SDK for programmatic usage, wraps backend WebSocket API
- **common/**: Shared code, database schemas (Drizzle ORM), tool definitions, type definitions, utilities
- **.agents/**: Agent definition files (TypeScript-based YAML/object definitions)
  - Contains ~50+ specialized agents with handleSteps() generator functions for programmatic control
- **packages/**: Internal packages
  - **agent-runtime/**: Core agent execution runtime with QuickJS sandbox for safe execution
  - **billing/**: Billing and credit management via Stripe integration
  - **bigquery/**: BigQuery integration for usage analytics
  - **code-map/**: Code analysis and architecture mapping utilities
  - **internal/**: Drizzle database schemas and migrations
- **evals/**: Evaluation framework using unique git commit reimplementation methodology (benchmarking)
- **python-app/**: Python version of the CLI (experimental, not primary)

### Multi-Agent System

Codebuff uses a specialized multi-agent approach where different agents handle specific tasks:

- **Base Agent**: Main coding agent that coordinates other agents
- **File Explorer Agent**: Scans codebase to understand architecture
- **Planner Agent**: Plans file changes and execution order
- **Editor Agent**: Makes precise code edits
- **Reviewer Agent**: Validates changes
- **Context Pruner**: Manages context window
- **Researcher**: Gathers information from docs and web

Agents are defined in `.agents/` as TypeScript files with a standardized structure.

### Communication Flow

The WebSocket-based architecture enables real-time, bidirectional communication:

1. Client (CLI/web) connects to backend WebSocket server on port 4242
2. Client sends user input, project context, and requested agent to server
3. Backend streams response chunks back to client in real-time
4. Backend may invoke tools requiring client-side execution
5. Client executes tools (read files, run terminal commands) and returns results
6. Backend processes results and continues agent reasoning
7. Responses are streamed to client until agent completes or user stops

### Tool System

Tools are the primary way agents interact with the codebase and environment. They are defined in `common/src/tools/`:
- **Parameters**: `params/tool/*.ts` - Input schemas for each tool (Zod definitions)
- **Definitions**: `list.ts` - Tool registry with input/output schemas and metadata
- **Constants**: `constants.ts` - Tool-related configuration

Key tools include:
- **File operations**: `read_files`, `write_file`, `str_replace`, `glob`
- **Terminal**: `run_terminal_command`
- **Agent orchestration**: `spawn_agents`, `spawn_agent_inline`
- **Code analysis**: `code_search`, `find_files`
- **Planning**: `create_plan`, `write_todos`
- **Web**: `web_search`, `read_docs`

Tools are implemented server-side (backend) or client-side (CLI) depending on the operation. When a tool is invoked, the backend streams back the tool call and waits for the client to execute and return results.

### Database & Secrets

- **Database**: PostgreSQL with Drizzle ORM
- **Secrets Management**: Infisical CLI (see INFISICAL_SETUP_GUIDE.md)
- **Migrations**: Stored in `packages/internal/drizzle/`
- **Schema**: `packages/internal/src/db/schema/`

## Development Commands

### Prerequisites Setup

```bash
# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash

# Install direnv and hook it into your shell
brew install direnv  # macOS
sudo apt install direnv  # Ubuntu/Debian
eval "$(direnv hook zsh)"  # Add to ~/.zshrc

# Install Infisical for secrets
npm install -g @infisical/cli
infisical login
```

### Initial Setup

```bash
# Clone and enter repo
git clone https://github.com/CodebuffAI/codebuff.git
cd codebuff

# Install dependencies
bun install

# Setup Infisical secrets (see CONTRIBUTING.md for full guide)
infisical init
infisical secrets set --file .env.example

# Allow direnv
direnv allow
```

### Running Development Services

The full development environment requires 3 terminals:

```bash
# Terminal 1: Backend server (start first)
bun run start-server
# Expected output: 🚀 Server is running on port 4242

# Terminal 2: Web server (start second)
bun run start-web
# Expected output: Ready on http://localhost:3000

# Terminal 3: CLI client (start last)
# For the new TUI CLI (Recommended):
bun --cwd cli dev

# For the legacy CLI:
bun --cwd npm-app run start-bin
```

### Testing

```bash
# Run tests for core packages (backend, common, npm-app, agents)
bun run test

# Run all tests (including those not in the default filter)
bun test

# Run tests in watch mode
bun test --watch

# Run specific test file
bun test path/to/test.test.ts

# Run tests in specific workspace
bun --filter=@codebuff/backend run test
bun --filter=@codebuff/common run test
bun --filter=@codebuff/cli run test

# Run tests with summary script (used in hooks)
scripts/run-tests-summary

# Interactive E2E tests (requires tmux)
cd cli
bun run test:tmux-poc
```

### Type Checking

```bash
# Check all workspaces
bun run typecheck

# Check specific workspace
bun --cwd backend run typecheck
bun --cwd web run typecheck
bun --cwd cli run typecheck
```

### Database

```bash
# Start database (Docker required)
bun run start-db

# Start Drizzle Studio (database GUI)
bun run start-studio
# Navigate to https://local.drizzle.studio/

# Run migrations
infisical run -- bun --cwd packages/internal run db:migrate
```

### Code Quality

```bash
# Format code with prettier
bun run format

# Lint and fix imports (via ESLint)
bun run eslint --fix '**/*.{ts,tsx,js,jsx}'

# Clean TypeScript build artifacts
bun run clean-ts

# Regenerate tool definitions (run after changing common/src/tools/)
bun run generate-tool-definitions
```

### Linting

The project uses ESLint for code quality with these configurations:
- **Config file**: `eslint.config.js` at root
- **Enabled checks**: Import organization, unused imports, TypeScript types
- **Format**: ESLint flat config format (eslint.config.js)
- **Run via**: `bun run eslint` or use file change hooks (runs automatically)

FileWatch hooks automatically run ESLint fixes on TypeScript/JavaScript file changes (see `codebuff.json`).

### Agent Development

```bash
# Initialize agent development setup in user projects
codebuff init-agents

# Publish agents to local database (for testing)
bun run start-bin publish base context-pruner file-explorer file-picker researcher thinker reviewer
```

### Releases

```bash
# Release CLI
bun run release:cli

# Release SDK
bun run release:sdk
```

## Development Notes

### File Change Hooks

The `codebuff.json` file defines file change hooks that automatically run on file modifications:
- Unit tests for changed packages
- Type checking
- Prettier formatting
- ESLint fixes
- Tool definition regeneration

These run automatically via Codebuff's file watching system.

### Agent Definitions

Agent files follow this structure:

```typescript
import type { SecretAgentDefinition } from '../types/secret-agent-definition.ts'

const definition: SecretAgentDefinition = {
  id: 'agent-name',
  publisher: 'codebuff',
  displayName: 'Agent Display Name',
  model: 'google/gemini-2.5-pro',
  toolNames: ['read_files', 'write_file', 'end_turn'],
  instructionsPrompt: 'Agent instructions...',
  // ... other properties
}

export default definition
```

Use `handleSteps()` generator for programmatic control flow.

### Common Pitfalls

1. **Database Connection Errors**: Ensure DATABASE_URL is set correctly in both `.env` and Infisical
2. **Missing Credits**: Use Drizzle Studio to add credits to your account in the `credit_ledger` table
3. **Empty Agent Store**: Agents must be published to the database to appear in dev mode
4. **Direnv Not Working**: Make sure direnv hook is added to shell config and `direnv allow` was run
5. **Package Dependencies**: Use `bun install` (not npm/yarn) for workspace:* dependencies

### Model Usage

Codebuff primarily uses Google Gemini models via OpenRouter. Models are configured in agent definitions:
- `google/gemini-3-pro-preview` - Default, high quality reasoning
- `google/gemini-2.5-pro` - Balanced performance
- `google/gemini-2.5-flash` - Fast execution, budget-friendly
- `google/gemini-2.5-flash-lite` - Lightweight tasks

Configure via agent definition's model field. Model definitions are centralized in common/src/old-constants.ts with mode-based selection.

### Evaluation System

The evals system (`evals/`) uses a unique git commit reimplementation methodology:

```bash
# Run single evaluation
bun run evals/git-evals/run-single-eval.ts \
  --eval-file eval-codebuff.json \
  --commit-index 0 \
  --agent base

# Run full evaluation set
bun run evals/git-evals/run-eval-set.ts

# Compare multiple agents
bun run evals/git-evals/run-eval-set.ts \
  --agents base,base2,base-lite

# Generate new evaluation from repo
bun run evals/git-evals/gen-repo-eval.ts \
  https://github.com/user/repo \
  ./picked-commits.json \
  ./eval-output.json
```

See `evals/README.md` for comprehensive documentation on the evaluation framework.

### Testing Interactive CLI

For interactive TUI testing, tmux is required:

```bash
# Install tmux
brew install tmux  # macOS
sudo apt-get install tmux  # Ubuntu/Debian

# Run proof-of-concept test
cd cli
bun run test:tmux-poc
```

See `cli/src/__tests__/README.md` for full interactive testing documentation.

## Key Patterns

### Tool Definition

All tools must be registered in `common/src/tools/list.ts` with:
1. Input schema (Zod)
2. Output schema (Zod)
3. Optional example inputs
4. Implementation in backend or client

### Workspace References

Use `workspace:*` in package.json for internal dependencies:

```json
{
  "dependencies": {
    "@codebuff/common": "workspace:*",
    "@codebuff/sdk": "workspace:*"
  }
}
```

### Imports

- Use specific imports: `import { thing } from 'module'`
- Avoid `import *` patterns
- Use Bun's native TypeScript support (no transpilation needed in dev)

### Testing

- Use `spyOn()` for mocking functions
- Clean up with `mock.restore()` in `afterEach()`
- Avoid `mock.module()` pattern

### API Endpoint Architecture

All API endpoints in `web/src/app/api/v1/` follow a consistent dependency injection pattern:

**Structure**: Implementation file contains business logic with injected dependencies, route handler is a minimal wrapper, contract types define function interfaces in `common/src/types/contracts/`, and unit tests use mocked dependencies.

**Benefits**: Easy to mock dependencies, type-safe contracts, clear separation of concerns, consistent patterns.

### Error Handling Pattern

Prefer `ErrorOr<T>` return types over throwing errors. Return `success(value)` or `failure(error)` from `common/src/util/error.ts`. This allows callers to handle errors explicitly without try-catch and makes error cases visible in function signatures.

### Interactive Git Commands

Always use tmux when running interactive git commands (e.g., `git rebase --continue`, `git add -p`, `git commit --amend`). Codebuff agents cannot interact with prompts requiring user input. Use tmux to provide an interactive session where users can handle git prompts manually.

## External Resources

- **Documentation**: https://codebuff.com/docs
- **Discord**: https://codebuff.com/discord
- **Contributing Guide**: CONTRIBUTING.md
- **Infisical Setup**: INFISICAL_SETUP_GUIDE.md
- **Agent Store**: https://codebuff.com/store
- **GitHub**: https://github.com/CodebuffAI/codebuff
