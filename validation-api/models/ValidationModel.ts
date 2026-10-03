import { Phase } from "../../rumble-engine/enums/Phase";

export interface SerializedCardInstance {
	instanceId: string;

	/*
	 * For now this identifies a card registered on the validator.
	 * Later this can point at staged generated candidate modules.
	 */
	cardId: string;

	ownerId: string;
	controllerId: string;

	tapped: boolean;
	damageMarked: number;

	counters: Record<string, number>;
}

export interface SerializedPlayerState {
	id: string;
	life: number;

	poison: number;
	acorn: number;
	energy: number;
	experience: number;
	rad: number;
	ticket: number;

	library: SerializedCardInstance[];
	hand: SerializedCardInstance[];
	graveyard: SerializedCardInstance[];
	exile: SerializedCardInstance[];
	battlefield: SerializedCardInstance[];
	command: SerializedCardInstance[];
	contraptions: SerializedCardInstance[];
	junkyard: SerializedCardInstance[];
	scrapyard: SerializedCardInstance[];
	attractions: SerializedCardInstance[];
	whammy: SerializedCardInstance[];

	hasLostOrgivenUp: boolean;
}

export interface SerializedGameState {
	players: Record<string, SerializedPlayerState>;

	playerTurnOrder: string[];
	playerIdTurn: string;

	phase: Phase;
	eventCounter: number;
}

export interface ValidationAction {
	type: string;
	sourcePlayerId: string;
	args: unknown;
}

export interface EnqueueValidationRequest {
	gameState: SerializedGameState;
	action: ValidationAction;
}

export interface TraceEntry {
	sequence: number;

	eventId?: string;
	eventType: string;

	action: string;

	targetId?: string;
	args: unknown;
}

export interface EnqueueValidationResponse {
	success: boolean;

	finalState?: SerializedGameState;
	trace: TraceEntry[];

	error?: {
		code: string;
		message: string;
	};
}
