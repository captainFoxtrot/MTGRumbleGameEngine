import { Condition } from "../effects/Condition";
import { CardBehaviorType } from "../enums/CardBehaviorType";
import { TriggerDefinition } from "../enums/TriggerDefinition";
import { Zone } from "../enums/Zone";
import { RuleAction } from "../effects/RuleAction";
import { GameState } from "../GameState";
import { GameEvent } from "../GameEvent";
import { CardInstance } from "./Card";

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
    for (const conIndex in behaviour.conditions) {
        if (!Object.hasOwn(behaviour.conditions, conIndex)) continue;
        let con = behaviour.conditions[conIndex];
        if(!con(gameState, gameEvent, self)) isMet = false;
    }
    return isMet;
}