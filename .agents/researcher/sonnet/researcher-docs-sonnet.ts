import { SecretAgentDefinition } from '../../types/secret-agent-definition'
import { publisher } from '../../constants'
import researcherDocs from '../researcher-docs'

const definition: SecretAgentDefinition = {
  ...researcherDocs,
  id: 'researcher-docs-sonnet',
  publisher,
  displayName: 'Docs Researcher Sonnet',
  model: 'google/gemini-3-pro-preview',
}

export default definition
