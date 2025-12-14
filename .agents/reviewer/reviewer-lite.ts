import { publisher } from '../constants'
import { createReviewer } from './reviewer'

import type { SecretAgentDefinition } from '../types/secret-agent-definition'

const definition: SecretAgentDefinition = {
  id: 'reviewer-lite',
  publisher,
  ...createReviewer('google/gemini-2.5-flash'),
}

export default definition
