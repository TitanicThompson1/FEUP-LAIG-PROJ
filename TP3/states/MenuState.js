/**
 * Menu State is the game state where the user can change the game configurations
 * @param {MyGameOrchestrator} gameOrchestrator reference of game orchestrator
 */
class MenuState extends GameState {

    constructor(gameOrchestrator) {
        super(gameOrchestrator);
       
    }

    /**
     * Handles the picking by user and consequences
     * @param {Object} object the object clicked
     * @param {number} id the id of the object clicked
     */
    OnObjectSelected(object, id) {
        if (this.gameOrchestrator.interface3D.clicked(id) == ACTIONS_IB.GoToGame) {
            this.transferOptions();
            this.prepareNextState();
        }
    }

    /**
     * Check if the user can pick objects in this state
     * @return True, if the user can pick objects. False otherwise
     */
    checkPickingState() {
        return true;
    }

    /**
     * Changes the state to LoadingState
     */
    prepareNextState() {
        this.gameOrchestrator.changeState(new LoadingState(this.gameOrchestrator))
    }

    /**
     * Puts the options selected by the user into game orchestrator
     */
    transferOptions() {
        this.gameOrchestrator.setBoardSize(this.gameOrchestrator.interface3D.getBoardSize());
        this.gameOrchestrator.blackType = this.gameOrchestrator.interface3D.getPBlack();
        this.gameOrchestrator.whiteType = this.gameOrchestrator.interface3D.getPWhite();
        this.gameOrchestrator.setCurrentTheme(this.gameOrchestrator.interface3D.getTheme());
    }
}