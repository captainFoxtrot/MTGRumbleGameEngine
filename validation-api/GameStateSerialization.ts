function serializeCardInstance(
    instance: CardInstance
): SerializedCardInstance {
    return {
        instanceId: instance.instanceId,
        cardId: instance.card.id,

        ownerId: instance.ownerId,
        controllerId: instance.controllerId,

        tapped: instance.tapped,
        damageMarked: instance.damageMarked,

        counters: { ...instance.counters }
    };
}

function serializePlayerState(
    player: PlayerState
): SerializedPlayerState {
    return {
        id: player.id,
        life: player.life,

        poison: player.poison,
        acorn: player.acorn,
        energy: player.energy,
        experience: player.experience,
        rad: player.rad,
        ticket: player.ticket,

        library: player.library.map(serializeCardInstance),
        hand: player.hand.map(serializeCardInstance),
        graveyard: player.graveyard.map(serializeCardInstance),
        exile: player.exile.map(serializeCardInstance),
        battlefield: player.battlefield.map(serializeCardInstance),
        command: player.command.map(serializeCardInstance),
        contraptions: player.contraptions.map(serializeCardInstance),
        junkyard: player.junkyard.map(serializeCardInstance),
        scrapyard: player.scrapyard.map(serializeCardInstance),
        attractions: player.attractions.map(serializeCardInstance),
        whammy: player.whammy.map(serializeCardInstance),

        hasLostOrgivenUp: player.hasLostOrgivenUp
    };
}

export function serializeGameState(
    state: GameState
): SerializedGameState {
    const players: Record<string, SerializedPlayerState> = {};

    for (const [playerId, player] of Object.entries(state.players)) {
        players[playerId] = serializePlayerState(player);
    }

    return {
        players,

        playerTurnOrder: [...state.playerTurnOrder],
        playerIdTurn: state.playerIdTurn,

        phase: state.phase,
        eventCounter: state.eventCounter
    };
}

import {
    GameState,
    PlayerState
} from "../rumble-engine/GameState";
import {
    SerializedCardInstance,
    SerializedGameState,
    SerializedPlayerState
} from "./models/ValidationModel";

import { CardInstance } from "../rumble-engine/cards/Card";
import { EventProcessor } from "../rumble-engine/EventProcessor";
import { GetCard } from "./CardRegistry";
import { RuntimeCardInstance } from "./RuntimeCardInstance";

function hydrateCardInstance(
    input: SerializedCardInstance
): CardInstance {
    const card = GetCard(input.cardId);

    return new RuntimeCardInstance(
        input.instanceId,
        card,
        input.ownerId,
        input.controllerId,
        input.tapped,
        input.damageMarked,
        { ...input.counters }
    );
}

function hydratePlayerState(
    input: SerializedPlayerState
): PlayerState {
    return {
        id: input.id,
        life: input.life,

        poison: input.poison,
        acorn: input.acorn,
        energy: input.energy,
        experience: input.experience,
        rad: input.rad,
        ticket: input.ticket,

        library: input.library.map(hydrateCardInstance),
        hand: input.hand.map(hydrateCardInstance),
        graveyard: input.graveyard.map(hydrateCardInstance),
        exile: input.exile.map(hydrateCardInstance),
        battlefield: input.battlefield.map(hydrateCardInstance),
        command: input.command.map(hydrateCardInstance),
        contraptions: input.contraptions.map(hydrateCardInstance),
        junkyard: input.junkyard.map(hydrateCardInstance),
        scrapyard: input.scrapyard.map(hydrateCardInstance),
        attractions: input.attractions.map(hydrateCardInstance),
        whammy: input.whammy.map(hydrateCardInstance),

        hasLostOrgivenUp: input.hasLostOrgivenUp
    };
}

export function hydrateGameState(
    input: SerializedGameState,
    eventProcessor: EventProcessor
): GameState {
    const players: Record<string, PlayerState> = {};

    for (const [playerId, player] of Object.entries(input.players)) {
        players[playerId] = hydratePlayerState(player);
    }

    return {
        players,

        playerTurnOrder: [...input.playerTurnOrder],
        playerIdTurn: input.playerIdTurn,

        phase: input.phase,
        eventCounter: input.eventCounter,

        eventProcessor,
        stack: []
    };
}