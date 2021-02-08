class MyGameMove {
    constructor(initialTile, finalTile, player, blackPoints, whitePoints) {
        this.initialTile = initialTile;
        this.finalTile = finalTile;
        this.player = player;
        this.blackPoints = blackPoints;
        this.whitePoints = whitePoints;
    }

    setMovedPieces(movedPieces) {
        this.movedPieces = movedPieces;
    }
}