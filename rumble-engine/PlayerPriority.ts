import { GameState, GetNextPlayer } from "./GameState";

export class PlayerPriority {
    private resolve: any;
    private state: GameState;
    private priorityHolder: string;
    private priorityRounds: any[] = [];

    constructor(state: GameState) {
        this.state = state;
        this.priorityHolder = state.playerIdTurn;
    }

    public StartNewPriorityRound() {
        this.priorityHolder = this.state.playerIdTurn;
        new Promise(resolve => {
            this.priorityRounds.push(resolve);
        });
        return this.priorityRounds[this.priorityRounds.length - 1];
    }

    public PassPriority() {
        var targetNextPlayer = this.GetNextPlayer();
        const currentPriorityRound = this.priorityRounds[this.priorityRounds.length - 1];
        if(!targetNextPlayer) {
            currentPriorityRound.resolve();
        }
        this.priorityHolder = targetNextPlayer ?? "";

        if(this.priorityHolder == this.state.playerIdTurn){
            currentPriorityRound.resolve();
        }

        if(this.priorityRounds.length > 0) {
            this.priorityHolder = this.state.playerIdTurn;
        } else {
            return;
        }
    }

    public DequeuePriority(round: any){
        const index = this.priorityRounds.indexOf(round);
        if(index !== -1) {
            this.priorityRounds.splice(index, 1);
        }
    }

    private GetNextPlayer(): string | undefined{
        const activePlayers = this.state.playerTurnOrder.filter(x => !this.state.players[x].hasLostOrgivenUp);

        if(activePlayers.length <= 1) return undefined;

        const activePlayer = this.priorityHolder;
        const currentIndex = this.state.playerTurnOrder.indexOf(activePlayer);
        const playerCount = this.state.playerTurnOrder.length;
        let nextPlayerIndex = currentIndex + 1;
        if(nextPlayerIndex >= playerCount) nextPlayerIndex = 0;
        let runs = 0;

        while(this.state.players[this.state.playerTurnOrder[nextPlayerIndex]].hasLostOrgivenUp && runs < playerCount) {
            nextPlayerIndex++;
            if(nextPlayerIndex >= playerCount) nextPlayerIndex = 0;
            runs++;
        }

        return this.state.playerTurnOrder[nextPlayerIndex];
    }

}
