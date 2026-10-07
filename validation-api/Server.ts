// Server.ts

import Fastify from "fastify";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import { createMcpServer } from "./McpServer";
import { RunEnqueueValidation } from "./ValidationRunner";

const app = Fastify({
    logger: true
});

app.get("/health", async () => {
    return {
        status: "ok"
    };
});

// Your existing REST endpoint
app.post("/validation/enqueue", async (request, reply) => {
    const result =
        await RunEnqueueValidation(request.body as any);

    return reply.send(result);
});

// MCP endpoint
app.all("/mcp", async (request, reply) => {
    const server = createMcpServer();

    const transport =
        new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined
        });

    await server.connect(transport);

    await transport.handleRequest(
        request.raw,
        reply.raw,
        request.body
    );
});

async function start(): Promise<void> {
    try {
        await app.listen({
            port: 3000,
            host: "0.0.0.0"
        });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

start();