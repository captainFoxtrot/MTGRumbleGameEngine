import { DealDamage } from "../rumble-engine/actions/DealDamage";
import { Phase } from "../rumble-engine/enums/Phase";
import { TargetType } from "../rumble-engine/enums/TargetType";
import { EventProcessor } from "../rumble-engine/EventProcessor";
import { GameState } from "../rumble-engine/GameState";

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

                library: [],

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
            },
            P2: {
                id: "P2",
                life: 40,

                poison: 0,
                acorn: 0,
                energy: 0,
                experience: 0,
                rad: 0,
                ticket: 0,

                library: [],

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

function testDealDamage(): void {
    const state = createTestState();

    DealDamage.Enqueue(state, "P1", { 
            amount: 1,
            targetType: TargetType.Player,
            targetPlayer: "P1",
            targetId: "P1"
     });

    assert(
        state.players.P1.life === 39,
        "Player should have 39 life"
    );

    assert(
        state.players.P2.life === 40,
        "Player should have 40 life"
    );

    DealDamage.Enqueue(state, "P1", { 
            amount: 17,
            targetType: TargetType.Player,
            targetPlayer: "P2",
            targetId: "P2"
     });
    assert(
        state.players.P1.life === 39,
        "Player should have 39 life"
    );

    assert(
        state.players.P2.life === 23,
        "Player should have 23 life"
    );

    console.log("TestDealDamage passed");
}

testDealDamage();