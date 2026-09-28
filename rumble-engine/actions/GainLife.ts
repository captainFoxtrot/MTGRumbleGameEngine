import { EventType } from "../enums/EventType";
import { GameEvent } from "../GameEvent";
import { GameState } from "../GameState";
import { Action } from "./Action";

export class GainLife extends Action {

    static override Enqueue(
        state: GameState,
        playerId: string,
        args: expectedArgs
    ): void {
        if(typeof args.amount !== "number") args.amount = 1;
        var action = new GainLife();
        state.eventProcessor.processEvent(state, {
            eventId: `E${++state.eventCounter}`,
            type: EventType.GainLife,
            sourceId: playerId,
            targetId: args.targetPlayerId,
            args: args,
            preventEventExecution: false,
            appliedEventReplacementIds: new Set(),
        }, action);
    }

    Do(state: GameState, event: GameEvent){
        if(!event.targetId) {
            throw new Error("TargetId is required for GainLife event.");
        }
        const player = state.players[event.targetId];

        const args = event.args as expectedArgs;

        player.life += args.amount;
    }
}

interface expectedArgs {
    amount: number;
    targetPlayerId: string;
}