/**
 * AnimationState is the game state where the user can change the game configurations
 * @param {MyGameOrchestrator} gameOrchestrator reference of game orchestrator
 * @param {Array} board array with pieces and respective destination columns and rows
 */
class AnimationState {

    constructor(gameOrchestrator, board) {
        this.gameOrchestrator = gameOrchestrator;
        this.animations = [];
        this.pieces = [];
        this.initAnimations(board);
    }

    /**
     * Check if the user can pick objects in this state
     * @return True, if the user can pick objects. False otherwise
     */
    checkPickingState() {
        return false;
    }

    /**
     * Init Animations of all pieces
     * @param {Array} board  
     */
    initAnimations(board) {

        //each piece will be associated with a row and column of the main board
        for (let i = 0; i < this.gameOrchestrator.nRows; i++) {
            let boardRow = board[i];
            for (let j = 0; j < this.gameOrchestrator.nCols; j++) {
                if (boardRow[j][0] == 1) {
                    let piece = this.gameOrchestrator.auxGreenBoard.getPiece();
                    if (piece != null) {
                        this.initAnimation(this.gameOrchestrator.auxGreenBoard, piece[0], piece[1], j, i);
                        this.pieces.push([piece[2], j, i]);
                    }
                } else if (boardRow[j][0] == 2) {
                    let piece = this.gameOrchestrator.auxBlackBoard.getPiece();
                    if (piece != null) {
                        this.initAnimation(this.gameOrchestrator.auxBlackBoard, piece[0], piece[1], j, i);
                        this.pieces.push([piece[2], j, i]);
                    }
                } else if (boardRow[j][0] == 3) {
                    let piece = this.gameOrchestrator.auxWhiteBoard.getPiece();
                    if (piece != null) {
                        this.initAnimation(this.gameOrchestrator.auxWhiteBoard, piece[0], piece[1], j, i);
                        this.pieces.push([piece[2], j, i]);
                    }
                }
            }
        }
    }

    /**
     * Init piece animation: piece will be moved to its position on the main board 
     * @param {MyAuxBoard} board 
     * @param {number} firstCol piece's column on the auxiliary board
     * @param {number} firstRow piece's row on the auxiliary board
     * @param {number} secondCol piece's column on the main board
     * @param {number} secondRow piece's row on the main board
     */
    initAnimation(board, firstCol, firstRow, secondCol, secondRow) {
        let previousPosition = board.getPiecePosition(firstCol, firstRow);

        let nextPosition = this.gameOrchestrator.gameboard.getPiecePosition(secondCol, secondRow)

        if (board.type == "green") {
            let x = nextPosition[0];
            nextPosition[0] = -nextPosition[2]
            nextPosition[2] = x
        }
        let animation = new PieceAnimation(this.gameOrchestrator.scene, previousPosition, nextPosition, MOVE_SPEED);

        this.animations.push(animation);
        board.setPieceAnimation(firstCol, firstRow, animation);
    }

    /**
     * Updates active animations
     * @param {number} current time
     */
    update(time) {
        for (let i = 0; i < this.animations.length; i++) {
            if (this.animations[i].update(time)) this.animations.splice(i, 1);
            if (this.animations.length == 0) {
                this.prepareNextState();
            }
        }
    }

    /**
     * Changes the state to ChoosingPieceState
     */
    prepareNextState() {
        this.setGameBoard();
        this.gameOrchestrator.changeState(new ChoosingPieceState(this.gameOrchestrator));
    }
    
    /**
     * Move pieces of the auxiliar boards to the main board
     */
    setGameBoard() {
        this.gameOrchestrator.gameboard.setPieces(this.pieces);
        this.gameOrchestrator.gameboard.removeAllAnimationsFloats();

        this.gameOrchestrator.auxWhiteBoard.unsetAllPieces();
        this.gameOrchestrator.auxGreenBoard.unsetAllPieces();
        this.gameOrchestrator.auxBlackBoard.unsetAllPieces();
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

}