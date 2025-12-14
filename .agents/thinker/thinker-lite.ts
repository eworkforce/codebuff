import type { SecretAgentDefinition } from 'types/secret-agent-definition'
import thinker from './thinker'

const definition: SecretAgentDefinition = {
  ...thinker,
  id: 'thinker-lite',
  displayName: 'Thinker Lite',
  model: 'google/gemini-2.5-flash',
}

export default definition
