import { EventType } from "../enums/EventType";
import { GameEvent } from "../GameEvent";
import { GameState } from "../GameState";
import { Action } from "./Action";

export class Draw extends Action {
    override readonly canStack = true;

    static override ActionEnqueue(
        state: GameState,
        playerId: string,
        args: expectedArgs
    ): void {
        if (typeof args.amount !== "number") args.amount = 1;

        var action = new Draw();

        state.eventProcessor.processEvent(state, 
        {
            eventId: `E${++state.eventCounter}`,
            type: EventType.DrawCard,
            sourceId: playerId,
            targetId: args.targetPlayerId,
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

export interface expectedArgs {
    amount: number;
    targetPlayerId: string
}