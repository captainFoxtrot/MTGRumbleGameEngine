import { Card, CardInstance } from "../rumble-engine/cards/Card";

import { CardBehavior } from "../rumble-engine/cards/CardBehavior";
import { CardBehaviorType } from "../rumble-engine/enums/CardBehaviorType";
import { DealDamage } from "../rumble-engine/actions/DealDamage";
import { Draw } from "../rumble-engine/actions/Draw";
import { EventProcessor } from "../rumble-engine/EventProcessor";
import { GameEvent } from "../rumble-engine/GameEvent";
import { GameState } from "../rumble-engine/GameState";
import { Move } from "../rumble-engine/actions/Move";
import { Phase } from "../rumble-engine/enums/Phase";
import { PlayerPriority } from "../rumble-engine/PlayerPriority";
import { TargetType } from "../rumble-engine/enums/TargetType";
import { TriggerDefinition } from "../rumble-engine/enums/TriggerDefinition";
import { Zone } from "../rumble-engine/enums/Zone";

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

const testCard: Card = {
    id: "test-card",
    name: "Test Card",
    manaValue: 1,
    types: [],
    subtypes: [],
    supertypes: [],
    oracleText: "",
    keywords: [],
    behaviors: [
        {
            id: "test-behavior",
            type: CardBehaviorType.Triggered,
            trigger: TriggerDefinition.onEnterBattlefield,

            conditions: [
                (
                    gameState: GameState,
                    gameEvent: GameEvent,
                    self: CardInstance
                ) => {
                    if (
                        self.instanceId ===
                        gameEvent.targetId
                    ) {
                        return true;
                    }

                    return false;
                }
            ],

            activeZones: [
                Zone.Battlefield
            ],

            actions: [
                (
                    gameState: GameState,
                    self: CardInstance
                ) => {
                    Draw.Enqueue(
                        gameState,
                        self.controllerId,
                        {
                            amount: 1,
                            targetPlayerId:
                            self.controllerId
                        }
                    );
                },

                (
                    gameState: GameState,
                    self: CardInstance
                ) => {
                    const controller =
                        self.controllerId;

                    const players =
                        gameState.players;

                    for (const playerId in players) {
                        if (
                            playerId !== controller
                        ) {
                            DealDamage.Enqueue(
                                gameState,
                                playerId,
                                {
                                    amount: 1,
                                    targetType:
                                        TargetType.Player,
                                    targetPlayer:
                                        playerId,
                                    targetId:
                                        playerId
                                }
                            );
                        }
                    }
                }
            ]
        } as CardBehavior
    ],
    replacements: [],
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
    const t1 =
        createInstance(
            drawCard,
            "P1",
            "P1"
        );

    const t2 =
        createInstance(
            drawCard,
            "P1",
            "P1"
        );

    const t3 =
        createInstance(
            drawCard,
            "P1",
            "P1"
        );

    const testCardInstance =
        createInstance(
            testCard,
            "P1",
            "P1"
        );

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

                library: [
                    t1,
                    t2,
                    t3
                ],

                hand: [
                    testCardInstance
                ],

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

        phase:
            Phase.PreCombatMain,

        eventCounter: 0,

        eventProcessor,
        stack: [],
        priority: new PlayerPriority()
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

function testCardBehaviour(): void {
    const state =
        createTestState();

    const targetCard =
        state.players["P1"].hand[0];

    Move.Enqueue(
        state,
        "P1",
        {
            fromZone: Zone.Hand,
            toZone: Zone.Battlefield,

            targetCardInstanceId:
                targetCard.instanceId,

            toTargetPlayerId: "P1",
            fromTargetPlayerId: "P1",

            isCast: true
        },
    );

    assert(
        state.players.P1.library.length === 2,
        "Player should have exactly 2 cards in library but has " +
        state.players.P1.library.length
    );

    assert(
        state.players.P1.hand.length === 1,
        "Player should have exactly 1 card in hand but has " +
        state.players.P1.hand.length
    );

    assert(
        state.players.P1.life === 40,
        "Player 1 should have exactly 40 life"
    );

    assert(
        state.players.P2.life === 39,
        "Player 2 should have exactly 39 life"
    );

    assert(
        state.players.P3.life === 39,
        "Player 3 should have exactly 39 life"
    );

    console.log(
        "TestCardBehaviour passed"
    );
}

testCardBehaviour();