/**
 * GameOverState is the game state where it is calculated all the players' information
 * @param {MyGameOrchestrator} gameOrchestrator reference of game orchestrator
 */
class GameOverState extends GameState {
    constructor(gameOrchestrator) {
        super(gameOrchestrator);
        this.gameOrchestrator.prologHandler.requestWinner(this.gameOrchestrator.gameboard.getPrologBoard());
    }

    /**
     * Handles the picking by user and consequences
     * @param {Object} object the object clicked
     * @param {number} id the id of the object clicked
     */
    OnObjectSelected(object, id) {
        if (this.gameOrchestrator.interface3D.clicked(id) == ACTIONS_IB.Restart) this.gameOrchestrator.restartGame();
        else if (this.gameOrchestrator.interface3D.clicked(id) == ACTIONS_IB.Movie) this.prepareMovieState();
    }

    /**
     * Check if the user can pick objects in this state
     * @return True, if the user can pick objects. False otherwise
     */
    checkPickingState() {
        return true;
    }

    /**
     * Changes the state to MovieState
     */
    prepareMovieState() {
        this.gameOrchestrator.interface3D.setCurrentMenu(MENUS.InGameMenu);
        this.gameOrchestrator.changeState(new MovieState(this.gameOrchestrator));
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
     * Handles the server's response: sends all the winner information to the interface
     * @param {*} response 
     */
    handleReply(response) {
        let blackPoints = parseInt(response[0]);
        let blackHighestStack = parseInt(response[1]);
        let whitePoints = parseInt(response[2]);
        let whiteHighestStack = parseInt(response[3]);
        let winner = parseInt(response[4]);

        this.gameOrchestrator.interface3D.setWinnerGOMenu(winner, blackPoints, blackHighestStack, whitePoints, whiteHighestStack);
    }
}