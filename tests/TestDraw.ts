import { Card, CardInstance } from "../rumble-engine/cards/Card";
import { Draw } from "../rumble-engine/actions/Draw";
import { GameState } from "../rumble-engine/GameState";

const testCard: Card = {
    id: "test-card",
    name: "Test Card",
    manaValue: 1,
    types: [],
    subtypes: [],
    supertypes: [],
    oracleText: "",
    keywords: [],
    behaviors: []
};

function createCardInstance(
    instanceId: string
): CardInstance {
    return {
        instanceId,
        card: testCard,
        ownerId: "P1",
        controllerId: "P1",
        tapped: false,
        damageMarked: 0,
        counters: {}
    };
}

function createTestState(): GameState {
    return {
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

                library: [
                    createCardInstance("C1"),
                    createCardInstance("C2"),
                    createCardInstance("C3")
                ],

                hand: [],
                graveyard: [],
                exile: [],
                battlefield: [],

                command: [],
                contraptions: [],
                junkyard: [],
                scrapyard: [],
                attractions: [],
                whammy: []
            }
        },

        eventCounter: 0,
        triggeredEffects: []
    };
}

function assert(
    condition: boolean,
    message: string
): void {
    if (!condition) {
        throw new Error(`TEST FAILED: ${message}`);
    }
}

function testDraw(): void {
    const state = createTestState();

    Draw.Enqueue(state, "P1", { amount: 1 });

    assert(
        state.players.P1.hand.length === 1,
        "Player should have exactly 1 card in hand"
    );

    assert(
        state.players.P1.library.length === 2,
        "Library should contain exactly 2 cards"
    );

    assert(
        state.players.P1.hand[0].instanceId === "C1",
        "Player should have drawn C1"
    );

    assert(
        state.players.P1.library[0].instanceId === "C2",
        "C2 should now be on top of the library"
    );

    console.log("TestDraw passed");
}

testDraw();