/**
 * LoadingState is the game state where the server sends a random board with the size choosen by the user
 * @param {MyGameOrchestrator} gameOrchestrator reference of game orchestrator
 */
class LoadingState extends GameState {

    constructor(gameOrchestrator) {
        super(gameOrchestrator);
        this.gameOrchestrator.prologHandler.requestInitBoard(this.gameOrchestrator.boardSize);
        this.gameOrchestrator.changeTheme();
    }

    /**
     * Check if the user can pick objects in this state
     * @return True, if the user can pick objects. False otherwise
     */
    checkPickingState() {
        return false;
    }

    /**
     * Display scene and boards
     */
    display() {
        this.gameOrchestrator.scene.getCurrentTheme().displayScene();
        this.displayGameboard(this.gameOrchestrator.scene.getCurrentTheme());
    }

    /**
     * Display boards
     * @param {*} currentTheme 
     */
    displayGameboard(currentTheme) {
        this.gameOrchestrator.scene.pushMatrix();
        this.gameOrchestrator.scene.multMatrix(currentTheme.boardTransf);

        this.gameOrchestrator.displayAuxBoards();
        this.gameOrchestrator.gameboard.display();

        this.gameOrchestrator.scene.popMatrix();
    }

    /**
     * Changes the state to AnimationState
     */
    prepareNextState(board) {
        this.gameOrchestrator.changeState(new AnimationState(this.gameOrchestrator, board));
    }

    /**
     * Handles the server's response and sends the board to the next state
     * @param {*} response 
     */
    handleReply(response) {
        this.prepareNextState(response);
    }
}