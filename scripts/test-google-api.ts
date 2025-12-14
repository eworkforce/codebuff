import { google } from '../backend/src/llm-apis/vercel-ai-sdk/google';
import { streamText } from 'ai';

// Simple test script to verify Google API connection
// Run with: bun scripts/test-google-api.ts

console.log("Testing Google API connection (Streaming)...");

// Mock ENV if needed (though bun should load .env if in root)
// If running from root, bun automatically loads .env
if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error("Error: GOOGLE_GENERATIVE_AI_API_KEY not found in environment.");
    console.log("Make sure you are running this with 'bun scripts/test-google-api.ts' from project root.");
    process.exit(1);
}

console.log("API Key found (length):", process.env.GOOGLE_GENERATIVE_AI_API_KEY.length);

async function test() {
    try {
        // Try with a known valid model ID first to verify connection
        const modelId = 'gemini-3-pro-preview'; 
        console.log(`Sending request to model: ${modelId}`);
        
        const result = await streamText({
            model: google(modelId),
            prompt: 'Say hello!',
        });

        console.log("Stream started...");
        for await (const chunk of result.textStream) {
            process.stdout.write(chunk);
        }
        console.log("\nStream finished.");
    } catch (error) {
        console.error("Error invoking model:", error);
    }
}

test();
