#!/usr/bin/env bun
/**
 * Debug script to find the exact error
 */

import { CodebuffClient } from '../sdk/src/client'

const apiKey = 'cb_local_e9f6517bdb3546cbbb992d64d7c1845a'

console.log('=== Starting Debug Test ===')
console.log('API Key:', apiKey.slice(0, 20) + '...')
console.log('CWD:', process.cwd())

const client = new CodebuffClient({
  apiKey,
  cwd: process.cwd(),
  handleEvent: (event) => {
    console.log('[EVENT]', JSON.stringify(event, null, 2))
  },
  logger: {
    debug: (data: any, msg?: string) => console.log('[DEBUG]', msg || '', data),
    info: (data: any, msg?: string) => console.log('[INFO]', msg || '', data),
    warn: (data: any, msg?: string) => console.warn('[WARN]', msg || '', data),
    error: (data: any, msg?: string) => console.error('[ERROR]', msg || '', data),
  },
})

console.log('\n=== Sending "hello" message ===\n')

client.run({
  agent: 'base',
  prompt: 'hello',
})
  .then((result) => {
    console.log('\n=== SUCCESS ===')
    console.log('Output type:', result.output.type)
    if (result.output.type === 'error') {
      console.error('Error message:', result.output.message)
    } else {
      console.log('Result:', JSON.stringify(result.output, null, 2))
    }
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n=== FAILURE ===')
    console.error('Error:', error)
    console.error('Message:', error?.message)
    console.error('Stack:', error?.stack)
    process.exit(1)
  })

// Timeout after 30 seconds
setTimeout(() => {
  console.error('\n=== TIMEOUT after 30 seconds ===')
  process.exit(1)
}, 30000)
