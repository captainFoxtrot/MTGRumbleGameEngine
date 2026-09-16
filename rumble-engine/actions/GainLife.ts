import { EventType } from "../enums/EventType";
import { processEvent } from "../EventProcessor";
import { GameEvent } from "../GameEvent";
import { GameState } from "../GameState";
import { Action } from "./Action";

export class GainLife implements Action {

    Enqueue(
        state: GameState,
        playerId: string,
        args: any
    ): void {
        processEvent(state, {
            eventId: `E${++state.eventCounter}`,
            type: EventType.GainLife,
            targetId: playerId,
            args: {
                amount: args,
            },
            preventEventExecution: false,
            appliedEventReplacementIds: new Set(),
        }, this);
    }

    Do(state: GameState, event: GameEvent){
        const player = state.players[event.targetId];

        const args = event.args as {
            amount: number;
        };

        player.life += args.amount;
    }
}