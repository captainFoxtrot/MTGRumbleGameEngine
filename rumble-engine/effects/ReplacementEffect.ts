import {Zone} from '../enums/Zone';
import { EventType } from '../enums/EventType';
import { Condition } from './Condition';
import { GameState, GetPlayerZone, PlayerState } from '../GameState';
import { GameEvent } from '../GameEvent';
import { CardInstance } from '../cards/Card';

export interface ReplacementEffect {
    id: string;
    replaceEventType: EventType;
    activeZones: Zone[];

    conditions: Condition[];

    replace(
        state: GameState,
        event: GameEvent,
        self: CardInstance
    ): GameEvent;
}

export interface ReplacementReadyEffect {
    controllingPlayerId: string;
    currentZone: Zone;
    cardInstance: CardInstance;
    effect: ReplacementEffect;
}

export function discoverReplacements(state: GameState, evt: GameEvent): ReplacementReadyEffect[]{
    let effects = [] as ReplacementReadyEffect[];
    for (const playerId in state.players) {
        if (!Object.hasOwn(state.players, playerId)) continue;
        
        const player = state.players[playerId];
        effects.push(...getZoneEffects(player, Zone.Battlefield, state, evt));
        effects.push(...getZoneEffects(player, Zone.Graveyard, state, evt));
        effects.push(...getZoneEffects(player, Zone.Command, state, evt));
        effects.push(...getZoneEffects(player, Zone.Exile, state, evt));
    }
    return effects;
}

function getZoneEffects(player: PlayerState, zone:Zone, state: GameState, evt: GameEvent): ReplacementReadyEffect[]{
    let effects = [] as ReplacementReadyEffect[];
    var cardZone = GetPlayerZone(player, zone);
    cardZone.forEach(card => {
        for (const index in card.card.replacements) {
            if (!Object.hasOwn(card.card.replacements, index)) continue;
            const effect = card.card.replacements[index];
            if(effect.replaceEventType != evt.type) continue
            if(!effect.activeZones.includes(zone)) continue;
            else if(!checkReplacementConditions(effect, state, evt, card))continue;
            effects.push({
                effect: effect,
                controllingPlayerId: player.id,
                currentZone: zone,
                cardInstance: card
            });
        }
    });
    return effects;
}

export function checkReplacementConditions(effect: ReplacementEffect, gameState: GameState, gameEvent: GameEvent, self: CardInstance): boolean{
    let isMet = true;
    for (const conIndex in effect.conditions) {
        if (!Object.hasOwn(effect.conditions, conIndex)) continue;
        let con = effect.conditions[conIndex];
        if(!con(gameState, gameEvent, self)) isMet = false;
    }
    return isMet;
}