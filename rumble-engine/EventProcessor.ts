import { Action } from "./actions/Action";
import { expectedArgs as MoveExpectedArgs, Move } from "./actions/Move";
import { checkReplacementConditions, discoverReplacements } from "./effects/ReplacementEffect";
import { discoverTriggers } from "./effects/TriggeredEffect";
import { CardType } from "./enums/CardType";
import { Keyword } from "./enums/Keyword";
import { Zone } from "./enums/Zone";
import { GameEvent } from "./GameEvent";
import { GameState, PlayerState } from "./GameState";
import { Cost } from "./models/Cost";

export class EventProcessor {

    eventDepth = 0;

    async processEvent(
        state: GameState,
        evt: GameEvent,
        action: Action
    ): Promise<void> {
        this.eventDepth++;
        try{
            evt = this.beforeEventReplacementEffects(state, evt);

            if (evt.preventEventExecution) {
                return;
            }

            action.Do(state, evt);

            this.afterEvent(state, evt);

            if(this.eventDepth == 1){
                const maxAttempts = 5000;
                let attempts = 0;
                let hasChanges = true;

                while(hasChanges && attempts < maxAttempts) {
                    hasChanges = this.cleanup(state);
                    attempts++;
                }

                if(hasChanges){
                    throw new Error("State did not stabilize, check log for debugging");
                }
            }
        } finally {
            this.eventDepth--;
        }
    }

    beforeEventReplacementEffects(
        state: GameState,
        evt: GameEvent
    ): GameEvent {
        var effects = discoverReplacements(state, evt);

        //Ask player to arrange effect order

        for (const index in effects) {
            if (!Object.hasOwn(effects, index)) continue;
            const effect = effects[index]
            const doesStillApply = checkReplacementConditions(effect.effect, state, evt, effect.cardInstance) && evt.type == effect.effect.replaceEventType;
            if(doesStillApply) evt = effect.effect.replace(state,evt,effect.cardInstance);
        }
        return evt;
    }

    afterEvent(
        state: GameState,
        evt: GameEvent
    ): void {
        let triggers = discoverTriggers(state,evt);
        
        //Ask players to arrange trigger order

        triggers.forEach(e => {
            e.Behaviour.actions.forEach(a => {
                a(state, e.Instance, evt);
            })
        })
    }

    cleanup(state: GameState): boolean {
        let hasChanges = false;
        const cardsToDie = [] as MoveExpectedArgs[];
        const cardsDied = new Set<string>();
        for (const key in state.players) {
            if (!Object.hasOwn(state.players, key)) continue;
            
            const player = state.players[key];
            cardsToDie.push(...this.checkCardDeathByDamage(player, state));
            cardsToDie.push(...this.checkCardDeathByZeroToughness(player, state));
        }

        for (const cardDeath of cardsToDie) {
            if(cardsDied.has(cardDeath.targetCardInstanceId)) continue;
            Move.Enqueue(state, cardDeath.fromTargetPlayerId, cardDeath);
            cardsDied.add(cardDeath.targetCardInstanceId);
        }

        if(cardsDied.size > 0) hasChanges = true;

        return hasChanges;
    }

    checkCardDeathByZeroToughness(player: PlayerState, state: GameState): MoveExpectedArgs[]{
        const cardIdsToDie = [];
        for (const cardInstance of player.battlefield) {
            const types = cardInstance.GetTypes(state);
            const toughness = cardInstance.GetToughness(state);

            if (
                types.includes(CardType.Creature) &&
                toughness !== undefined &&
                toughness <= 0
            ) {
                cardIdsToDie.push({
                fromZone: Zone.Battlefield,
                toZone: Zone.Graveyard,
                targetCardInstanceId: cardInstance.instanceId,
                toTargetPlayerId: cardInstance.ownerId,
                fromTargetPlayerId: player.id,
                isCast: false
            } as MoveExpectedArgs);
            }
        }

        return cardIdsToDie;
    }

    checkCardDeathByDamage(player: PlayerState, state: GameState): MoveExpectedArgs[]{
        const cardIdsToDie = [];
        for (const cardInstance of player.battlefield) {
            const types = cardInstance.GetTypes(state);
            const isIndestructible = cardInstance.GetKeywords(state).includes(Keyword.Indestructible);
            const toughness = cardInstance.GetToughness(state);

            if (toughness === undefined || isIndestructible) {
                continue;
            }

            const hasLethalDamage = cardInstance.damageMarked >= toughness;

            if(types.includes(CardType.Creature) && hasLethalDamage){
                cardIdsToDie.push({
                fromZone: Zone.Battlefield,
                toZone: Zone.Graveyard,
                targetCardInstanceId: cardInstance.instanceId,
                toTargetPlayerId: cardInstance.ownerId,
                fromTargetPlayerId: player.id,
                isCast: false
            });
            }
        }

        return cardIdsToDie;
    }
}
