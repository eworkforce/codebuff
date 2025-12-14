import codeReviewer from './code-reviewer'
import type { SecretAgentDefinition } from '../types/secret-agent-definition'

const definition: SecretAgentDefinition = {
  ...codeReviewer,
  id: 'code-reviewer-gpt-5',
  model: 'google/gemini-2.5-pro',
}

export default definition
