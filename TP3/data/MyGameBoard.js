/**
 * MyGameBoard
 * @constructor
 * @param scene - reference to the scene object.
 * @param nRows - number of rows of the board
 * @param nCols - number of columns of the board.
 */
class MyGameBoard {
    constructor(scene, nRows, nCols) {
        this.scene = scene;
        this.geo = new MyPlane(scene, 8, 8);
        this.tiles = [];
        this.nRows = nRows;
        this.nCols = nCols;

        for (let i = 0; i < nRows; i++) {
            let row = [];
            for (let j = 0; j < nCols; j++) {
                row.push(new MyTile(scene, j, i, "empty", 0, 0));
            }
            this.tiles.push(row);
        }
    }

    setPieces(pieces) {
        for (let i = 0; i < pieces.length; i++) {
            let piece = pieces[i];
            this.getTile(piece[1], piece[2]).addPieces([piece[0]]);
        }
    }

    getPrologBoard() {
        let board = [];
        for (let i = 0; i < this.nRows; i++) {
            let row = [];
            for (let j = 0; j < this.nCols; j++) {
                let tile = this.getTile(j, i);
                row.push(tile.getPrologTile());
            }
            board.push(row);
        }
        return board;
    }

    changeTheme(gameBoardTheme, tileTheme, pieceTheme) {
        this.material = gameBoardTheme[0];
        this.texture = gameBoardTheme[1];

        for (let row of this.tiles) {
            for (let tile of row) {
                tile.changeTheme(tileTheme, pieceTheme);
            }
        }
    }

    getTile(col, row) {
        return this.tiles[row][col];
    }

    selectPiece(col, row) {
        this.getTile(col, row).floatPiece(true);
    }

    unselectPiece(col, row) {
        this.getTile(col, row).floatPiece(false);
    }

    movePiece(firstTile, secondTile) {
        let pieces = firstTile.getPieces();
        firstTile.unsetPieces();
        secondTile.addPieces(pieces);
        return pieces;
    }

    undoMove(firstTile, secondTile, movedPieces) {
        secondTile.addPieces(movedPieces);
        firstTile.removePieces(movedPieces);
    }

    getPiecePosition(col, row) {
        return [col * TILE_SIZE - TILE_SIZE / 2, this.getTile(col, row).getPiecesHeight(), row * TILE_SIZE - TILE_SIZE / 2];
    }

    setPieceAnimation(col, row, animation) {
        this.getTile(col, row).setAnimation(animation);
    }

    unsetPieceAnimation(col, row) {
        this.getTile(col, row).unsetAnimation();
    }

    markValidMoves(validMoves) {
        for (let i = 0; i < validMoves.length; i++) {
            let row = validMoves[i][1];
            let col = validMoves[i][0];
            this.getTile(col, row).markPiece();
        }
    }

    unmarkValidMoves(validMoves) {
        for (let i = 0; i < validMoves.length; i++) {
            let row = validMoves[i][1];
            let col = validMoves[i][0];
            this.getTile(col, row).unmarkPiece();
        }
    }

    removeAllAnimationsFloats() {
        for (let row of this.tiles) {
            for (let tile of row) {
                tile.floatPiece(false);
                tile.unmarkPiece();
                tile.unsetAnimation();
            }
        }
    }

    display() {

        this.scene.pushMatrix();
        this.scene.pushMatrix();

        if (this.material != "null") {
            if (this.texture != "null") {
                this.material.setTexture(this.texture);
            }
            this.material.apply();
        }

        this.scene.scale(this.nCols / 1.9, 1, this.nRows / 1.9);

        if ((this.nRows == 6) && (this.nCols == 6)) this.scene.translate(TRANSLATE_6, 0, TRANSLATE_6);
        else if ((this.nRows == 9) && (this.nCols == 6)) this.scene.translate(TRANSLATE_6, 0, TRANSLATE_9);
        else if ((this.nRows == 9) && (this.nCols == 9)) this.scene.translate(TRANSLATE_9, 0, TRANSLATE_9);

        this.geo.display();

        this.scene.popMatrix();

        this.scene.translate(0, 0.01, 0);

        let i = 1;
        for (let row of this.tiles) {
            this.scene.pushMatrix();
            for (let tile of row) {
                this.scene.registerForPick(i, tile); // this enables the tile for picking
                tile.display();
                this.scene.clearPickRegistration();
                this.scene.translate(0.5, 0.0, 0.0);
                i++;
            }
            this.scene.popMatrix();
            this.scene.translate(0.0, 0.0, 0.5);
        }
        this.scene.popMatrix();
    }
}