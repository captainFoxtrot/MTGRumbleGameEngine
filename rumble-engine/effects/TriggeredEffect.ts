import { EventType } from "../enums/EventType";
import { GameEvent } from "../GameEvent";
import { GameState } from "../GameState";

export interface TriggeredEffect {
    id: string;
    eventType: EventType;

    condition(
        state: GameState,
        event: GameEvent
    ): boolean;

    execute(
        state: GameState,
        event: GameEvent
    ): void;
}