import planStep from './base2-plan-step'
import type { SecretAgentDefinition } from '../../types/secret-agent-definition'

const definition: SecretAgentDefinition = {
  ...planStep,
  id: 'base2-plan-step-gpt-5',
  model: 'google/gemini-2.5-pro',
}

export default definition
