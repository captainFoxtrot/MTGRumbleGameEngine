import { GameState, PlayerState } from "../GameState";
import { GameEvent } from "../GameEvent";
import { CardInstance } from "../cards/Card";
import { HookType } from "../enums/HookType";
import { TargetType } from "../enums/TargetType";

export type Condition = (gameState: GameState, gameEvent: GameEvent, self: CardInstance) => boolean;
export type OngoingCondition = (gameState: GameState, hook: HookType, self: CardInstance, targetType: TargetType, target: PlayerState | CardInstance) => boolean;