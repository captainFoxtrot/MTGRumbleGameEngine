import { GameState } from "../GameState";
import { GameEvent } from "../GameEvent";
import { CardInstance } from "../cards/Card";

export type Condition = (gameState: GameState, gameEvent: GameEvent, self: CardInstance) => boolean;