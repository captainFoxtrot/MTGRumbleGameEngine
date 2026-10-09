import { GameEvent } from "../GameEvent";
import { GameState } from "../GameState";

export abstract class Action {
    
    static ActionEnqueue(state: GameState, playerId: string, arg: any){
        throw new Error("Enqueue method must be implemented in subclasses of Action");
    }

    abstract Do(state: GameState, event: GameEvent): void;

    static Enqueue(state: GameState, playerId: string, arg: any){
        return this.ActionEnqueue(state, playerId, arg);
    }
}