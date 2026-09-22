import { GainLife } from "../rumble-engine/actions/GainLife";
import { GameState } from "../rumble-engine/GameState";
import { TargetType } from '../rumble-engine/enums/TargetType';

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

function testGainLife(): void {
    const state = createTestState();

    GainLife.Enqueue(state, "P1", { 
            amount: 1,
            targetPlayerId: "P1"
     });

    assert(
        state.players.P1.life === 41,
        "Player should have 41 life"
    );

    assert(
        state.players.P2.life === 40,
        "Player should have 40 life"
    );

    GainLife.Enqueue(state, "P2", { 
            amount: 17,
            targetPlayerId: "P2"
     });
    assert(
        state.players.P1.life === 41,
        "Player should have 41 life"
    );

    assert(
        state.players.P2.life === 57,
        "Player should have 57 life"
    );

    console.log("TestGainLife passed");
}

testGainLife();