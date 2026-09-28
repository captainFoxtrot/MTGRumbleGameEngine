import { Card, CardInstance } from "../rumble-engine/cards/Card";
import { CardType } from "../rumble-engine/enums/CardType";
import { Zone } from "../rumble-engine/enums/Zone";
import { HookType } from "../rumble-engine/enums/HookType";
import { TargetType } from "../rumble-engine/enums/TargetType";
import { Keyword } from "../rumble-engine/enums/Keyword";
import { GameState } from "../rumble-engine/GameState";
import { EventProcessor } from "../rumble-engine/EventProcessor";
import { Phase } from "../rumble-engine/enums/Phase";

//
// Concrete card instance for test purposes
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
// Base Goblin
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

//
// Base Human
//
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

//
// Goblin Lord
//
// "Goblins you control get +1/+1 and have Flying."
//
const goblinLordCard: Card = {
    id: "goblin-lord",
    name: "Goblin Lord",

    manaValue: 3,

    types: [CardType.Creature],
    subtypes: ["Goblin"],
    supertypes: [],

    oracleText:
        "Goblins you control get +1/+1 and have Flying.",

    power: 2,
    toughness: 2,

    keywords: [],

    behaviors: [],
    replacements: [],

    ongoings: [

        //
        // +1 Power
        //
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
        },

        //
        // +1 Toughness
        //
        {
            id: "goblins-plus-one-toughness",

            functionHook: HookType.GetToughness,

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
        },

        //
        // Flying
        //
        {
            id: "goblins-have-flying",

            functionHook: HookType.GetKeywords,

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
                const keywords =
                    currentValue as Keyword[];

                if (
                    keywords.includes(
                        Keyword.Flying
                    )
                ) {
                    return keywords;
                }

                return [
                    ...keywords,
                    Keyword.Flying
                ];
            }
        }
    ]
};

//
// Instances
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
// State
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
// Assert helper
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
function TestFlyingGoblinLord(): void {

    //
    // P1 Goblin should be buffed
    //
    assert(
        p1Goblin.GetPower(state) === 3,
        `Expected P1 Goblin power to be 3, got ${p1Goblin.GetPower(state)}`
    );

    assert(
        p1Goblin.GetToughness(state) === 3,
        `Expected P1 Goblin toughness to be 3, got ${p1Goblin.GetToughness(state)}`
    );

    assert(
        p1Goblin
            .GetKeywords(state)
            .includes(Keyword.Flying),
        "Expected P1 Goblin to have Flying"
    );


    //
    // Human should not be affected
    //
    assert(
        p1Human.GetPower(state) === 2,
        `Expected P1 Human power to be 2, got ${p1Human.GetPower(state)}`
    );

    assert(
        p1Human.GetToughness(state) === 2,
        `Expected P1 Human toughness to be 2, got ${p1Human.GetToughness(state)}`
    );

    assert(
        !p1Human
            .GetKeywords(state)
            .includes(Keyword.Flying),
        "Expected P1 Human to NOT have Flying"
    );


    //
    // Lord buffs itself because it is also
    // a Goblin controlled by P1
    //
    assert(
        p1Lord.GetPower(state) === 3,
        `Expected Goblin Lord power to be 3, got ${p1Lord.GetPower(state)}`
    );

    assert(
        p1Lord.GetToughness(state) === 3,
        `Expected Goblin Lord toughness to be 3, got ${p1Lord.GetToughness(state)}`
    );

    assert(
        p1Lord
            .GetKeywords(state)
            .includes(Keyword.Flying),
        "Expected Goblin Lord to have Flying"
    );


    //
    // Opponent Goblin should not be affected
    //
    assert(
        p2Goblin.GetPower(state) === 2,
        `Expected P2 Goblin power to be 2, got ${p2Goblin.GetPower(state)}`
    );

    assert(
        p2Goblin.GetToughness(state) === 2,
        `Expected P2 Goblin toughness to be 2, got ${p2Goblin.GetToughness(state)}`
    );

    assert(
        !p2Goblin
            .GetKeywords(state)
            .includes(Keyword.Flying),
        "Expected P2 Goblin to NOT have Flying"
    );


    //
    // Remove Lord from battlefield
    //
    const lordIndex =
        state.players.P1.battlefield.findIndex(
            card =>
                card.instanceId ===
                p1Lord.instanceId
        );

    const [removedLord] =
        state.players.P1.battlefield.splice(
            lordIndex,
            1
        );

    state.players.P1.graveyard.push(
        removedLord
    );


    //
    // Effects should now immediately disappear
    //
    assert(
        p1Goblin.GetPower(state) === 2,
        `Expected P1 Goblin power to return to 2, got ${p1Goblin.GetPower(state)}`
    );

    assert(
        p1Goblin.GetToughness(state) === 2,
        `Expected P1 Goblin toughness to return to 2, got ${p1Goblin.GetToughness(state)}`
    );

    assert(
        !p1Goblin
            .GetKeywords(state)
            .includes(Keyword.Flying),
        "Expected P1 Goblin to lose Flying after Lord left battlefield"
    );

    console.log(
        "TestFlyingGoblinLord passed"
    );
}

TestFlyingGoblinLord();