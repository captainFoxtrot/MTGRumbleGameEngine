import { EventType } from "../enums/EventType";
import { TargetType } from "../enums/TargetType";
import { GameEvent } from "../GameEvent";
import { GameState } from "../GameState";
import { Action } from "./Action";

export class DealDamage extends Action {

    static override ActionEnqueue(
        state: GameState,
        playerId: string,
        args: expectedArgs
    ): void {
        var action = new DealDamage();

        state.eventProcessor.processEvent(state, 
        {
            eventId: `E${++state.eventCounter}`,
            type: EventType.DealDamage,
            sourceId: playerId,
            targetId: args.targetPlayer,
            args: args,
            preventEventExecution: false,
            appliedEventReplacementIds: new Set(),
        }, 
        action);
    }

    Do(state: GameState, event: GameEvent){
        if(!event.targetId) {
            throw new Error("TargetId is required for DealDamage event.");
        }
        
        let args = event.args as expectedArgs;

        if(args.targetType === TargetType.Player) this.applyDamageToPlayer(state, args.targetId, args.amount);
        if(args.targetType === TargetType.Card) this.applyDamageToCard(state, args.targetId, event.targetId, args.amount);
    }

    private applyDamageToPlayer(state: GameState, playerId: string, amount: number): void {
        const player = state.players[playerId];
        player.life -= amount;
    }

    private applyDamageToCard(state: GameState, CardId: string, PlayerId: string, amount: number): void {
        const player = state.players[PlayerId];
        player.battlefield.find(card => card.instanceId === CardId)!.damageMarked += amount;
    }
}

export interface expectedArgs {
    amount: number;
    targetType: TargetType;
    targetPlayer: string;
    targetId: string;
}