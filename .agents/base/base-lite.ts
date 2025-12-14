import { base } from './base-factory.ts'
import { publisher } from '../constants.ts'

import type { SecretAgentDefinition } from '../types/secret-agent-definition.ts'
import { baseAgentAgentStepPrompt } from './base-prompts.ts'

const definition: SecretAgentDefinition = {
  id: 'base-lite',
  publisher,
  ...base('google/gemini-2.5-pro', 'lite'),
  reasoningOptions: {
    enabled: true,
    effort: 'medium',
    exclude: true,
  },
  toolNames: [
    'run_terminal_command',
    'str_replace',
    'write_file',
    'spawn_agents',
    'browser_logs',
    'code_search',
    'read_files',
  ],
  spawnableAgents: [
    'file-explorer',
    'find-all-referencer',
    'researcher-web',
    'researcher-docs',
    'gpt5-thinker',
    'reviewer-lite',
    'context-pruner',
  ],

  stepPrompt:
    baseAgentAgentStepPrompt('google/gemini-2.5-pro') +
    ` Don't forget to spawn any helper agents as you go: file-explorer, find-all-referencer, researcher-web, researcher-docs, thinker, reviewer-lite`,
}

export default definition
