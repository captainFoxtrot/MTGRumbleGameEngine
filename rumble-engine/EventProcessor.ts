import { Action } from "./actions/Action";
import { GameEvent } from "./GameEvent";
import { GameState } from "./GameState";

export function processEvent(
    state: GameState,
    event: GameEvent,
    action: Action
): void {
    event = beforeEventReplacementEffects(state, event);

    if (event.preventEventExecution) {
        return;
    }

    event = beforeEventOngoingEffects(state, event);

    if (event.preventEventExecution) {
        return;
    }

    action.Do(state, event);

    afterEvent(state, event);
}

function beforeEventReplacementEffects(
    state: GameState,
    event: GameEvent
): GameEvent {
    return event;
}

function beforeEventOngoingEffects(
    state: GameState,
    event: GameEvent
): GameEvent {
    return event;
}

function afterEvent(
    state: GameState,
    event: GameEvent
): void {
    const triggers = state.triggeredEffects.filter(
        trigger =>
            trigger.eventType === event.type &&
            trigger.condition(state, event)
    );

    for (const trigger of triggers) {
        trigger.execute(state, event);
    }
}