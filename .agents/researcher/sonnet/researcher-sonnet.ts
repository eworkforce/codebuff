import { type SecretAgentDefinition } from '../../types/secret-agent-definition'
import { publisher } from '../../constants'
import researcher from '../researcher-grok-4-fast'

const definition: SecretAgentDefinition = {
  ...researcher,
  id: 'researcher-sonnet',
  publisher,
  displayName: 'Researcher Sonnet',
  model: 'google/gemini-3-pro-preview',

  spawnableAgents: [
    'file-explorer',
    'researcher-web-sonnet',
    'researcher-docs-sonnet',
  ],
}

export default definition
