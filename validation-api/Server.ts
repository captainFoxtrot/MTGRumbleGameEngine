import { EnqueueValidationRequest } from "./models/ValidationModel";
import Fastify from "fastify";
import { RunEnqueueValidation } from "./ValidationRunner";

const app = Fastify({
    logger: true
});

app.get("/health", async () => {
    return {
        status: "ok"
    };
});

app.post<{
    Body: EnqueueValidationRequest
}>(
    "/validation/enqueue",
    async (request, reply) => {

        const result =
            await RunEnqueueValidation(request.body);

        return reply.send(result);
    }
);

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