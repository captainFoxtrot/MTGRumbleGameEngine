import { Card, CardInstance } from "../rumble-engine/cards/Card";
import { CardType } from "../rumble-engine/enums/CardType";
import { Zone } from "../rumble-engine/enums/Zone";
import { HookType } from "../rumble-engine/enums/HookType";
import { TargetType } from "../rumble-engine/enums/TargetType";
import { GameState } from "../rumble-engine/GameState";
import { Phase } from "../rumble-engine/enums/Phase";
import { EventProcessor } from "../rumble-engine/EventProcessor";


//
// Concrete CardInstance used by tests
//
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


//
// Test cards
//

const goblinCard: Card = {
    id: "goblin-card",
    name: "Test Goblin",

    manaValue: 1,

    types: [CardType.Creature],
    subtypes: ["Goblin"],
    supertypes: [],

    oracleText: "",

    power: 2,
    toughness: 2,

    keywords: [],

    behaviors: [],
    replacements: [],
    ongoings: []
};


const humanCard: Card = {
    id: "human-card",
    name: "Test Human",

    manaValue: 1,

    types: [CardType.Creature],
    subtypes: ["Human"],
    supertypes: [],

    oracleText: "",

    power: 2,
    toughness: 2,

    keywords: [],

    behaviors: [],
    replacements: [],
    ongoings: []
};


const goblinLordCard: Card = {
    id: "goblin-lord",
    name: "Goblin Lord",

    manaValue: 3,

    types: [CardType.Creature],
    subtypes: ["Goblin"],
    supertypes: [],

    oracleText: "Goblins you control get +1/+1.",

    power: 2,
    toughness: 2,

    keywords: [],

    behaviors: [],
    replacements: [],

    ongoings: [
        {
            id: "goblins-plus-one-power",

            functionHook: HookType.GetPower,

            activeZones: [
                Zone.Battlefield
            ],

            conditions: [
                (
                    state,
                    hook,
                    self,
                    targetType,
                    target
                ) => {
                    if (targetType !== TargetType.Card) {
                        return false;
                    }

                    const targetCard =
                        target as CardInstance;

                    return (
                        targetCard.controllerId ===
                            self.controllerId
                        &&
                        targetCard.card.subtypes.includes(
                            "Goblin"
                        )
                    );
                }
            ],

            affect: (
                state,
                self,
                targetType,
                target,
                currentValue
            ) => {
                return (
                    currentValue as number
                ) + 1;
            }
        }
    ]
};


//
// Card instances
//

const p1Goblin =
    new TestCardInstance(
        "p1-goblin",
        goblinCard,
        "P1",
        "P1"
    );

const p1Human =
    new TestCardInstance(
        "p1-human",
        humanCard,
        "P1",
        "P1"
    );

const p1Lord =
    new TestCardInstance(
        "p1-lord",
        goblinLordCard,
        "P1",
        "P1"
    );

const p2Goblin =
    new TestCardInstance(
        "p2-goblin",
        goblinCard,
        "P2",
        "P2"
    );


//
// Game state
//

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
            hand: [],
            graveyard: [],
            exile: [],

            battlefield: [
                p1Goblin,
                p1Human,
                p1Lord
            ],

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

            battlefield: [
                p2Goblin
            ],

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


//
// Test helper
//

function assert(
    condition: boolean,
    message: string
): void {
    if (!condition) {
        throw new Error(
            `TEST FAILED: ${message}`
        );
    }
}


//
// Test
//

function TestOngoingGetPower(): void {

    const p1GoblinPower =
        p1Goblin.GetPower(state);

    const p1HumanPower =
        p1Human.GetPower(state);

    const p1LordPower =
        p1Lord.GetPower(state);

    const p2GoblinPower =
        p2Goblin.GetPower(state);


    //
    // Goblin controlled by Lord's controller
    // should receive +1.
    //
    assert(
        p1GoblinPower === 3,
        `Expected P1 Goblin power to be 3, got ${p1GoblinPower}`
    );


    //
    // Human controlled by P1 should NOT
    // receive the Goblin bonus.
    //
    assert(
        p1HumanPower === 2,
        `Expected P1 Human power to be 2, got ${p1HumanPower}`
    );


    //
    // Lord is itself a Goblin controlled by P1,
    // so "Goblins you control" includes itself.
    //
    assert(
        p1LordPower === 3,
        `Expected Goblin Lord power to be 3, got ${p1LordPower}`
    );


    //
    // Opponent's Goblin should NOT receive bonus.
    //
    assert(
        p2GoblinPower === 2,
        `Expected P2 Goblin power to be 2, got ${p2GoblinPower}`
    );


    console.log(
        "TestOngoingGetPower passed"
    );
}


TestOngoingGetPower();