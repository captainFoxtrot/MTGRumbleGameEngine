import { Condition } from "../effects/Condition";
import { CardBehaviorType } from "../enums/CardBehaviorType";
import { TriggerDefinition } from "../enums/TriggerDefinition";

export interface CardBehavior {
    id: string;

    type: CardBehaviorType;

    trigger?: TriggerDefinition;

    conditions?: Condition[];

    actions: RuleAction[];
}