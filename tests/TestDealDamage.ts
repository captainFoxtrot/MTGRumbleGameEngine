import { DealDamage } from "../rumble-engine/actions/DealDamage";
import { TargetType } from "../rumble-engine/enums/TargetType";
import { GameState } from "../rumble-engine/GameState";

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

function testDealDamage(): void {
    const state = createTestState();

    DealDamage.Enqueue(state, "P1", { 
            amount: 1,
            targetType: TargetType.Player,
            targetPlayer: "P1"
     });

    assert(
        state.players.P1.life === 39,
        "Player should have 39 life"
    );

    assert(
        state.players.P2.life === 40,
        "Player should have 40 life"
    );

    DealDamage.Enqueue(state, "P2", { 
            amount: 17,
            targetType: TargetType.Player,
            targetPlayer: "P2"
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