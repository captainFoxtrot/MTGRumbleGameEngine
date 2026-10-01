import { CardType } from "../enums/CardType";
import { Keyword } from "../enums/Keyword";
import { SuperType } from "../enums/SuperType";
import { CardBehavior } from "./CardBehavior";
import { ReplacementEffect } from '../effects/ReplacementEffect';
import { discoverOngoings, OngoingEffect } from "../effects/OngoingEffect";
import { HookType } from "../enums/HookType";
import { TargetType } from "../enums/TargetType";
import { GameState } from "../GameState";
import { CommonCardCounters } from "../enums/CommonCardCounters";
import { Cost, CreateCost } from '../models/Cost';
import { GameEvent } from "../GameEvent";

export interface Card {
    id: string;

    name: string;

    manaCost?: Cost;
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
    replacements: ReplacementEffect[];
    ongoings: OngoingEffect[];
}

export interface ICardInstance {
    instanceId: string;
    card: Card;

    ownerId: string;
    controllerId: string;

    tapped: boolean;
    damageMarked: number;

    counters: Record<string, number>;
}

export abstract class CardInstance implements ICardInstance{
    abstract instanceId: string;
    abstract card: Card;

    abstract ownerId: string;
    abstract controllerId: string;

    abstract tapped: boolean;
    abstract damageMarked: number;

    abstract counters: Record<string, number>;

    GetCost(state: GameState, event: GameEvent): Cost | undefined{
        if(!this.card.manaCost) return CreateCost();
    
        let cost = {...this.card.manaCost};

        for (const reduction of cost.costReduction) {
            cost = reduction(state, event, cost);
        }

        return cost;
    }

    GetPower(state: GameState): number | undefined{
        if(this.card.power == undefined) return undefined;
        const effects = discoverOngoings(state, HookType.GetPower, TargetType.Card, this);
        const staticPowerModifier = this.counters[CommonCardCounters.PowerModifier];
        let currentPower = this.card.power + (staticPowerModifier ?? 0);
        for (const effect of effects) {
            const returnedPowerEffect = effect.effect.affect(state, effect.cardInstance, TargetType.Card, this, currentPower);

            if(typeof returnedPowerEffect == "number") currentPower = returnedPowerEffect;
        }
        return currentPower;
    }

    GetToughness(state: GameState): number | undefined{
        if(this.card.toughness == undefined) return undefined;
        const effects = discoverOngoings(state, HookType.GetToughness, TargetType.Card, this);
        const staticToughnessModifier = this.counters[CommonCardCounters.ToughnessModifier];
        let currentToughness = this.card.toughness + (staticToughnessModifier ?? 0);
        for (const effect of effects) {
            const returnedToughnessEffect = effect.effect.affect(state, effect.cardInstance, TargetType.Card, this, currentToughness);

            if(typeof returnedToughnessEffect == "number") currentToughness = returnedToughnessEffect;
        }
        return currentToughness;
    }

    GetKeywords(state: GameState): Keyword[] {
        const effects = discoverOngoings(state, HookType.GetKeywords, TargetType.Card, this);
        let currentKeywords = [...this.card.keywords];
        for (const effect of effects) {
            const returnedKeywordsEffect = effect.effect.affect(state, effect.cardInstance, TargetType.Card, this, currentKeywords);
            
            
            if (Array.isArray(returnedKeywordsEffect)) {
                currentKeywords =
                    returnedKeywordsEffect as Keyword[];
            }
        }
        return currentKeywords;
    }

    GetTypes(state: GameState): CardType[]{
        return this.card.types;
    }
}