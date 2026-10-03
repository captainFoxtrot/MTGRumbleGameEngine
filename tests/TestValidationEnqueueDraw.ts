import {
    ClearCardRegistry,
    RegisterCard
} from "../validation-api/CardRegistry";

import { Card } from "../rumble-engine/cards/Card";
import { Phase } from "../rumble-engine/enums/Phase";
import { RunEnqueueValidation } from "../validation-api/ValidationRunner";

function assert(
    condition: boolean,
    message: string
): void {
    if (!condition) {
        throw new Error(`TEST FAILED: ${message}`);
    }
}

async function TestValidationEnqueueDraw(): Promise<void> {
    ClearCardRegistry();

    const drawCard: Card = {
        id: "draw-card",
        name: "Validation Draw Card",
        manaValue: 0,
        types: [],
        subtypes: [],
        supertypes: [],
        oracleText: "",
        keywords: [],
        behaviors: [],
        replacements: [],
        ongoings: []
    };

    RegisterCard(drawCard);

    const request = {
        gameState: {
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
                        {
                            instanceId: "draw-card-1",
                            cardId: "draw-card",

                            ownerId: "P1",
                            controllerId: "P1",

                            tapped: false,
                            damageMarked: 0,

                            counters: {}
                        }
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
            eventCounter: 0
        },

        action: {
            type: "DRAW",
            sourcePlayerId: "P1",

            args: {
                amount: 1,
                targetPlayerId: "P1"
            }
        }
    };

    const result = await RunEnqueueValidation(request);

    assert(
        result.success === true,
        `Validation should succeed. Error: ${result.error?.message ?? "none"}`
    );

    if (!result.finalState) {
        throw new Error(
            "TEST FAILED: finalState was not returned"
        );
    }

    const player = result.finalState.players.P1;

    assert(
        player.library.length === 0,
        `Library should contain 0 cards but contains ${player.library.length}`
    );

    assert(
        player.hand.length === 1,
        `Hand should contain 1 card but contains ${player.hand.length}`
    );

    assert(
        player.hand[0].instanceId === "draw-card-1",
        `Expected draw-card-1 in hand but found ${player.hand[0]?.instanceId}`
    );

    assert(
        result.trace.length > 0,
        "Trace should contain at least one executed event/action"
    );

    console.log("TestValidationEnqueueDraw passed");
}

async function main(): Promise<void> {
    await TestValidationEnqueueDraw();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});