import { publisher } from './constants'
import { type SecretAgentDefinition } from './types/secret-agent-definition'
import readOnlyCommander from './read-only-commander'

const readOnlyCommanderLite: SecretAgentDefinition = {
  ...readOnlyCommander,
  id: 'read-only-commander-lite',
  displayName: 'ReadOnly Commander Lite',
  publisher,
  model: 'google/gemini-2.5-flash',
  spawnerPrompt:
    'Can run quick read-only terminal commands and report back on the results. Has a basic understanding of the codebase. Is speedy and low-cost,',
}

export default readOnlyCommanderLite
