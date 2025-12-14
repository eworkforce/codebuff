import { createBase2 } from '../base2'
import type { SecretAgentDefinition } from '../../types/secret-agent-definition'

const definition: SecretAgentDefinition = {
  ...createBase2('default'),
  id: 'base2-gpt-5-single-step',
  model: 'google/gemini-2.5-pro',
  reasoningOptions: {
    enabled: true,
    effort: 'medium',
    exclude: false,
  },

  inputSchema: {},

  handleSteps: function* ({ params }) {
    // Run context-pruner before each step
    yield {
      toolName: 'spawn_agent_inline',
      input: {
        agent_type: 'context-pruner',
        params: params ?? {},
      },
      includeToolCall: false,
    } as any

    yield 'STEP'
  },
}

export default definition
