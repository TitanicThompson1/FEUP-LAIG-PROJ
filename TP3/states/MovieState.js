/**
 * MovieState is the game state where the user can watch the game movie
 * @param {MyGameOrchestrator} gameOrchestrator reference of game orchestrator
 */
class MovieState extends GameState {
    constructor(gameOrchestrator) {
        super(gameOrchestrator);
        this.animations = [];
        this.gameMoves = [];

        this.gameOrchestrator.gameSequence.undoMovesToMovie(this.gameOrchestrator); //goes to the beggining of the game

        this.move = this.gameOrchestrator.gameSequence.popMove();
        this.gameMoves.push(this.move);

        this.initiateAnimation();
    }

    /**
     * Updates active animations
     * @param {number} current time
     */
    update(time) {
        for (let i = 0; i < this.animations.length; i++) {
            if (this.animations[i].update(time)) this.animations.splice(i, 1);
            if (this.animations.length == 0) {
                if (this.move != null) {
                    this.gameOrchestrator.gameSequence.undoMove(this.gameOrchestrator, this.move.initialTile, this.move.finalTile, this.move.movedPieces, this.move.blackPoints, this.move.whitePoints, this.move.player)
                    if ((this.move = this.gameOrchestrator.gameSequence.popMove()) != null) {
                        this.gameMoves.push(this.move);
                        this.initiateAnimation();
                    } else this.prepareNextState();
                }
            }
        }
    }

    /**
     * Changes the state to GameOverState and changes interface to game over menu
     */
    prepareNextState() {
        this.gameOrchestrator.gameSequence.setGameMoves(this.gameMoves);
        this.gameOrchestrator.interface3D.setCurrentMenu(MENUS.GameOverMenu)
        this.gameOrchestrator.changeState(new GameOverState(this.gameOrchestrator));
    }

    /**
     * Check if the user can pick objects in this state
     * @return True, if the user can pick objects. False otherwise
     */
    checkPickingState() {
        return false;
    }

    /**
     * Init piece animation according to initial and final destination
     */
    initiateAnimation() {
        let previousPosition = this.gameOrchestrator.gameboard.getPiecePosition(this.move.initialTile.col, this.move.initialTile.row);
        previousPosition[1] = 0; //in the start position, the height is not needed        

        let nextPosition = this.gameOrchestrator.gameboard.getPiecePosition(this.move.finalTile.col, this.move.finalTile.row)

        let animation = new PieceAnimation(this.gameOrchestrator.scene, previousPosition, nextPosition, MOVE_SPEED);

        this.animations.push(animation);

        this.gameOrchestrator.gameboard.setPieceAnimation(this.move.initialTile.col, this.move.initialTile.row, animation);
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