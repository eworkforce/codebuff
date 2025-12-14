#!/usr/bin/env bun
/**
 * Test script to debug CLI hello message issue
 */

import { CodebuffClient } from '../sdk/src/client'

const apiKey = process.env.CODEBUFF_API_KEY || ''
if (!apiKey) {
  console.error('CODEBUFF_API_KEY environment variable not set')
  process.exit(1)
}

console.log('Testing CLI with simple "hello" message...')
console.log('API Key:', apiKey.slice(0, 10) + '...')

const client = new CodebuffClient({
  apiKey,
  cwd: process.cwd(),
  handleEvent: (event) => {
    console.log('Event:', event)
  },
})

;(async () => {
  try {
    console.log('Sending message...')
    const result = await client.run({
      agent: 'base',
      prompt: 'hello',
    })
    console.log('Result:', result)
  } catch (error) {
    console.error('Error:', error)
    if (error instanceof Error) {
      console.error('Stack:', error.stack)
    }
  }
})()
