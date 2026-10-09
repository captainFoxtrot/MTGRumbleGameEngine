import { CardBehaviorType } from "../enums/CardBehaviorType";
import { CardInstance } from "./Card";
import { Condition } from "../effects/Condition";
import { GameEvent } from "../GameEvent";
import { GameState } from "../GameState";
import { RuleAction } from "../effects/RuleAction";
import { TriggerDefinition } from "../enums/TriggerDefinition";
import { Zone } from "../enums/Zone";

export interface CardBehavior {
    id: string;
    type: CardBehaviorType;
    trigger?: TriggerDefinition;
    conditions?: Condition[];
    activeZones: Zone[];
    actions: RuleAction[];
}

export function  checkConditions(behaviour: CardBehavior, gameState: GameState, gameEvent: GameEvent, self: CardInstance): boolean{
    let isMet = true;
    for (const con of behaviour.conditions ?? []) {
        if(!con(gameState, gameEvent, self)) isMet = false;
    }
    return isMet;
}