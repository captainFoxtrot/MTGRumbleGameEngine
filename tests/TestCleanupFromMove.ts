import { Card, CardInstance } from "../rumble-engine/cards/Card";
import { GameState } from "../rumble-engine/GameState";
import { EventProcessor } from "../rumble-engine/EventProcessor";

import { CardType } from "../rumble-engine/enums/CardType";
import { Keyword } from "../rumble-engine/enums/Keyword";
import { HookType } from "../rumble-engine/enums/HookType";
import { TargetType } from "../rumble-engine/enums/TargetType";
import { Zone } from "../rumble-engine/enums/Zone";
import { Phase } from "../rumble-engine/enums/Phase";

import { Move } from "../rumble-engine/actions/Move";


//
// Concrete test instance
//
class TestCardInstance extends CardInstance {
    instanceId: string;
    card: Card;

    ownerId: string;
    controllerId: string;

    tapped = false;
    damageMarked = 0;

    counters: Record<string, number> = {};

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
    }
}


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
// Normal 1/1 Goblin
//
// While Lord is present:
// 2/2
//
// Has 1 damage marked.
// After Lord leaves:
// 1/1 with 1 damage -> lethal.
//
const damagedGoblinCard: Card = {
    id: "damaged-goblin",
    name: "Damaged Goblin",

    manaValue: 1,

    types: [CardType.Creature],
    subtypes: ["Goblin"],
    supertypes: [],

    oracleText: "",

    power: 1,
    toughness: 1,

    keywords: [],

    behaviors: [],
    replacements: [],
    ongoings: []
};


//
// Base 0/0 Goblin
//
// While Lord is present:
// 1/1
//
// After Lord leaves:
// 0/0 -> dies from zero toughness.
//
const fragileGoblinCard: Card = {
    id: "fragile-goblin",
    name: "Fragile Goblin",

    manaValue: 1,

    types: [CardType.Creature],
    subtypes: ["Goblin"],
    supertypes: [],

    oracleText: "",

    power: 0,
    toughness: 0,

    keywords: [],

    behaviors: [],
    replacements: [],
    ongoings: []
};


//
// Goblin Lord
//
// Goblins you control get +1/+1.
//
const goblinLordCard: Card = {
    id: "goblin-lord",
    name: "Goblin Lord",

    manaValue: 3,

    types: [CardType.Creature],
    subtypes: ["Goblin"],
    supertypes: [],

    oracleText:
        "Goblins you control get +1/+1.",

    power: 2,
    toughness: 2,

    keywords: [],

    behaviors: [],
    replacements: [],

    ongoings: [
        {
            id: "goblins-plus-one-power",

            functionHook:
                HookType.GetPower,

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
                    if (
                        targetType !==
                        TargetType.Card
                    ) {
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

        {
            id: "goblins-plus-one-toughness",

            functionHook:
                HookType.GetToughness,

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
                    if (
                        targetType !==
                        TargetType.Card
                    ) {
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


function createTestState(): {
    state: GameState;
    lord: TestCardInstance;
    damagedGoblin: TestCardInstance;
    fragileGoblin: TestCardInstance;
} {

    const lord =
        new TestCardInstance(
            "goblin-lord-instance",
            goblinLordCard,
            "P1",
            "P1"
        );

    const damagedGoblin =
        new TestCardInstance(
            "damaged-goblin-instance",
            damagedGoblinCard,
            "P1",
            "P1"
        );

    const fragileGoblin =
        new TestCardInstance(
            "fragile-goblin-instance",
            fragileGoblinCard,
            "P1",
            "P1"
        );

    //
    // 1 damage is non-lethal while Lord is active:
    //
    // base 1 toughness
    // +1 from Lord
    // = 2 toughness
    //
    damagedGoblin.damageMarked = 1;

    const eventProcessor =
        new EventProcessor();

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
                    lord,
                    damagedGoblin,
                    fragileGoblin
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

        playerTurnOrder: [
            "P1"
        ],

        playerIdTurn: "P1",

        phase:
            Phase.PreCombatMain,

        eventCounter: 0,

        eventProcessor
    };

    return {
        state,
        lord,
        damagedGoblin,
        fragileGoblin
    };
}


function TestCleanupFromMove(): void {

    const {
        state,
        lord,
        damagedGoblin,
        fragileGoblin
    } = createTestState();


    //
    // BEFORE Lord leaves
    //

    assert(
        damagedGoblin.GetToughness(state) === 2,
        `Damaged Goblin should initially have toughness 2, got ${damagedGoblin.GetToughness(state)}`
    );

    assert(
        damagedGoblin.damageMarked === 1,
        "Damaged Goblin should have exactly 1 damage marked"
    );

    assert(
        fragileGoblin.GetToughness(state) === 1,
        `Fragile Goblin should initially have toughness 1, got ${fragileGoblin.GetToughness(state)}`
    );

    assert(
        state.players.P1.battlefield.length === 3,
        "Battlefield should initially contain exactly 3 creatures"
    );

    assert(
        state.players.P1.graveyard.length === 0,
        "Graveyard should initially be empty"
    );


    //
    // ACT
    //
    // This is the only thing the test explicitly does.
    //
    // Everything after the Lord moving should happen
    // automatically through EventProcessor cleanup.
    //

    Move.Enqueue(
        state,
        "P1",
        {
            fromZone:
                Zone.Battlefield,

            toZone:
                Zone.Graveyard,

            targetCardInstanceId:
                lord.instanceId,

            fromTargetPlayerId:
                "P1",

            toTargetPlayerId:
                "P1",

            isCast: false
        }
    );


    //
    // AFTER Move
    //
    // The Move event should have completed,
    // then EventProcessor should have stabilized
    // the resulting game state.
    //


    //
    // Lord was explicitly moved
    //
    assert(
        !state.players.P1.battlefield.some(
            card =>
                card.instanceId ===
                lord.instanceId
        ),
        "Goblin Lord should no longer be on the battlefield"
    );

    assert(
        state.players.P1.graveyard.some(
            card =>
                card.instanceId ===
                lord.instanceId
        ),
        "Goblin Lord should be in the graveyard"
    );


    //
    // Damaged Goblin:
    //
    // Before:
    // 1/1 + Lord = 2/2
    // 1 marked damage -> survives
    //
    // After Lord leaves:
    // 1/1
    // 1 marked damage -> lethal
    //
    assert(
        !state.players.P1.battlefield.some(
            card =>
                card.instanceId ===
                damagedGoblin.instanceId
        ),
        "Damaged Goblin should die after losing the Lord toughness bonus"
    );

    assert(
        state.players.P1.graveyard.some(
            card =>
                card.instanceId ===
                damagedGoblin.instanceId
        ),
        "Damaged Goblin should be moved to the graveyard by lethal-damage SBA"
    );


    //
    // Fragile Goblin:
    //
    // Before:
    // 0/0 + Lord = 1/1
    //
    // After Lord leaves:
    // 0/0
    // -> zero toughness SBA
    //
    assert(
        !state.players.P1.battlefield.some(
            card =>
                card.instanceId ===
                fragileGoblin.instanceId
        ),
        "Fragile Goblin should die after becoming 0 toughness"
    );

    assert(
        state.players.P1.graveyard.some(
            card =>
                card.instanceId ===
                fragileGoblin.instanceId
        ),
        "Fragile Goblin should be moved to the graveyard by zero-toughness SBA"
    );


    //
    // Everything should now have left battlefield.
    //
    assert(
        state.players.P1.battlefield.length === 0,
        `Battlefield should be empty after stabilization, but contains ${state.players.P1.battlefield.length} cards`
    );

    assert(
        state.players.P1.graveyard.length === 3,
        `Graveyard should contain Lord and both Goblins, but contains ${state.players.P1.graveyard.length} cards`
    );


    //
    // Make sure processor has completely returned
    // from the event chain.
    //
    assert(
        state.eventProcessor.eventDepth === 0,
        `Event depth should return to 0, got ${state.eventProcessor.eventDepth}`
    );


    console.log(
        "TestCleanupFromMove passed"
    );
}


TestCleanupFromMove();