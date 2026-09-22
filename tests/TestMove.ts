import { Card, CardInstance } from "../rumble-engine/cards/Card";
import { Draw } from "../rumble-engine/actions/Draw";
import { GameState } from "../rumble-engine/GameState";
import { Zone } from "../rumble-engine/enums/Zone";
import { Move } from "../rumble-engine/actions/Move";

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

                library: [],

                hand: [
                    createCardInstance("C1"),
                    createCardInstance("C2"),
                    createCardInstance("C3")],
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

function TestMove(): void {
    const state = createTestState();

    Move.Enqueue(state, "P1", { 
        fromZone: Zone.Hand,
        toZone: Zone.Battlefield,
        targetCardInstanceId: "C1",
        toTargetPlayerId: "P1",
        fromTargetPlayerId: "P1",
        isCast: true
    })

    assert(
        state.players.P1.hand.length === 2,
        "Player should have exactly 2 card in hand"
    );

    assert(
        state.players.P1.battlefield.length === 1,
        "Battlefield should contain exactly 1 cards"
    );

    console.log("TestDraw passed");
}

TestMove();