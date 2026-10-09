import { EventType } from "../enums/EventType";
import { Zone } from "../enums/Zone";
import { GameEvent } from "../GameEvent";
import { GameState, GetPlayerZone } from "../GameState";
import { Action } from "./Action";

export class Move extends Action {
    
    static override ActionEnqueue(
        state: GameState,
        playerId: string,
        args: expectedArgs
    ): void {
        var action = new Move();
        state.eventProcessor.processEvent(state, 
        {
            eventId: `E${++state.eventCounter}`,
            type: EventType.MoveCard,
            sourceId: playerId,
            targetId: args.targetCardInstanceId,
            args: args,
            preventEventExecution: false,
            appliedEventReplacementIds: new Set(),
        }, 
        action);
    }

    Do(state: GameState, event: GameEvent){
        if(event.sourceId === undefined) {
            throw new Error("MoveCard action requires a sourceId");
        }
        const args = event.args as expectedArgs;
        const controllingPlayer = state.players[args.fromTargetPlayerId];
        const targetPlayer = state.players[args.toTargetPlayerId];
        const fromZone = GetPlayerZone(controllingPlayer, args.fromZone);

        const cardIndex = fromZone.findIndex(card => card.instanceId === args.targetCardInstanceId);
        if(cardIndex === -1) {
            throw new Error(`Card with instanceId ${args.targetCardInstanceId} not found in zone ${args.fromZone}`);
        }
        const [cardInstance] = fromZone.splice(cardIndex, 1);

        const toZone = GetPlayerZone(targetPlayer, args.toZone);
        toZone.push(cardInstance);
    }

}

export interface expectedArgs {
    fromZone: Zone;
    toZone: Zone;
    targetCardInstanceId: string;
    toTargetPlayerId: string;
    fromTargetPlayerId: string;
    isCast: boolean
}