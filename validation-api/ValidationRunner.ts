import { EnqueueValidationRequest, EnqueueValidationResponse, SerializedCardInstance } from "./models/ValidationModel";
import { hydrateGameState, serializeGameState } from "./GameStateSerialization";

import { CardInstance } from "../rumble-engine/cards/Card";
import { GetCard } from "./CardRegistry";
import { RuntimeCardInstance } from "./RuntimeCardInstance";
import { TraceEventProcessor } from "./TraceEventProcessor";
import { enqueueAction } from "./ActionRegistry";

function hydrateCard(
    input: SerializedCardInstance
): CardInstance {

    const card = GetCard(input.cardId);

    return new RuntimeCardInstance(
        input.instanceId,
        card,
        input.ownerId,
        input.controllerId,
        input.tapped,
        input.damageMarked,
        input.counters
    );
}

export async function RunEnqueueValidation(
    request: EnqueueValidationRequest
): Promise<EnqueueValidationResponse> {

    const processor = new TraceEventProcessor();

    try {
        const state = hydrateGameState(
            request.gameState,
            processor
        );

        await enqueueAction(
            state,
            request.action.type,
            request.action.sourcePlayerId,
            request.action.args
        );

        return {
            success: true,
            finalState: serializeGameState(state),
            trace: processor.trace
        };

    } catch (error) {

        return {
            success: false,
            trace: processor.trace,

            error: {
                code: "ENGINE_EXECUTION_FAILED",
                message:
                    error instanceof Error
                        ? error.message
                        : String(error)
            }
        };
    }
}