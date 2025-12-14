import { promptAiSdkStream } from '../backend/src/llm-apis/vercel-ai-sdk/ai-sdk';
import { logger } from '../cli/src/utils/logger';

// Mock params
const params = {
    apiKey: 'dummy_key',
    runId: 'test-run-id',
    messages: [
        { role: 'user', content: 'Hello, who are you?' }
    ],
    clientSessionId: 'test-session',
    fingerprintId: 'test-fingerprint',
    model: 'google/gemini-3-pro-preview',
    userId: 'bedcc237-6ed7-4642-be38-5effa4c463ef', // Local Admin ID
    userInputId: 'test-input-id',
    logger: console, // Use console as logger
    trackEvent: () => {},
    sendAction: () => {},
    // Live user input state mock
    liveUserInputRecord: {
        'bedcc237-6ed7-4642-be38-5effa4c463ef': ['test-input-id']
    },
    sessionConnections: {
        'test-session': true
    },
    getLiveUserInputIds: () => [],
};

// Mock checkLiveUserInput if necessary (it imports from @codebuff/agent-runtime)
// Ideally, we should mock the module, but bun makes that tricky without a test runner.
// However, the function `checkLiveUserInput` takes params. 
// `promptAiSdkStream` calls `checkLiveUserInput({ ...params })`.
// `checkLiveUserInput` checks `params.liveUserInputRecord`. 
// Wait, `liveUserInputRecord` is passed in params?
// In `ai-sdk.ts`: `checkLiveUserInput({ ...params, clientSessionId: params.clientSessionId })`
// Let's verify `checkLiveUserInput` signature.

async function test() {
    console.log("Starting backend stream test...");
    
    // We need to inject liveUserInputRecord into params if checkLiveUserInput expects it.
    // Looking at ai-sdk.ts imports: 
    // import { checkLiveUserInput } from '@codebuff/agent-runtime/live-user-inputs'
    // It imports it! It's NOT passed in params.
    // This is a problem for the script because `checkLiveUserInput` relies on GLOBAL state or imported state.
    
    // If `checkLiveUserInput` uses a singleton or exported object, we might fail here if we don't populate it.
    
    try {
        const generator = promptAiSdkStream(params as any);
        
        console.log("Generator created. Iterating...");
        
        for await (const chunk of generator) {
            console.log("Chunk:", chunk);
        }
        
        console.log("Stream finished.");
    } catch (error) {
        console.error("Stream failed:", error);
    }
}

test();
