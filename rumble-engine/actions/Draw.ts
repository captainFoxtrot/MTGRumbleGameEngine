import { EventType } from "../enums/EventType";
import { processEvent } from "../EventProcessor";
import { GameEvent } from "../GameEvent";
import { GameState } from "../GameState";
import { Action } from "./Action";

export class Draw extends Action {

    static override Enqueue(
        state: GameState,
        playerId: string,
        args: expectedArgs
    ): void {
        if (typeof args.amount !== "number") args.amount = 1;

        var action = new Draw(args);

        processEvent(state, 
        {
            eventId: `E${++state.eventCounter}`,
            type: EventType.DrawCard,
            targetId: playerId,
            args: args,
            preventEventExecution: false,
            appliedEventReplacementIds: new Set(),
        }, 
        action);
    }

    Do(state: GameState, event: GameEvent){
        if(!event.targetId) {
            throw new Error("TargetId is required for Draw event.");
        }
        const player = state.players[event.targetId];
        const args = event.args as expectedArgs;

        let amount: number; 
        if (typeof args.amount !== "number") amount = 1;
        else amount = args.amount;

        for (let i = 0; i < amount; i++) {
            const card = player.library.shift();

            if (card) {
                player.hand.push(card);
            }
        }    
    }
}

interface expectedArgs {
    amount: number;
}