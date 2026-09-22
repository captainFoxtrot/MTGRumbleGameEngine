import { expectedArgs as MoveExpectedArgs } from "../actions/Move";
import { CardInstance } from "../cards/Card";
import { CardBehavior, checkConditions } from "../cards/CardBehavior";
import { EventType } from "../enums/EventType";
import { TriggerDefinition } from "../enums/TriggerDefinition";
import { Zone } from "../enums/Zone";
import { GameEvent } from "../GameEvent";
import { GameState, GetPlayerZone } from "../GameState";

export interface TriggeredEffect {
    id: string;
    eventType: EventType;
    execute(
        state: GameState,
        event: GameEvent
    ): void;
}

export function discoverTriggers(state: GameState, evt: GameEvent): TriggerReadyEffect[] {
    let effects = [] as TriggerReadyEffect[];
    effects.push(...executeCardETBTrigger(state, evt));
    effects.push(...executeCardLTBTrigger(state, evt));

    return effects;
}

function executeCardETBTrigger(state: GameState, evt: GameEvent): TriggerReadyEffect[] {
    if(evt.type != EventType.MoveCard) return [];
    let args = evt.args as MoveExpectedArgs;

    if(args.fromZone == Zone.Battlefield || args.toZone != Zone.Battlefield) return [];
    let triggerReadyEffects = [] as TriggerReadyEffect[];
    for(const playerIndex in state.players){
        let player = state.players[playerIndex];
        player.battlefield.forEach(card => {
            card.card.behaviors.forEach(behaviour => {
                if(behaviour.activeZones.includes(Zone.Battlefield) && behaviour.trigger == TriggerDefinition.onEnterBattlefield && checkConditions(behaviour, state,evt,card)) {
                    triggerReadyEffects.push({
                        Instance: card,
                        Behaviour: behaviour,
                        Controller: playerIndex
                    })
                }
            });
        });

        
        player.graveyard.forEach(card => {
            card.card.behaviors.forEach(behaviour => {
                if(behaviour.activeZones.includes(Zone.Graveyard) && behaviour.trigger == TriggerDefinition.onEnterBattlefield && checkConditions(behaviour, state,evt,card)) {
                    triggerReadyEffects.push({
                        Instance: card,
                        Behaviour: behaviour,
                        Controller: playerIndex
                    })
                }
            });
        });

        
        player.command.forEach(card => {
            card.card.behaviors.forEach(behaviour => {
                if(behaviour.activeZones.includes(Zone.Command) && behaviour.trigger == TriggerDefinition.onEnterBattlefield && checkConditions(behaviour, state,evt,card)) {
                    triggerReadyEffects.push({
                        Instance: card,
                        Behaviour: behaviour,
                        Controller: playerIndex
                    })
                }
            });
        });

        
        player.exile.forEach(card => {
            card.card.behaviors.forEach(behaviour => {
                if(behaviour.activeZones.includes(Zone.Exile) && behaviour.trigger == TriggerDefinition.onEnterBattlefield && checkConditions(behaviour, state,evt,card)) {
                    triggerReadyEffects.push({
                        Instance: card,
                        Behaviour: behaviour,
                        Controller: playerIndex
                    })
                }
            });
        }); 
    }
    return triggerReadyEffects;
}



function executeCardLTBTrigger(state: GameState, evt: GameEvent): TriggerReadyEffect[] {
    if(evt.type != EventType.MoveCard) return [];
    let args = evt.args as MoveExpectedArgs;

    if(args.fromZone != Zone.Battlefield || args.toZone == Zone.Battlefield) return [];
    let triggerReadyEffects = [] as TriggerReadyEffect[];
    for(const playerIndex in state.players){
        let player = state.players[playerIndex];
        player.battlefield.forEach(card => {
            card.card.behaviors.forEach(behaviour => {
                if(behaviour.activeZones.includes(Zone.Battlefield) && behaviour.trigger == TriggerDefinition.onLeaveBattlefield && checkConditions(behaviour, state,evt,card)) {
                    triggerReadyEffects.push({
                        Instance: card,
                        Behaviour: behaviour,
                        Controller: playerIndex
                    })
                }
            });
        });

        
        player.graveyard.forEach(card => {
            card.card.behaviors.forEach(behaviour => {
                if(behaviour.activeZones.includes(Zone.Graveyard) && behaviour.trigger == TriggerDefinition.onLeaveBattlefield && checkConditions(behaviour, state,evt,card)) {
                    triggerReadyEffects.push({
                        Instance: card,
                        Behaviour: behaviour,
                        Controller: playerIndex
                    })
                }
            });
        });

        
        player.command.forEach(card => {
            card.card.behaviors.forEach(behaviour => {
                if(behaviour.activeZones.includes(Zone.Command) && behaviour.trigger == TriggerDefinition.onLeaveBattlefield && checkConditions(behaviour, state,evt,card)) {
                    triggerReadyEffects.push({
                        Instance: card,
                        Behaviour: behaviour,
                        Controller: playerIndex
                    })
                }
            });
        });

        
        player.exile.forEach(card => {
            card.card.behaviors.forEach(behaviour => {
                if(behaviour.activeZones.includes(Zone.Exile) && behaviour.trigger == TriggerDefinition.onLeaveBattlefield && checkConditions(behaviour, state,evt,card)) {
                    triggerReadyEffects.push({
                        Instance: card,
                        Behaviour: behaviour,
                        Controller: playerIndex
                    })
                }
            });
        });
    }

    let playerId = args.toTargetPlayerId;
    let controllingPlayer = state.players[playerId];
    let playerZone = GetPlayerZone(controllingPlayer, args.toZone);
    let card = playerZone.filter(x => x.instanceId == args.targetCardInstanceId)[0];
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

export interface TriggerReadyEffect{
    Instance: CardInstance,
    Behaviour: CardBehavior,
    Controller: string
}