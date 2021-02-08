const MOVE_SPEED = 3;

/**
 * ProcessingMoveState is the game state where the moviment is being processed
 * @param {MyGameOrchestrator} gameOrchestrator reference of game orchestrator
 * @param {number} firstCol col of the initial tile
 * @param {number} firstRow row of the initial tile
 * @param {number} secondCol col of the destination tile
 * @param {number} secondRow row of the destination tile
 */
class ProcessingMoveState extends GameState {

    constructor(gameOrchestrator, firstCol, firstRow, secondCol, secondRow) {
        super(gameOrchestrator);

        this.firstTile = this.gameOrchestrator.gameboard.getTile(firstCol, firstRow);
        this.secondTile = this.gameOrchestrator.gameboard.getTile(secondCol, secondRow);
        let prologFirst = this.firstTile.getPrologTile();
        let prologEnd = this.secondTile.getPrologTile();

        this.gameMove = new MyGameMove(this.firstTile, this.secondTile, this.firstTile.getTopPieceType(), this.gameOrchestrator.blackPoints, this.gameOrchestrator.whitePoints);

        this.animations = [];
        this.boardReady = false;

        this.initiateAnimation();
        this.gameOrchestrator.prologHandler.requestUpdatePoints(prologFirst, prologEnd, this.gameOrchestrator.currentPlayer, this.gameOrchestrator.blackPoints, this.gameOrchestrator.blackType, this.gameOrchestrator.whitePoints, this.gameOrchestrator.whiteType)
    }

    /**
     * Check if the user can pick objects in this state
     * @return True, if the user can pick objects. False otherwise
     */
    checkPickingState() {
        return false;
    }

    /**
     * Updates active animations
     * @param {number} current time
     */
    update(time) {
        for (let i = 0; i < this.animations.length; i++) {
            if (this.animations[i].update(time)) this.animations.splice(i, 1);
            if (this.animations.length == 0) {
                this.processMove();
                this.prepareNextState();
            }
        }
    }

    /**
     * Init piece animation according to initial and final destination
     */
    initiateAnimation() {
        let previousPosition = this.gameOrchestrator.gameboard.getPiecePosition(this.firstTile.col, this.firstTile.row);
        previousPosition[1] = 0; //in the start position, the height is not needed        

        let nextPosition = this.gameOrchestrator.gameboard.getPiecePosition(this.secondTile.col, this.secondTile.row)

        let animation = new PieceAnimation(this.gameOrchestrator.scene, previousPosition, nextPosition, MOVE_SPEED);

        this.animations.push(animation);

        this.gameOrchestrator.gameboard.setPieceAnimation(this.firstTile.col, this.firstTile.row, animation);
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
     * Changes the state to CheckGameOverState
     */
    prepareNextState() {
        this.gameOrchestrator.changeState(new CheckGameOverState(this.gameOrchestrator));
    }

    /**
     * Processes move, stores the moved pieces in the gameMove and add this move to the game sequence
     */
    processMove() {
        let movedPieces = this.gameOrchestrator.gameboard.movePiece(this.firstTile, this.secondTile);
        this.gameMove.setMovedPieces(movedPieces);
        this.gameOrchestrator.gameSequence.addGameMove(this.gameMove);
    }

    /**
     * Handles the server's response
     * @param {*} response 
     */
    handleReply(response) {
        for (let i = 0; i < response.length; i++) {
            let element = response[i];
            if (element[0] == 0) this.gameOrchestrator.updateBlackPoints(element[1]);
            else if (element[0] == 1) this.gameOrchestrator.updateWhitePoints(element[1]);
        }
    }
}