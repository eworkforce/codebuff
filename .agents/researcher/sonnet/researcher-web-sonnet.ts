import { SecretAgentDefinition } from '../../types/secret-agent-definition'
import { publisher } from '../../constants'
import researcherWeb from '../researcher-web'

const definition: SecretAgentDefinition = {
  ...researcherWeb,
  id: 'researcher-web-sonnet',
  publisher,
  displayName: 'Web Researcher Sonnet',
  model: 'google/gemini-3-pro-preview',
}

export default definition
