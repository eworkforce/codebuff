import { createBase2 } from '../base2'
import type { SecretAgentDefinition } from '../../types/secret-agent-definition'

const base2 = createBase2('default')
const definition: SecretAgentDefinition = {
  ...base2,
  id: 'base2-plan-step',
  model: 'google/gemini-3-pro-preview',
  displayName: 'Plan Step',
  spawnerPrompt: "Plans the next step in the user's request.",

  includeMessageHistory: true,
  inheritParentSystemPrompt: true,
  systemPrompt: undefined,

  // No tools or spawnable agents, this agent merely plans.
  toolNames: [],
  spawnableAgents: [],

  inputSchema: {},
  outputMode: 'last_message',

  handleSteps: function* ({ params }) {
    yield 'STEP'
  },
}

export default definition
