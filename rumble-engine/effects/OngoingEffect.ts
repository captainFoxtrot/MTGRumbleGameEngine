import { CardInstance } from "../cards/Card";
import { HookType } from '../enums/HookType';
import { TargetType } from '../enums/TargetType';
import { Zone } from "../enums/Zone";
import { GameState, GetPlayerZone, PlayerState } from "../GameState";
import { OngoingCondition } from "./Condition";

export interface OngoingEffect {
    id: string;
    functionHook: HookType;
    activeZones: Zone[];

    conditions: OngoingCondition[];

    affect(
        state: GameState,
        self: CardInstance,
        targetType:  TargetType,
        target: CardInstance | PlayerState,
        currentValue: unknown
    ): unknown;
}

export interface OngoingReadyEffect {
    controllingPlayerId: string;
    currentZone: Zone;
    cardInstance: CardInstance;
    effect: OngoingEffect;
    targetType: TargetType;
    target: PlayerState | CardInstance;
}

export function discoverOngoings(state: GameState, hook: HookType, targetType: TargetType, target: PlayerState | CardInstance): OngoingReadyEffect[]{
    let effects = [] as OngoingReadyEffect[];
    for (const playerId in state.players) {
        if (!Object.hasOwn(state.players, playerId)) continue;
        
        const player = state.players[playerId];
        effects.push(...getZoneEffects(player, Zone.Battlefield, state, hook, targetType, target));
        effects.push(...getZoneEffects(player, Zone.Graveyard, state, hook, targetType, target));
        effects.push(...getZoneEffects(player, Zone.Command, state, hook, targetType, target));
        effects.push(...getZoneEffects(player, Zone.Exile, state, hook, targetType, target));
    }
    return effects;
}

function getZoneEffects(player: PlayerState, zone:Zone, state: GameState, hook: HookType, targetType: TargetType, target: PlayerState | CardInstance): OngoingReadyEffect[]{
    let effects = [] as OngoingReadyEffect[];
    var cardZone = GetPlayerZone(player, zone);
    cardZone.forEach(card => {
        for (const index in card.card.ongoings) {
            if (!Object.hasOwn(card.card.ongoings, index)) continue;
            const effect = card.card.ongoings[index];
            if(effect.functionHook != hook) continue
            if(!effect.activeZones.includes(zone)) continue;
            else if(!checkOngoingConditions(effect, state, hook, card, targetType, target))continue;
            effects.push({
                effect: effect,
                controllingPlayerId: player.id,
                currentZone: zone,
                cardInstance: card,
                target: target,
                targetType: targetType
            });
        }
    });
    return effects;
}

export function checkOngoingConditions(effect: OngoingEffect, gameState: GameState, hook: HookType, self: CardInstance, targetType: TargetType, target: PlayerState | CardInstance): boolean{
    let isMet = true;
    for (const conIndex in effect.conditions) {
        if (!Object.hasOwn(effect.conditions, conIndex)) continue;
        let con = effect.conditions[conIndex];
        if(!con(gameState, hook, self, targetType, target)) isMet = false;
    }
    return isMet;
}