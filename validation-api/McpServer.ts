// validation-api/McpServer.ts

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

import { RunEnqueueValidation } from "./ValidationRunner";
import {
    EnqueueValidationRequest
} from "./models/ValidationModel";

export function createMcpServer(): McpServer {
    const server = new McpServer({
        name: "mtg-rumble-validator",
        version: "0.1.0"
    });

    server.tool(
        "validation_enqueue",
        "Execute one approved MTG Rumble engine action against a serialized game state and return the resulting state and execution trace.",
        {
            gameState: z.object({
                players: z.record(z.string(), z.any()),
                playerTurnOrder: z.array(z.string()),
                playerIdTurn: z.string(),
                phase: z.string(),
                eventCounter: z.number().int().nonnegative()
            }),
            action: z.object({
                type: z.string(),
                sourcePlayerId: z.string(),
                args: z.unknown()
            })
        },
        async ({ gameState, action }) => {
            const request: EnqueueValidationRequest = {
                gameState: gameState as EnqueueValidationRequest["gameState"],
                action
            };

            const result = await RunEnqueueValidation(request);

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(result)
                    }
                ]
            };
        }
    );

    return server;
}