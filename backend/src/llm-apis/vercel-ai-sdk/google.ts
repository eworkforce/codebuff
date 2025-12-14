import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { env } from '@codebuff/internal/env'

export const google = createGoogleGenerativeAI({
  apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta',
})
