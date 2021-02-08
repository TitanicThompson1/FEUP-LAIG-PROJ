const STACK_DIST = 0.05; // The distance between each piece in the stack
const FLOAT_HEIGHT = 0.1;

/**
 * MyTile
 * @constructor
 * @param scene - reference to the scene object.
 * @param style - an array with the material and texture. 
 * @param piece - the piece that sits on the tile.
 */
class MyTile {
    constructor(scene, col, row, pieceColor, points, stack) {
        this.scene = scene;
        this.col = col;
        this.row = row;
        this.points = parseInt(points);
        this.numPieces = parseInt(stack);

        this.geometry = new MyPlane(scene, 8, 8);
        if (pieceColor != "empty")
            this.pieces = [new MyPiece(scene, pieceColor, this.points)]; //first element represents the top and the last one is the bottom piece
        else
            this.pieces = [];
        this.isfloatPiece = false;
        this.animation = undefined;
        this.marked = false;

        this.isAvailable = true;
        this.createMarkedMaterial();
    }

    getIsAvailable() {
        return this.isAvailable;
    }

    createMarkedMaterial() {
        this.markedMaterial = new CGFappearance(this.scene);
        this.markedMaterial.setShininess(1);
        this.markedMaterial.setAmbient(0.2, 0.2, 0.2, 1.0);
        this.markedMaterial.setDiffuse(0, 0.1, 0.1, 1.0);
        this.markedMaterial.setSpecular(0, 0.1, 0.1, 1.0);
    }

    getPrologTile() {
        if (this.getTopPieceType() == "empty") return [0, 0, 0];
        if (this.getTopPieceType() == "green") return [1, 1, 1];
        if (this.getTopPieceType() == "black") return [2, this.points, this.numPieces];
        if (this.getTopPieceType() == "white") return [3, this.points, this.numPieces];
    }

    getTopPieceType() {
        return (this.numPieces > 0) ? this.pieces[0].getType() : "empty";
    }

    getNumPieces() {
        return this.numPieces;
    }

    addPieces(pieces) {
        this.pieces = pieces.concat(this.pieces);
        this.numPieces = this.pieces.length;
        for (let i = 0; i < pieces.length; i++) {
            this.points += pieces[i].getPoints();
        }
    }

    unsetPieces() {
        this.pieces = [];
        this.numPieces = 0;
        this.points = 0;
    }

    removePieces(pieces) {
        for (let i = 0; i < pieces.length; i++) {
            this.points -= pieces[i].getPoints();
            this.pieces.shift();
        }
        this.numPieces = this.pieces.length;
    }

    setStyle(theme) {
        this.material = theme[0];
        this.texture = theme[1];
    }

    getPieces() {
        return this.pieces;
    }

    markPiece() {
        this.marked = true;
    }

    unmarkPiece() {
        this.marked = false;
    }

    changeTheme(tileTheme, pieceTheme) {
        this.material = tileTheme[0];
        this.texture = tileTheme[1];

        for (let piece of this.pieces) {
            if (piece.getType() == "black") {
                piece.changeTheme(pieceTheme);

            } else if (piece.getType() == "white") {
                piece.changeTheme(pieceTheme);

            } else {
                piece.changeTheme(pieceTheme);
            }
        }
    }

    floatPiece(boolean) {
        this.isfloatPiece = boolean;
    }

    getPiecesHeight() {
        return this.numPieces * STACK_DIST;
    }

    setAnimation(animation) {
        this.animation = animation;
    }

    unsetAnimation() {
        this.animation = undefined;
    }

    display() {
        this.scene.pushMatrix();

        if (this.marked) this.markedMaterial.apply();
        else if (this.material != "null") {
            if (this.texture != "null") {
                this.material.setTexture(this.texture);
            }
            this.material.apply();
        }

        this.scene.scale(0.4, 1, 0.4);

        this.geometry.display();

        if (this.isfloatPiece)
            this.scene.translate(0, FLOAT_HEIGHT, 0);

        if (this.animation != undefined)
            this.animation.apply();

        for (let i = this.numPieces - 1; i >= 0; i--) {
            this.pieces[i].display();
            this.scene.translate(0, STACK_DIST, 0);
        }

        this.scene.popMatrix();
    }
}