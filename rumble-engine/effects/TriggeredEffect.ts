import { expectedArgs as MoveExpectedArgs } from "../actions/Move";
import { CardInstance } from "../cards/Card";
import { CardBehavior, checkConditions } from "../cards/CardBehavior";
import { EventType } from "../enums/EventType";
import { TriggerDefinition } from "../enums/TriggerDefinition";
import { Zone } from "../enums/Zone";
import { GameEvent } from "../GameEvent";
import { GameState, GetPlayerZone, PlayerState } from "../GameState";

export function discoverTriggers(state: GameState, evt: GameEvent): TriggerReadyEffect[] {
    let effects = [] as TriggerReadyEffect[];
    effects.push(...discoverCardETBTrigger(state, evt));
    effects.push(...discoverCardLTBTrigger(state, evt));
    effects.push(...discoverCardDrawtrigger(state, evt));

    return effects;
}

function discoverCardDrawtrigger(state: GameState, evt: GameEvent): TriggerReadyEffect[]{
    if(evt.type != EventType.DrawCard) return [];
    return discoverTriggersForAllPlayers(TriggerDefinition.onDraw, state, evt);
}

function discoverCardETBTrigger(state: GameState, evt: GameEvent): TriggerReadyEffect[] {
    if(evt.type != EventType.MoveCard) return [];
    let args = evt.args as MoveExpectedArgs;

    if(args.fromZone == Zone.Battlefield || args.toZone != Zone.Battlefield) return [];
    return discoverTriggersForAllPlayers(TriggerDefinition.onEnterBattlefield, state, evt);
}



function discoverCardLTBTrigger(state: GameState, evt: GameEvent): TriggerReadyEffect[] {
    if(evt.type != EventType.MoveCard) return [];
    let args = evt.args as MoveExpectedArgs;

    if(args.fromZone != Zone.Battlefield || args.toZone == Zone.Battlefield) return [];
    let triggerReadyEffects = discoverTriggersForAllPlayers(TriggerDefinition.onLeaveBattlefield, state, evt);

    let playerId = args.toTargetPlayerId;
    let destinationPlayer = state.players[playerId];
    let playerZone = GetPlayerZone(destinationPlayer, args.toZone);
    const card = playerZone.find(
        x => x.instanceId === args.targetCardInstanceId
    );

    if (!card) {
        return triggerReadyEffects;
    }
    
    card.card.behaviors.forEach(behaviour => {
        if(behaviour.activeZones.includes(Zone.Battlefield) && behaviour.trigger == TriggerDefinition.onLeaveBattlefield && checkConditions(behaviour, state,evt,card)) {
            triggerReadyEffects.push({
                Instance: card,
                Behaviour: behaviour,
                Controller: args.fromTargetPlayerId
            })
        }
    });
    

    return triggerReadyEffects;  
}

function discoverTriggersForAllPlayers(definition: TriggerDefinition, state: GameState, evt: GameEvent): TriggerReadyEffect[]{
    let triggerReadyEffects = [] as TriggerReadyEffect[];
    for(const playerIndex in state.players){
        let player = state.players[playerIndex];
        triggerReadyEffects.push(...discoverPlayerZoneTriggerCards(player, Zone.Battlefield, definition, state, evt));
        triggerReadyEffects.push(...discoverPlayerZoneTriggerCards(player, Zone.Graveyard, definition, state, evt));
        triggerReadyEffects.push(...discoverPlayerZoneTriggerCards(player, Zone.Command, definition, state, evt));
        triggerReadyEffects.push(...discoverPlayerZoneTriggerCards(player, Zone.Exile, definition, state, evt));
    }
    return triggerReadyEffects;
}

function discoverPlayerZoneTriggerCards(player: PlayerState, zone: Zone, definition: TriggerDefinition, state: GameState, evt: GameEvent): TriggerReadyEffect[] {
    const cardZone = GetPlayerZone(player, zone);
    const triggerReadyEffects = [] as TriggerReadyEffect[];
    cardZone.forEach(card => {
        card.card.behaviors.forEach(behaviour => {
            if(behaviour.activeZones.includes(zone) && behaviour.trigger == definition && checkConditions(behaviour, state,evt,card)) {
                triggerReadyEffects.push({
                    Instance: card,
                    Behaviour: behaviour,
                    Controller: player.id
                })
            }
        });
    });
    return triggerReadyEffects;
}

export interface TriggerReadyEffect{
    Instance: CardInstance,
    Behaviour: CardBehavior,
    Controller: string
}