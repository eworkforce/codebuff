import editor from './editor'
import type { SecretAgentDefinition } from '../types/secret-agent-definition'

const definition: SecretAgentDefinition = {
  ...editor,
  id: 'editor-gpt-5',
  model: 'google/gemini-2.5-pro',
}

export default definition
