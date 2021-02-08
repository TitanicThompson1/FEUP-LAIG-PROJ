class MyGameSequence {
    constructor() {
        this.gameMoves = [];
    }

    setGameMoves(gameMoves) {
        this.gameMoves = gameMoves;
    }

    addGameMove(move) {
        this.gameMoves.push(move);
    }

    undoGameMove(gameOrchestrator) {
        gameOrchestrator.gameboard.removeAllAnimationsFloats();
        if (this.gameMoves.length > 0) {
            let move = this.gameMoves.pop();
            this.undoMove(gameOrchestrator, move.finalTile, move.initialTile, move.movedPieces, move.blackPoints, move.whitePoints, move.player)
            gameOrchestrator.resetTimer();
            gameOrchestrator.changeState(new ChoosingPieceState(gameOrchestrator));
        }
    }

    undoMove(gameOrchestrator, firstTile, secondTile, movedPieces, blackPoints, whitePoints, player) {
        gameOrchestrator.gameboard.undoMove(firstTile, secondTile, movedPieces);
        gameOrchestrator.updateBlackPoints(blackPoints);
        gameOrchestrator.updateWhitePoints(whitePoints);
        gameOrchestrator.setPlayer(player);
    }

    undoMovesToMovie(gameOrchestrator) {
        gameOrchestrator.gameboard.removeAllAnimationsFloats();
        let moves = [];
        while (this.gameMoves.length > 0) {
            let move = this.gameMoves.pop()
            moves.push(move);
            this.undoMove(gameOrchestrator, move.finalTile, move.initialTile, move.movedPieces, move.blackPoints, move.whitePoints, move.player)
        }

        this.gameMoves = moves;
    }

    popMove() {
        if (this.gameMoves.length > 0) return this.gameMoves.pop()
        return null;
    }
}