import { EventType } from "../enums/EventType";
import { Zone } from "../enums/Zone";
import { processEvent } from "../EventProcessor";
import { GameEvent } from "../GameEvent";
import { GameState } from "../GameState";
import { Action } from "./Action";
import { Move } from "./Move";

export class Exile extends Action {

    static override Enqueue(
        state: GameState,
        playerId: string,
        args: expectedArgs
    ): void {
        var action = new Exile();

        processEvent(state, 
        {
            eventId: `E${++state.eventCounter}`,
            type: EventType.ExileCard,
            sourceId: playerId,
            targetId: args.fromTargetPlayerId,
            args: args,
            preventEventExecution: false,
            appliedEventReplacementIds: new Set(),
        }, 
        action);
    }

    Do(state: GameState, event: GameEvent){
        let args = event.args as expectedArgs;
        var player = args.fromTargetPlayerId;
        var library = state.players[player].library;
        
        const amount = Math.min(
            args.amount,
            library.length
        );

        for (let i = 0; i < amount; i++) {
            Move.Enqueue(state, args.fromTargetPlayerId,{
                fromZone: Zone.Library,
                toZone: Zone.Exile,
                targetCardInstanceId: library[0].instanceId,
                toTargetPlayerId: args.fromTargetPlayerId,
                fromTargetPlayerId: args.fromTargetPlayerId,
                isCast: false
            });    
        };   
    }
}

interface expectedArgs {
    amount: number;
    fromTargetPlayerId: string;
}