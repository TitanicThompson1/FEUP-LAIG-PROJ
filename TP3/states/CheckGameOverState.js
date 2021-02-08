/**
 * CheckGameOverState is the game state where it will be checked if it is game over or not
 * @param {MyGameOrchestrator} gameOrchestrator reference of game orchestrator
 */
class CheckGameOverState extends GameState {
    constructor(gameOrchestrator) {
        super(gameOrchestrator);
        this.gameOrchestrator.prologHandler.requestIsGameOver(this.gameOrchestrator.gameboard.getPrologBoard(), this.gameOrchestrator.currentPlayer);
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
        let currentTheme = this.gameOrchestrator.getCurrentTheme();
        currentTheme.displayScene();
        this.displayGameboard(currentTheme);
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
     * Reset timer and change the state to ChoosingPieceState
     */
    prepareNextState() {
        this.gameOrchestrator.resetTimer();
        this.gameOrchestrator.changeState(new ChoosingPieceState(this.gameOrchestrator));
    }

    /**
     * Change Menu and change the state to GameOverState
     */
    prepareGameOverState() {
        this.gameOrchestrator.interface3D.setCurrentMenu(MENUS.GameOverMenu)
        this.gameOrchestrator.changeState(new GameOverState(this.gameOrchestrator));
    }

    /**
     * Handles the server's response: change state and current player according to response
     * @param {number} response 
     */
    handleReply(response) {
        if (response == 2) this.prepareGameOverState(); //game is over
        else if (response == 1) { // game is not over and the other player can play
            this.gameOrchestrator.changePlayer();
            this.prepareNextState();
        } else
            this.prepareNextState(); //game is not over and the other player don't have valid moves
    }
}