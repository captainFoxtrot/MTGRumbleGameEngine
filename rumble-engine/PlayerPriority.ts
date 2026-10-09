import { GameState } from "./GameState";

export class PlayerPriority {
    private state: GameState | null;
    private priorityHolder: string;
    private priorityInitiator: string;

    constructor() {
        this.state = null;
        this.priorityHolder = "";
        this.priorityInitiator = "";
    }

    public setState(state: GameState){
        this.state = state;
    }

    public StartPlayerPriorityCheck(playerId: string | undefined = undefined) {
        if(!this.state) return;
        this.priorityHolder = playerId ?? this.state.playerIdTurn;
        this.priorityInitiator = playerId ?? this.state.playerIdTurn;
    }

    public PassPriority() {
        var targetNextPlayer = this.GetNextPlayer();
        
        if(!targetNextPlayer || this.priorityInitiator === targetNextPlayer) {
            return this.ResolveStackItem();
        }

        this.priorityHolder = targetNextPlayer ?? "";
    }

    private ResolveStackItem(){
        if(!this.state) return;
        const item = this.state.stack.pop();
        for(const action of item?.behaviour?.actions ?? []){
            if(!item?.card) continue;
            action(this.state, item.card, item.triggeredEvent)
        }
        if(this.state.stack.length > 0) this.StartPlayerPriorityCheck();
    }

    private GetNextPlayer(): string | undefined{
        if(!this.state) return;
        const activePlayers = this.state.playerTurnOrder.filter(x => !this.state?.players[x].hasLostOrgivenUp);

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
