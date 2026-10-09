import { GameEvent } from "../GameEvent";
import { GameState } from "../GameState";

export abstract class Action {
    abstract readonly canStack: boolean;

    static ActionEnqueue(state: GameState, playerId: string, arg: any){
        throw new Error("Enqueue method must be implemented in subclasses of Action");
    }

    static async ActionOnStack(state: GameState, playerId: string, arg: any){
        const promise = state.priority.StartNewPriorityRound();
        this.ActionEnqueue(state, playerId, arg);
    }

    abstract Do(state: GameState, event: GameEvent): void;

    Enqueue(state: GameState, playerId: string, arg: any){
        return (this.constructor as typeof Action).ActionEnqueue(state, playerId, arg);
    }
}