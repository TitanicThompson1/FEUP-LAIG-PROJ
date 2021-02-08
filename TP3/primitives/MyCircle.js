/**
 * MyCircle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param radius - circle's radius
 * @param slices - number of divisions
 */

class MyCircle extends CGFobject {
    constructor(scene, slices, radius) {
        super(scene);

        this.slices = slices;
        this.radius = radius;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let ang = 0;
        let alphaAng = 2 * Math.PI / this.slices;

        //including 
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0.5, 0.5);

        for (let i = 0; i <= this.slices; i++) {

            //Pushing vertices
            this.vertices.push(this.radius * Math.cos(ang), this.radius * Math.sin(ang), 0);

            //Pushing normals
            this.normals.push(0, 0, 1);

            //Pushing text coord
            this.texCoords.push((Math.cos(ang) + 1) / 2.0, 1 - (Math.sin(ang) + 1) / 2.0);

            //Updating angle
            ang += alphaAng;
        }


        //Pushing indices
        for (let i = 0; i < this.slices; i++) {
            this.indices.push(0, i, i + 1);
        }

        this.indices.push(0, this.slices, 1);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }


    /**
     * @method updateTexCoords
     * Updates the list of texture coordinates
     * @param {Array} coords - Array of texture coordinates
     */
    updateTexCoords(coords) {
        this.texCoords = [...coords];
        this.updateTexCoordsGLBuffers();
    }
}