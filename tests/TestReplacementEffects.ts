import { GameState } from "../rumble-engine/GameState";
import { Card, CardInstance } from "../rumble-engine/cards/Card";
import { Zone } from "../rumble-engine/enums/Zone";
import { EventType } from "../rumble-engine/enums/EventType";
import { CardType } from "../rumble-engine/enums/CardType";
import { Draw } from "../rumble-engine/actions/Draw";
import { EventProcessor } from "../rumble-engine/EventProcessor";
import { Phase } from "../rumble-engine/enums/Phase";

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

const doubleDrawCard: Card = {
    id: "double-draw-card",
    name: "Double Draw",
    manaValue: 0,
    types: [CardType.Enchantment],
    subtypes: [],
    supertypes: [],
    oracleText: "If you would draw a card, draw two cards instead.",
    keywords: [],
    behaviors: [],
    replacements: [
        {
            id: "double-draw-test",
            replaceEventType: EventType.DrawCard,
            activeZones: [Zone.Battlefield],

            conditions: [
                (state, event, self) =>
                    event.targetId === self.controllerId
            ],

            replace: (state, event, self) => {
                const args = event.args as { amount: number };

                args.amount *= 2;

                return event;
            }
        }
    ],
    ongoings: []
};

const drawCard: Card = {
    id: "draw-card",
    name: "Card To Draw",
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

function createInstance(
    card: Card,
    ownerId: string,
    controllerId: string
): CardInstance {

    const randomGuid = () => {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
            .replace(/[xy]/g, function(c) {
                const r =
                    Math.random() * 16 | 0;

                const v =
                    c === "x"
                        ? r
                        : (r & 0x3 | 0x8);

                return v.toString(16);
            });
    };

    return new TestCardInstance(
        randomGuid(),
        card,
        ownerId,
        controllerId
    );
}

function createTestState(): GameState {
    const t1 = createInstance(drawCard, "P1", "P1");
    const t2 = createInstance(drawCard, "P1", "P1");
    const t3 = createInstance(drawCard, "P1", "P1");

    const t4 = createInstance(drawCard, "P2", "P2");
    const t5 = createInstance(drawCard, "P2", "P2");
    const t6 = createInstance(drawCard, "P2", "P2");

    const testCardInstance =
        createInstance(doubleDrawCard, "P1", "P1");

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

                library: [t1, t2, t3],

                hand: [],
                graveyard: [],
                exile: [],
                battlefield: [testCardInstance],

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

                library: [t4, t5, t6],

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

            P3: {
                id: "P3",
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

        playerTurnOrder: [
            "P1",
            "P2",
            "P3"
        ],

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
        throw new Error(
            `TEST FAILED: ${message}`
        );
    }
}

function testReplacementEffects(): void {
    const state = createTestState();

    Draw.Enqueue(
        state,
        "P1",
        {
            amount: 1,
            targetPlayerId: "P1"
        }
    );

    assert(
        state.players.P1.library.length === 1,
        "Player 1 should have exactly 1 card in library but has " +
        state.players.P1.library.length
    );

    assert(
        state.players.P1.hand.length === 2,
        "Player 1 should have exactly 2 cards in hand but has " +
        state.players.P1.hand.length
    );

    assert(
        state.players.P2.hand.length === 0,
        "Player 2 should have exactly 0 cards in hand"
    );

    Draw.Enqueue(
        state,
        "P2",
        {
            amount: 1,
            targetPlayerId: "P2"
        }
    );

    assert(
        state.players.P2.library.length === 2,
        "Player 2 should have exactly 2 cards in library"
    );

    assert(
        state.players.P2.hand.length === 1,
        "Player 2 should have exactly 1 card in hand"
    );

    console.log(
        "testReplacementEffects passed"
    );
}

testReplacementEffects();