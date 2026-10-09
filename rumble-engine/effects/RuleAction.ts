import { CardInstance } from "../cards/Card";
import { GameEvent } from "../GameEvent";
import { GameState } from "../GameState";

export type RuleAction = (gameState: GameState, self: CardInstance, evt?:GameEvent) => void;