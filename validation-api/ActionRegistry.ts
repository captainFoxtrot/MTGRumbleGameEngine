import {
    DealDamage,
    expectedArgs as DealDamageArgs
} from "../rumble-engine/actions/DealDamage";
import {
    Draw,
    expectedArgs as DrawArgs
} from "../rumble-engine/actions/Draw";
import {
    Move,
    expectedArgs as MoveArgs
} from "../rumble-engine/actions/Move";

import { GameState } from "../rumble-engine/GameState";

export async function enqueueAction(
    state: GameState,
    type: string,
    sourcePlayerId: string,
    args: unknown
): Promise<void> {

    switch (type.toUpperCase()) {

        case "DRAW":
            await Draw.Enqueue(
                state,
                sourcePlayerId,
                args as DrawArgs
            );
            return;

        case "MOVE":
            await Move.Enqueue(
                state,
                sourcePlayerId,
                args as MoveArgs
            );
            return;

        case "DEAL_DAMAGE":
            await DealDamage.Enqueue(
                state,
                sourcePlayerId,
                args as DealDamageArgs
            );
            return;

        default:
            throw new Error(
                `Unknown or forbidden validation action: ${type}`
            );
    }
}