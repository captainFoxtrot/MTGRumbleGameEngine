import { Action } from "./actions/Action";
import { checkReplacementConditions, discoverReplacements } from "./effects/ReplacementEffect";
import { discoverTriggers } from "./effects/TriggeredEffect";
import { GameEvent } from "./GameEvent";
import { GameState } from "./GameState";

export function processEvent(
    state: GameState,
    evt: GameEvent,
    action: Action
): void {
    evt = beforeEventReplacementEffects(state, evt);

    if (evt.preventEventExecution) {
        return;
    }

    action.Do(state, evt);

    afterEvent(state, evt);
}

function beforeEventReplacementEffects(
    state: GameState,
    evt: GameEvent
): GameEvent {
    var effects = discoverReplacements(state, evt);

    //Ask player to arrange effect order

    for (const index in effects) {
        if (!Object.hasOwn(effects, index)) continue;
        const effect = effects[index]
        const doesStillApply = checkReplacementConditions(effect.effect, state, evt, effect.cardInstance) && evt.type == effect.effect.replaceEventType;
        if(doesStillApply) evt = effect.effect.replace(state,evt,effect.cardInstance);
    }
    return evt;
}

function beforeEventOngoingEffects(
    state: GameState,
    evt: GameEvent
): GameEvent {
    return evt;
}

function afterEvent(
    state: GameState,
    evt: GameEvent
): void {
    let triggers = discoverTriggers(state,evt);
    
    //Ask players to arrange trigger order

    triggers.forEach(e => {
        e.Behaviour.actions.forEach(a => {
            a(state, e.Instance);
        })
    })
}