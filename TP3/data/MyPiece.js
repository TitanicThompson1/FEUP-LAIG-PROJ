/**
 * MyPiece
 * @constructor
 * @param scene - reference to the scene object.
 * @param type - the type of the piece. 
 * @param style - an array with the material and texture. 
 * @param geometry - the geometry of the piece.
 */
class MyPiece {
    constructor(scene, type, points) {
        this.scene = scene;
        this.type = type;
        this.geometry = new MyCylinder(this.scene, 0.5, 0.0, 0.5, 4, 4);
        this.points = points;
    }

    getPoints() {
        return this.points;
    }

    getType() {
        return this.type;
    }

    changeTheme(style) {
        if (this.type == "black") {
            this.material = style[0][0];
            this.texture = style[0][1];
        } else if (this.type == "white") {
            this.material = style[1][0];
            this.texture = style[1][1];
        } else if (this.type == "green") {
            this.material = style[2][0];
            this.texture = style[2][1];
        }
    }

    display() {

        this.scene.pushMatrix();

        if (this.material != "null") {
            if (this.texture != "null") {
                this.material.setTexture(this.texture);
            }
            this.material.apply();
        }

        this.material.apply();
        this.scene.rotate(-Math.PI / 2.0, 1, 0, 0);
        this.scene.rotate(Math.PI / 4.0, 0, 0, 1);

        this.geometry.display();

        this.scene.popMatrix();
    }
}