/**
 * ChoosingMoveState is the game state where the player will choose the second tile
 * @param {MyGameOrchestrator} gameOrchestrator reference of game orchestrator
 * @param {Array} validMoves array with all the available moves according to the selected tile
 * @param {number} selectedId id of the first tile
 */
class ChoosingMoveState extends GameState {

    constructor(gameOrchestrator, validMoves, selectedId) {
        super(gameOrchestrator);
        this.selectedId = selectedId;
        this.parseValidMoves(validMoves);
        this.gameOrchestrator.gameboard.markValidMoves(this.validMoves)
    }

    /**
     * Gets the column and row of the selected tile and stores the available moves
     * @param {Array} validMoves 
     */
    parseValidMoves(validMoves) {
        this.selectedCol = validMoves[0][0][0];
        this.selectedRow = validMoves[0][0][1];

        this.validMoves = [];

        for (let i = 0; i < validMoves.length; i++) {
            this.validMoves.push(validMoves[i][1]);
        }
    }

    /**
     * Handles the picking by user and consequences
     * @param {Object} object the object clicked
     * @param {number} id the id of the object clicked
     */
    OnObjectSelected(object, id) {
        if (object instanceof MyTile) {
            if (this.selectedId == id) {
                this.gameOrchestrator.gameboard.unmarkValidMoves(this.validMoves);
                this.gameOrchestrator.gameboard.unselectPiece(object.col, object.row);
                this.gameOrchestrator.changeState(new ChoosingPieceState(this.gameOrchestrator));
            } else if (this.checkValidMove(object.col, object.row)) { // selecting one piece that it is not the selected one
                this.prepareNextState(object.col, object.row);
            }
        }
    }

    /**
     * Checks if the tile with col and row is in the array of valid moves
     * @param {number} col 
     * @param {number} row 
     * @return True if it is a valid move; False, otherwise
     */
    checkValidMove(col, row) {
        for (let i = 0; i < this.validMoves.length; i++) {
            if ([col, row].toString() == this.validMoves[i].toString()) return true;
        }
        return false;
    }

    /**
     * Check if the user can pick objects in this state
     * @return True, if the user can pick objects; False, otherwise
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

            this.gameOrchestrator.gameboard.unmarkValidMoves(this.validMoves);
            this.gameOrchestrator.gameboard.unselectPiece(this.selectedCol, this.selectedRow);
            this.gameOrchestrator.changeState(new ChoosingPieceState(this.gameOrchestrator));
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
     * Unmarks valid pieces and changes the state to ProcessingMoveState
     */
    prepareNextState(col, row) {
        this.gameOrchestrator.gameboard.unmarkValidMoves(this.validMoves)
        this.gameOrchestrator.changeState(new ProcessingMoveState(this.gameOrchestrator, this.selectedCol, this.selectedRow, col, row));
    }

}