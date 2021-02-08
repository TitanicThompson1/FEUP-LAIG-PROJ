/**
 * ChoosingPieceState is the game state where the user can select the pieces to move
 * @param {MyGameOrchestrator} gameOrchestrator reference of game orchestrator
 */
class ChoosingPieceState extends GameState {

    constructor(gameOrchestrator) {
        super(gameOrchestrator);
        this.previousPiece = 0;
        this.firstTime = true;
    }

    /**
     * Handles the picking by user and consequences
     * @param {Object} object the object clicked
     * @param {number} id the id of the object clicked
     */
    OnObjectSelected(object, id) {
        if ((this.gameOrchestrator.getCurrentPlayerType() == 0) && (object instanceof MyTile)) {
            if (this.previousPiece == 0 && (object.getTopPieceType() == this.gameOrchestrator.currentPlayer)) { // selecting for the first time
                this.gameOrchestrator.gameboard.selectPiece(object.col, object.row);
                this.previousCol = object.col;
                this.previousRow = object.row;
                this.previousPiece = id;
                this.gameOrchestrator.prologHandler.requestValidateCell(this.gameOrchestrator.gameboard.getPrologBoard(), object.col, object.row, this.gameOrchestrator.currentPlayer)
            }
        } else {
            if (this.gameOrchestrator.interface3D.clicked(id) == ACTIONS_IB.Undo) this.gameOrchestrator.gameSequence.undoGameMove(this.gameOrchestrator);
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
     * Updates active animations
     * @param {number} current time
     */
    update(time) {
        if (this.gameOrchestrator.interface3D.update(time) == ACTIONS_IB.LostTurn) {
            this.gameOrchestrator.changeCurrentPlayer();
            this.gameOrchestrator.resetTimer();
        }
        if ((this.gameOrchestrator.getCurrentPlayerType() != 0) && (this.firstTime)) {
            this.gameOrchestrator.prologHandler.requestComputerMove(this.gameOrchestrator.gameboard.getPrologBoard(), this.gameOrchestrator.currentPlayer, this.gameOrchestrator.blackPoints, this.gameOrchestrator.blackType, this.gameOrchestrator.whitePoints, this.gameOrchestrator.whiteType)
            this.firstTime = false;
        }
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
     * Changes the state to ChoosingPieceState
     */
    prepareHumanState(validMoves) {
        this.gameOrchestrator.changeState(new ChoosingMoveState(this.gameOrchestrator, validMoves, this.previousPiece));
    }

    /**
     * Changes the state to ProcessingMoveState
     */
    prepareComputerState(move) {
        this.gameOrchestrator.gameboard.selectPiece(move[0][0], move[0][1]);
        this.gameOrchestrator.changeState(new ProcessingMoveState(this.gameOrchestrator, move[0][0], move[0][1], move[1][0], move[1][1]));
    }

    /**
     * Handles the server's response
     * @param {Array} response 
     */
    handleReply(validMoves) {
        if (this.gameOrchestrator.getCurrentPlayerType() != 0) this.prepareComputerState(validMoves); // change to the next state
        else if (validMoves.length == 0) { //the selected piece does not have valid moves so the player must have to choose the first tile again
            this.gameOrchestrator.gameboard.unselectPiece(this.previousCol, this.previousRow)
            this.previousPiece = 0;
        } else this.prepareHumanState(validMoves); // change to the next state
    }
}