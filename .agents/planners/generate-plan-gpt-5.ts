import generatePlan from './generate-plan'
import type { SecretAgentDefinition } from '../types/secret-agent-definition'

const definition: SecretAgentDefinition = {
  ...generatePlan,
  id: 'generate-plan-gpt-5',
  model: 'google/gemini-2.5-pro',
}

export default definition
