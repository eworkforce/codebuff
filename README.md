# Codebuff

Codebuff is an **open-source, self-hostable AI coding assistant** that edits your codebase through natural language instructions. It uses a sophisticated multi-agent architecture to understand your project, plan changes, and execute them with precision.

Unlike other tools that rely on proprietary cloud services, Codebuff can run **entirely on your machine** or your own infrastructure, giving you full control over your data and model usage.

<div align="center">
  <img src="./assets/codebuff-vs-claude-code.png" alt="Codebuff vs Claude Code" width="400">
</div>

Codebuff supports **Google Gemini 3 Pro**, **Gemini 2.5**, and other state-of-the-art models via OpenRouter or direct integration.

## Key Features

- **🏠 Fully Self-Hostable**: Run the entire stack (CLI, Backend, Database) locally. No usage limits, no credit system required.
- **🤖 Multi-Agent Architecture**: Specialized agents for File Exploration, Planning, Editing, and Reviewing work together.
- **⚡ Direct Model Access**: Connect directly to Google's Gemini API or OpenRouter without intermediate proxies.
- **🛠️ Extensible SDK**: Build custom agents and tools using TypeScript.

## Quick Start (Self-Hosted)

Codebuff is designed to be easy to self-host. Follow these steps to get running in minutes:

### 1. Prerequisites

- **Bun**: Codebuff uses [Bun](https://bun.sh) for fast execution.
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```
- **PostgreSQL**: You need a local Postgres database running.
  ```bash
  # Example using Docker
  docker run -d --name codebuff-db -e POSTGRES_PASSWORD=secretpassword_local -p 5432:5432 postgres
  ```

### 2. Setup Repository

```bash
git clone https://github.com/eworkforce/codebuff.git
cd codebuff
bun install
```

### 3. Configure Environment

Copy the example environment file and configure your API keys:

```bash
cp .env.example .env
```

Edit `.env` and set your model keys:
```env
# For direct Google model access (Recommended for self-hosting)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Database URL
DATABASE_URL=postgresql://postgres:secretpassword_local@localhost:5432/postgres
```

### 4. Initialize Local Environment

We provide helper scripts to setup your local user and publisher:

```bash
# 1. Start the database (if not using docker command above)
bun run start-db

# 2. Run migrations
bun --cwd packages/internal run db:migrate

# 3. Create a local admin user (grants unlimited credits)
bun run scripts/create-local-user.ts

# 4. Create the default 'codebuff' publisher
bun run scripts/create-publisher.ts
```

### 5. Run Codebuff

You need two terminals:

**Terminal 1: Backend Server**
```bash
bun run start-server
# Runs on port 4242
```

**Terminal 2: CLI**
```bash
bun --cwd cli dev
```

Now you can chat with Codebuff directly in your terminal!

## Architecture

Codebuff consists of three main components:

1.  **CLI (TUI)**: A rich terminal user interface built with React and OpenTUI. It handles user input and displays agent progress.
2.  **Backend Server**: An Express/WebSocket server that orchestrates agents, manages context, and communicates with LLMs.
3.  **SDK**: A TypeScript library for building and running agents programmatically.

In self-hosted mode, the CLI connects directly to your local Backend Server (`localhost:4242`), which communicates directly with model providers (Google, OpenRouter).

## Development

See [WARP.md](./WARP.md) for detailed development guidelines, architectural deep dives, and contribution rules.

## SDK Usage

You can also use Codebuff programmatically in your own applications:

```bash
npm install @codebuff/sdk
```

```typescript
import { CodebuffClient } from '@codebuff/sdk'

const client = new CodebuffClient({
  apiKey: 'your-local-api-key', // From scripts/create-local-user.ts output
  cwd: process.cwd()
})

const result = await client.run({
  agent: 'base',
  prompt: 'Refactor this file to use async/await'
})

console.log(result.output)
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

[Apache 2.0](./LICENSE)
