import { CardType } from "../enums/CardType";
import { GameState } from "../GameState";
import { GameEvent } from "../GameEvent";

export interface Cost {
    black: number;
    blue: number;
    red: number;
    green: number;
    white: number;
    generic: number;
    colorless: number;
    energy: number;
    sacrifice: CardType[],
    discard: CardType[],
    exile: CardType[],
    tap: CardType[],
    health: number,
    costReduction: Array<(state: GameState, event: GameEvent, currentCost: Cost) => Cost>
}

export function CreateCost() {
    return {
        black: 0,
        blue: 0,
        red: 0,
        green: 0,
        white: 0,
        generic: 0,
        colorless: 0,
        energy: 0,
        sacrifice: [],
        discard: [],
        exile: [],
        tap: [],
        health: 0,
        costReduction: []
    } as Cost;
}