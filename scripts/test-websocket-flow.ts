import WebSocket from 'ws';
import fs from 'fs';
import os from 'os';
import path from 'path';

const WS_URL = 'ws://localhost:4242/ws';

async function main() {
    console.log("Starting WebSocket Integration Test...");

    // 1. Get Auth Token
    const configPath = path.join(os.homedir(), '.config/manicode-dev/credentials.json');
    if (!fs.existsSync(configPath)) {
        console.error("Config file not found:", configPath);
        process.exit(1);
    }
    const creds = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const authToken = creds.default.authToken;
    const userId = creds.default.id;
    console.log("Auth Token:", authToken);
    console.log("User ID:", userId);

    // 2. Connect
    const ws = new WebSocket(WS_URL);

    ws.on('open', () => {
        console.log("Connected to WebSocket.");

        // 3. Send Prompt
        const promptId = 'test-prompt-' + Date.now();
        const msg = {
            type: 'action',
            txid: 'tx-' + Date.now(),
            data: {
                type: 'prompt',
                fingerprintId: 'test-fingerprint',
                authToken: authToken,
                promptId: promptId,
                prompt: 'Hello from test script',
                costMode: 'normal',
                files: [],
                sessionState: {
                    fileContext: {
                        files: {},
                        codebuffConfig: {},
                        fileTree: [],
                        customToolDefinitions: {},
                        ignorePatterns: [],
                        customPrompts: {},
                        mcpServers: []
                    },
                    mainAgentState: {
                        messageHistory: [],
                        creditsUsed: 0,
                        directCreditsUsed: 0,
                        ancestorRunIds: [],
                        stepsRemaining: 10,
                        agentId: 'base',
                        agentType: 'base',
                        childRunIds: [],
                        agentContext: {}
                    }
                }
            }
        };
        console.log("Sending prompt...", JSON.stringify(msg));
        ws.send(JSON.stringify(msg));
    });

    ws.on('message', (data) => {
        const str = data.toString();
        // console.log("Received:", str); // Verbose
        
        try {
            const json = JSON.parse(str);
            if (json.type === 'ack') {
                console.log("ACK Received:", json.success ? "Success" : "Failed", json.error || "");
            } else if (json.type === 'action') {
                const action = json.data;
                if (action.type === 'agent-chunk') {
                    if (action.chunk.type === 'text') {
                        process.stdout.write(action.chunk.text);
                    } else if (action.chunk.type === 'error') {
                        console.error("\nAgent Error:", action.chunk.message);
                    }
                } else if (action.type === 'usage-response') {
                    console.log("\nUsage update received.");
                } else {
                    console.log("\nAction received:", action.type);
                    console.log(JSON.stringify(action, null, 2));
                }
            }
        } catch (e) {
            console.log("Received non-JSON:", str);
        }
    });

    ws.on('error', (err) => {
        console.error("WebSocket Error:", err);
    });

    ws.on('close', () => {
        console.log("\nWebSocket Closed.");
    });
}

main();
