import { EventType } from "../enums/EventType";
import { TargetType } from "../enums/TargetType";
import { processEvent } from "../EventProcessor";
import { GameEvent } from "../GameEvent";
import { GameState } from "../GameState";
import { Action } from "./Action";

export class DealDamage extends Action {

    static override Enqueue(
        state: GameState,
        playerId: string,
        args: expectedArgs
    ): void {
        var action = new DealDamage();

        processEvent(state, 
        {
            eventId: `E${++state.eventCounter}`,
            type: EventType.DealDamage,
            targetId: playerId,
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
        const player = state.players[event.targetId];

        let args = event.args as expectedArgs;

        if(args.targetType === TargetType.Player) this.applyDamageToPlayer(state, player.id, args.amount);
        if(args.targetType === TargetType.Card) this.applyDamageToCard(state, event.targetId, player.id, args.amount);
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

interface expectedArgs {
    amount: number;
    targetType: TargetType;
    targetPlayer: string;
}