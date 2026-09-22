import { Card, CardInstance, CardRemnant } from "./cards/Card";
import { Zone } from "./enums/Zone";

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
}

export interface GameState {
    players: Record<string, PlayerState>;

    eventCounter: number;

    triggeredEffects: any[];
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