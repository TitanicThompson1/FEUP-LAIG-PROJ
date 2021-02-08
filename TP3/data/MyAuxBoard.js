/**
 * MyAuxBoard
 * @constructor
 * @param scene - reference to the scene object.
 * @param nRows - number of rows of the board
 * @param nCols - number of columns of the board.
 */
class MyAuxBoard {
    constructor(scene, type, nPieces, nRows, boardCols, boardRows) {
        this.scene = scene;
        this.nPieces = nPieces;
        this.boardCols = boardCols;
        this.boardRows = boardRows;
        this.type = type;
        this.nRows = nRows;
        this.nCols = Math.ceil(this.nPieces / this.nRows);
        this.geo = new MyPlane(this.scene, 8, 8);
        this.tiles = [];

        for (let i = 0; i < this.nRows; i++) {
            let row = [];
            for (let j = 0; j < this.nCols; j++) {
                let tile; //format : color, points, stack
                if (nPieces != 0) {
                    if (this.type == "green") tile = new MyTile(scene, j, i, "green", 1, 1);
                    else if (this.type == "black") tile = new MyTile(scene, j, i, "black", 0, 1);
                    else if (this.type == "white") tile = new MyTile(scene, j, i, "white", 0, 1);
                    nPieces--;
                } else
                    tile = new MyTile(scene, j, i, "empty", 0, 0);
                row.push(tile);
            }
            this.tiles.push(row);
        }

        this.setCoordinates();
    }

    setCoordinates() {
        this.z = 0;
        this.x1 = 0;
        this.x2 = 0;

        if (this.type == "white") this.x = 0;
        else if (this.type == "black") this.x = this.boardCols / 1.9 + (this.nCols + 0.65) / 1.9;
        else if (this.type == "green") this.x = -this.boardRows / 1.9 + (this.nCols - 1.8) / 1.9;

        if (this.nRows == 6) this.x1 += -TRANSLATE_6;
        else if (this.nRows == 9) this.x1 += -TRANSLATE_9;

        if (this.nCols == 3) {
            this.x2 += -1.8;
            this.z += -3 / 3.65;
        } else if (this.nCols == 2) {
            this.x2 += -1.3;
            this.z += -1;
        }
    }

    unsetAllPieces() {
        for (let row of this.tiles) {
            for (let tile of row) {
                tile.unsetPieces();
            }
        }
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

    getPiece() {
        for (let row of this.tiles) {
            for (let tile of row) {
                if (tile.getIsAvailable()) {
                    let piece = [tile.col, tile.row, tile.getPieces()[0]];
                    tile.isAvailable = false;
                    return piece;
                }
            }
        }
        return null;
    }

    setPieceAnimation(col, row, animation) {
        this.getTile(col, row).setAnimation(animation);
    }

    getTile(col, row) {
        return this.tiles[row][col];
    }

    getPiecePosition(col, row) {
        let x = 0;
        let z = row * TILE_SIZE - TILE_SIZE / 2;;

        if (this.type == "black") {
            if (this.boardCols == 6) x = (this.x - this.x1 - this.x2 + col) * TILE_SIZE - TILE_SIZE / 5.0;
            else if (this.boardCols == 9) x = (this.x - this.x1 - this.x2 + col) * TILE_SIZE + TILE_SIZE / 2.0;
        } else if (this.type == "white") {
            if (this.boardCols == 6) x = (this.x1 + this.x2 - this.nCols + col) * TILE_SIZE + TILE_SIZE / 2.0;
            else if (this.boardCols == 9) x = (this.x1 + this.x2 - this.nCols + col) * TILE_SIZE + TILE_SIZE;
        } else if (this.type == "green") {
            x = (this.x + this.x1 + this.x2 - this.nCols + col) * TILE_SIZE - TILE_SIZE / 2;
            if (this.boardRows == 9) x += -2;
        }

        return [x, 0, z];
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.x, 0, 0);
        this.scene.pushMatrix();

        if (this.material != "null") {
            if (this.texture != "null") {
                this.material.setTexture(this.texture);
            }
            this.material.apply();
        }

        this.scene.rotate(Math.PI / 2.0, 0, 1, 0)
        this.scene.scale(this.nRows / 1.9, 1, this.nCols / 1.9);

        this.scene.translate(this.x1, 0, this.z);

        this.geo.display();

        this.scene.popMatrix();

        this.scene.translate(this.x2, 0.01, 0);

        for (let row of this.tiles) {
            this.scene.pushMatrix();
            for (let tile of row) {
                tile.display();
                this.scene.translate(0.5, 0.0, 0.0);
            }
            this.scene.popMatrix();
            this.scene.translate(0.0, 0.0, 0.5);
        }
        this.scene.popMatrix();
    }
}