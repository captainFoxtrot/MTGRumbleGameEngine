import { Card } from "../rumble-engine/cards/Card";

const cards = new Map<string, Card>();

export function RegisterCard(card: Card): void {
    cards.set(card.id, card);
}

export function GetCard(cardId: string): Card {
    const card = cards.get(cardId);

    if (!card) {
        throw new Error(`Unknown validation card: ${cardId}`);
    }

    return card;
}


export function ClearCardRegistry(): void {
    cards.clear();
}