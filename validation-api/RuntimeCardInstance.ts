import {
    Card,
    CardInstance
} from "../rumble-engine/cards/Card";

export class RuntimeCardInstance extends CardInstance {
    instanceId: string;
    card: Card;

    ownerId: string;
    controllerId: string;

    tapped: boolean;
    damageMarked: number;

    counters: Record<string, number>;

    constructor(
        instanceId: string,
        card: Card,
        ownerId: string,
        controllerId: string,
        tapped: boolean,
        damageMarked: number,
        counters: Record<string, number>
    ) {
        super();

        this.instanceId = instanceId;
        this.card = card;

        this.ownerId = ownerId;
        this.controllerId = controllerId;

        this.tapped = tapped;
        this.damageMarked = damageMarked;

        this.counters = counters;
    }
}