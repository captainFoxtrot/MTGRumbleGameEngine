import { GameEvent } from "../GameEvent";
import { GameState } from "../GameState";

export abstract class Action {
    abstract Enqueue(state: GameState, playerId: string, arg: any): void;
    abstract Do(state: GameState, event: GameEvent): void;
}