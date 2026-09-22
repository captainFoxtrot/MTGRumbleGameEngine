import { EventType } from "./enums/EventType";

export interface GameEvent<TArgs = unknown> {
    eventId: string;
    type: EventType;

    sourceId: string;
    targetId: string;

    args: TArgs;

    preventEventExecution: boolean;
    appliedEventReplacementIds: Set<string>;
}