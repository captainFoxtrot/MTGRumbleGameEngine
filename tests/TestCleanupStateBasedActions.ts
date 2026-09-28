import { Card, CardInstance } from "../rumble-engine/cards/Card";
import { EventProcessor } from "../rumble-engine/EventProcessor";
import { GameState } from "../rumble-engine/GameState";
import { CardType } from "../rumble-engine/enums/CardType";
import { Keyword } from "../rumble-engine/enums/Keyword";
import { HookType } from "../rumble-engine/enums/HookType";
import { TargetType } from "../rumble-engine/enums/TargetType";
import { Zone } from "../rumble-engine/enums/Zone";
import { Phase } from "../rumble-engine/enums/Phase";

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

function createCreature(
    id: string,
    name: string,
    power: number,
    toughness: number,
    keywords: Keyword[] = []
): Card {
    return {
        id,
        name,
        manaValue: 0,

        types: [CardType.Creature],
        subtypes: [],
        supertypes: [],

        oracleText: "",

        power,
        toughness,

        keywords,

        behaviors: [],
        replacements: [],
        ongoings: []
    };
}

const normalTwoTwo =
    createCreature(
        "normal-2-2",
        "Normal 2/2",
        2,
        2
    );

const indestructibleTwoTwo =
    createCreature(
        "indestructible-2-2",
        "Indestructible 2/2",
        2,
        2,
        [Keyword.Indestructible]
    );

const zeroZero =
    createCreature(
        "zero-zero",
        "Zero Zero",
        0,
        0
    );

const indestructibleZeroZero =
    createCreature(
        "indestructible-zero-zero",
        "Indestructible Zero Zero",
        0,
        0,
        [Keyword.Indestructible]
    );

const goblinCard: Card = {
    id: "test-goblin",
    name: "Test Goblin",

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
            id: "goblin-plus-one-power",

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
            id: "goblin-plus-one-toughness",

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

function createBaseState(
    battlefield: CardInstance[]
): GameState {
    const eventProcessor =
        new EventProcessor();

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

                battlefield,

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

function TestCleanupStateBasedActions(): void {

    //
    // 1. 2/2 with 1 damage survives
    //
    {
        const creature =
            new TestCardInstance(
                "survivor",
                normalTwoTwo,
                "P1",
                "P1"
            );

        creature.damageMarked = 1;

        const state =
            createBaseState([
                creature
            ]);

        state.eventProcessor.cleanup(state);

        assert(
            state.players.P1.battlefield
                .some(
                    c =>
                        c.instanceId ===
                        "survivor"
                ),
            "2/2 with 1 damage should survive"
        );

        assert(
            state.players.P1.graveyard
                .length === 0,
            "2/2 with 1 damage should not enter graveyard"
        );
    }


    //
    // 2. 2/2 with 2 damage dies
    //
    {
        const creature =
            new TestCardInstance(
                "lethal",
                normalTwoTwo,
                "P1",
                "P1"
            );

        creature.damageMarked = 2;

        const state =
            createBaseState([
                creature
            ]);

        state.eventProcessor.cleanup(state);

        assert(
            !state.players.P1.battlefield
                .some(
                    c =>
                        c.instanceId ===
                        "lethal"
                ),
            "2/2 with 2 damage should leave battlefield"
        );

        assert(
            state.players.P1.graveyard
                .some(
                    c =>
                        c.instanceId ===
                        "lethal"
                ),
            "2/2 with lethal damage should enter graveyard"
        );
    }


    //
    // 3. Indestructible 2/2 with 2 damage survives
    //
    {
        const creature =
            new TestCardInstance(
                "indestructible-lethal",
                indestructibleTwoTwo,
                "P1",
                "P1"
            );

        creature.damageMarked = 2;

        const state =
            createBaseState([
                creature
            ]);

        state.eventProcessor.cleanup(state);

        assert(
            state.players.P1.battlefield
                .some(
                    c =>
                        c.instanceId ===
                        "indestructible-lethal"
                ),
            "Indestructible creature should survive lethal damage"
        );

        assert(
            state.players.P1.graveyard
                .length === 0,
            "Indestructible creature should not enter graveyard from lethal damage"
        );
    }


    //
    // 4. 0/0 dies
    //
    {
        const creature =
            new TestCardInstance(
                "zero-toughness",
                zeroZero,
                "P1",
                "P1"
            );

        const state =
            createBaseState([
                creature
            ]);

        state.eventProcessor.cleanup(state);

        assert(
            state.players.P1.graveyard
                .some(
                    c =>
                        c.instanceId ===
                        "zero-toughness"
                ),
            "0 toughness creature should die"
        );
    }


    //
    // 5. Indestructible 0/0 still dies
    //
    {
        const creature =
            new TestCardInstance(
                "indestructible-zero",
                indestructibleZeroZero,
                "P1",
                "P1"
            );

        const state =
            createBaseState([
                creature
            ]);

        state.eventProcessor.cleanup(state);

        assert(
            state.players.P1.graveyard
                .some(
                    c =>
                        c.instanceId ===
                        "indestructible-zero"
                ),
            "Indestructible 0 toughness creature should still die"
        );
    }


    //
    // 6. Multiple simultaneous deaths
    //
    {
        const creatureA =
            new TestCardInstance(
                "dead-a",
                normalTwoTwo,
                "P1",
                "P1"
            );

        const creatureB =
            new TestCardInstance(
                "dead-b",
                normalTwoTwo,
                "P1",
                "P1"
            );

        creatureA.damageMarked = 2;
        creatureB.damageMarked = 2;

        const state =
            createBaseState([
                creatureA,
                creatureB
            ]);

        state.eventProcessor.cleanup(state);

        assert(
            state.players.P1.battlefield
                .length === 0,
            "Both lethal creatures should leave battlefield"
        );

        assert(
            state.players.P1.graveyard
                .length === 2,
            "Both lethal creatures should enter graveyard"
        );
    }


    //
    // 7. Cascading cleanup
    //
    // Lord dies first.
    //
    // Goblin is initially effectively 2/2
    // with 1 damage, so it survives first pass.
    //
    // After Lord dies it becomes 1/1
    // with 1 damage and should die on next pass.
    //
    {
        const goblin =
            new TestCardInstance(
                "cascade-goblin",
                goblinCard,
                "P1",
                "P1"
            );

        goblin.damageMarked = 1;

        const lord =
            new TestCardInstance(
                "cascade-lord",
                goblinLordCard,
                "P1",
                "P1"
            );

        lord.damageMarked = 3;

        const state =
            createBaseState([
                goblin,
                lord
            ]);

        assert(
            goblin.GetToughness(state) === 2,
            "Goblin should initially have 2 toughness from Lord"
        );

        //
        // Call repeatedly exactly like the EventProcessor
        // stabilization loop does.
        //
        let hasChanges = true;
        let attempts = 0;

        while (
            hasChanges &&
            attempts < 100
        ) {
            hasChanges =
                state.eventProcessor.cleanup(
                    state
                );

            attempts++;
        }

        assert(
            !state.players.P1.battlefield
                .some(
                    c =>
                        c.instanceId ===
                        "cascade-lord"
                ),
            "Goblin Lord should die from lethal damage"
        );

        assert(
            !state.players.P1.battlefield
                .some(
                    c =>
                        c.instanceId ===
                        "cascade-goblin"
                ),
            "Goblin should die after Lord buff disappears"
        );

        assert(
            state.players.P1.graveyard
                .some(
                    c =>
                        c.instanceId ===
                        "cascade-lord"
                ),
            "Goblin Lord should be in graveyard"
        );

        assert(
            state.players.P1.graveyard
                .some(
                    c =>
                        c.instanceId ===
                        "cascade-goblin"
                ),
            "Dependent Goblin should be in graveyard"
        );

        assert(
            attempts >= 2,
            "Cascading SBA case should require multiple cleanup passes"
        );
    }


    console.log(
        "TestCleanupStateBasedActions passed"
    );
}

TestCleanupStateBasedActions();