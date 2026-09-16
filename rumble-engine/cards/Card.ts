import { CardType } from "../enums/CardType";
import { Keyword } from "../enums/Keyword";
import { SuperType } from "../enums/SuperType";
import { CardBehavior } from "./CardBehavior";

export interface Card {
    id: string;

    name: string;

    manaCost?: string;
    manaValue: number;

    types: CardType[];
    subtypes: string[];
    supertypes: SuperType[];

    oracleText: string;

    power?: number;
    toughness?: number;
    loyalty?: number;

    keywords: Keyword[];

    behaviors: CardBehavior[];
}

export interface CardInstance {
    instanceId: string;
    card: Card;

    ownerId: string;
    controllerId: string;

    tapped: boolean;
    damageMarked: number;
    
    counters: Record<string, number>;
}