import { EventType } from "../enums/EventType";
import { processEvent } from "../EventProcessor";
import { GameEvent } from "../GameEvent";
import { GameState } from "../GameState";
import { Action } from "./Action";

export class Draw implements Action {

    Enqueue(
        state: GameState,
        playerId: string,
        arg: any,
        eventId?: string
    ): void {
        let amount: number;
        if (typeof arg !== "number") amount = 1;
        else amount = arg;

        let action = this;

        for (let i = 0; i < amount; i++) {
            processEvent(state, 
            {
                eventId: `E${++state.eventCounter}`,
                type: EventType.DrawCard,
                targetId: playerId,
                args: {
                    amount: arg,
                },
                preventEventExecution: false,
                appliedEventReplacementIds: new Set(),
            }, 
            action);
        }
    }

    Do(state: GameState, event: GameEvent){
        const player = state.players[event.targetId];

        const card = player.library.shift();

        if (card) {
            player.hand.push(card);
        }
    }
}