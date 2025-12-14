import { base } from './base-factory.ts'
import { publisher } from '../constants.ts'

import type { SecretAgentDefinition } from '../types/secret-agent-definition.ts'

const definition: SecretAgentDefinition = {
  id: 'base-max',
  publisher,
  ...base('google/gemini-3-pro-preview', 'max'),
  spawnableAgents: [
    'file-explorer',
    'find-all-referencer',
    'researcher-web-sonnet',
    'researcher-docs-sonnet',
    'generate-plan',
    'decomposing-thinker',
    'reviewer',
    'context-pruner',
  ],
}

export default definition
