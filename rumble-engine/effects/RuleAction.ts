import { CardInstance } from "../cards/Card";
import { GameState } from "../GameState";

export type RuleAction = (gameState: GameState, self: CardInstance) => void;