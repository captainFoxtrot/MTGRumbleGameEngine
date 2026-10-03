import { Action } from "../rumble-engine/actions/Action";
import { EventProcessor } from "../rumble-engine/EventProcessor";
import { GameEvent } from "../rumble-engine/GameEvent";
import { GameState } from "../rumble-engine/GameState";
import { TraceEntry } from "./models/ValidationModel";


export class TraceEventProcessor extends EventProcessor {
    readonly trace: TraceEntry[] = [];

    override async processEvent(
        state: GameState,
        evt: GameEvent,
        action: Action
    ): Promise<void> {

        this.trace.push({
            sequence: this.trace.length + 1,

            eventId: evt.eventId,
            eventType: String(evt.type),

            action: action.constructor.name,

            targetId: evt.targetId,
            args: structuredClone(evt.args)
        });

        await super.processEvent(state, evt, action);
    }
}