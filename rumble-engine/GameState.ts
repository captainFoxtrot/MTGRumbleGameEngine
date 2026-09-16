import { Card } from "./cards/Card";

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

    /* common zones*/
    library: Card[];
    hand: Card[];
    graveyard: Card[];
    exile: Card[];
    battlefield: Card[];

    /* special zones */
    command: Card[];
    contraptions: Card[];
    junkyard: Card[];
    scrapyard: Card[];
    attractions: Card[];
    whammy: Card[];
}

export interface GameState {
    players: Record<string, PlayerState>;

    eventCounter: number;

    triggeredEffects: any[];
}