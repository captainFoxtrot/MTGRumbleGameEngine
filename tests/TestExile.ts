import { Card, CardInstance } from "../rumble-engine/cards/Card";
import { GameState } from "../rumble-engine/GameState";
import { Exile } from "../rumble-engine/actions/Exile";
import { Phase } from "../rumble-engine/enums/Phase";
import { EventProcessor } from "../rumble-engine/EventProcessor";

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
    } as CardInstance;
}

function createTestState(): GameState {
    const eventProcessor = new EventProcessor();
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
                whammy: [],
                hasLostOrgivenUp: false
            }
        },
                
        playerTurnOrder: ["P1"],
        playerIdTurn: "P1",
        phase: Phase.PreCombatMain,

        eventCounter: 0,

        eventProcessor
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

function TestExile(): void {
    const state = createTestState();

    Exile.Enqueue(state, "P1", { 
        amount: 1,
        fromTargetPlayerId: "P1"
     });

    assert(
        state.players.P1.library.length === 2,
        "Library should contain exactly 2 cards"
    );

    assert(
        state.players.P1.exile.length === 1,
        "Player 1 card in graceyard"
    );

    console.log("TestExile Passed");
}

TestExile();