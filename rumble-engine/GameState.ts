import { CardInstance } from "./cards/Card";
import { CardBehaviorType } from "./enums/CardBehaviorType";
import { Phase } from "./enums/Phase";
import { StackType } from "./enums/StackType";
import { Zone } from "./enums/Zone";
import { EventProcessor } from "./EventProcessor";

export interface PlayerState {
    id: string;
    life: number;

    /* counters */
    poison: number;
    acorn: number;
    energy: number;
    experience: number;
    rad: number;
    ticket: number;

    library: CardInstance[];
    hand: CardInstance[];
    graveyard: CardInstance[];
    exile: CardInstance[];
    battlefield: CardInstance[];
    command: CardInstance[];
    contraptions: CardInstance[];
    junkyard: CardInstance[];
    scrapyard: CardInstance[];
    attractions: CardInstance[];
    whammy: CardInstance[];

    hasLostOrgivenUp: boolean;
}

export interface GameState {
    players: Record<string, PlayerState>;
    playerTurnOrder: string[];
    eventCounter: number;
    playerIdTurn: string;
    phase: Phase;
    eventProcessor: EventProcessor;
    stack: StackItem[];
}

export interface StackItem {
    card: CardInstance;
    originPlayerId: string;
    originZone: Zone;
    stackType: StackType;
    cardBehaviourType?: CardBehaviorType | null;
    abilityId: string | null;
}

export function GetNextPlayer(state: GameState): string | undefined{
    const activePlayers = state.playerTurnOrder.filter(x => !state.players[x].hasLostOrgivenUp);

    if(activePlayers.length <= 1) return undefined;

    const activePlayer = state.playerIdTurn;
    const currentIndex = state.playerTurnOrder.indexOf(activePlayer);
    const playerCount = state.playerTurnOrder.length;
    let nextPlayerIndex = currentIndex + 1;
    if(nextPlayerIndex >= playerCount) nextPlayerIndex = 0;
    let runs = 0;

    while(state.players[state.playerTurnOrder[nextPlayerIndex]].hasLostOrgivenUp && runs < playerCount) {
        nextPlayerIndex++;
        if(nextPlayerIndex >= playerCount) nextPlayerIndex = 0;
        runs++;
    }

    return state.playerTurnOrder[nextPlayerIndex];
}

export function GetPlayerZone(player: PlayerState, zone: Zone) {
    switch (zone) {
        case Zone.Library:
            return player.library;
        case Zone.Hand:
            return player.hand;
        case Zone.Graveyard:
            return player.graveyard;
        case Zone.Exile:
            return player.exile;
        case Zone.Battlefield:
            return player.battlefield;
        case Zone.Command:
            return player.command;
        case Zone.Contraptions:
            return player.contraptions;
        case Zone.Junkyard:
            return player.junkyard;
        case Zone.Scrapyard:
            return player.scrapyard;
        case Zone.Attractions:
            return player.attractions;
        case Zone.Whammy:
            return player.whammy;
        default:
            throw new Error(`Unknown zone: ${zone}`);
    }
}