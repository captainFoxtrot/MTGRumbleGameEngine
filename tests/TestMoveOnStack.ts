import { Card, CardInstance } from "../rumble-engine/cards/Card";

import { EventProcessor } from "../rumble-engine/EventProcessor";
import { GameState } from "../rumble-engine/GameState";
import { Move } from "../rumble-engine/actions/Move";
import { Phase } from "../rumble-engine/enums/Phase";
import { PlayerPriority } from "../rumble-engine/PlayerPriority";
import { Zone } from "../rumble-engine/enums/Zone";

const testCard: Card = {
    id: "test-card",
    name: "Test Card",
    manaValue: 1,
    types: [],
    subtypes: [],
    supertypes: [],
    oracleText: "",
    keywords: [],
    behaviors: [],
    replacements: [],
    ongoings: []
};

class TestCardInstance extends CardInstance {
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
        controllerId: string
    ) {
        super();

        this.instanceId = instanceId;
        this.card = card;

        this.ownerId = ownerId;
        this.controllerId = controllerId;

        this.tapped = false;
        this.damageMarked = 0;
        this.counters = {};
    }
}

function createCardInstance(
    instanceId: string
): CardInstance {
    return new TestCardInstance(
        instanceId,
        testCard,
        "P1",
        "P1"
    );
}

function createTestState(): GameState {
    const eventProcessor = new EventProcessor();

    const state: GameState = {
        players: {
            P1: {
                id: "P1",
                life: 40,

                poison: 0,
                acorn: 0,
                energy: 0,
                experience: 0,
                rad: 0,
                ticket: 0,

                library: [],

                hand: [
                    createCardInstance("C1"),
                    createCardInstance("C2"),
                    createCardInstance("C3")
                ],

                graveyard: [],
                exile: [],
                battlefield: [],

                command: [],
                contraptions: [],
                junkyard: [],
                scrapyard: [],
                attractions: [],
                whammy: [],

                hasLostOrgivenUp: false
            }
        },

        playerTurnOrder: ["P1"],
        playerIdTurn: "P1",
        phase: Phase.PreCombatMain,

        eventCounter: 0,

        eventProcessor,
        stack: [],
        priority: new PlayerPriority()
    };

    state.priority.setState(state);

    return state;
}

function assert(
    condition: boolean,
    message: string
): void {
    if (!condition) {
        throw new Error(`TEST FAILED: ${message}`);
    }
}

function TestMoveOnStack(): void {
    const state = createTestState();
    const targetCardInstance = state.players.P1.hand.find(c => c.instanceId === "C1");

    if(!targetCardInstance) throw("Card no found");

    Move.ActionOnStack(
        state,
        "P1",
        {
            fromZone: Zone.Hand,
            toZone: Zone.Battlefield,
            targetCardInstanceId: "C1",
            toTargetPlayerId: "P1",
            fromTargetPlayerId: "P1",
            isCast: true
        },
        targetCardInstance
    );

    assert(
        state.stack.length === 1,
        "Stack should have exactly 1 StackItem"
    );

    assert(
        state.players.P1.hand.length === 3,
        "Card should remain in hand before stack resolution"
    );

    assert(
        state.players.P1.battlefield.length === 0,
        "Battlefield should still be empty before stack resolution"
    );

    state.priority.PassPriority();

    assert(
        state.stack.length === 0,
        "Stack should be empty after resolving the only StackItem"
    );

    assert(
        state.players.P1.hand.length === 2,
        "Player should have exactly 2 cards in hand"
    );

    assert(
        state.players.P1.battlefield.length === 1,
        "Battlefield should contain exactly 1 card"
    );

    console.log("TestMove passed");
}

TestMoveOnStack();