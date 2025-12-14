import { base } from './base-factory.ts'
import { publisher } from '../constants.ts'

import type { SecretAgentDefinition } from '../types/secret-agent-definition.ts'

const definition: SecretAgentDefinition = {
  id: 'base',
  publisher,
  ...base('google/gemini-3-pro-preview', 'normal'),
}

export default definition
