/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param bottomRadius - bottom's radius
 * @param topRadius - top's radius
 * @param height - cilinder's height
 * @param stacks - number of divisions between poles
 * @param slices - number of divisions around axis
 */

class MyCylinder extends CGFobject {
    constructor(scene, height, topRadius, bottomRadius, stacks, slices) {
        super(scene);
        this.bottomRadius = bottomRadius;
        this.topRadius = topRadius;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.topBase = new MyCircle(scene, slices, topRadius);
        this.bottomBase = new MyCircle(scene, slices, bottomRadius);
        this.lateral = new MyCylinderLateral(scene, height, topRadius, bottomRadius, stacks, slices);
    }

    display() {
        //Bottom base
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.bottomBase.display();
        this.scene.popMatrix();

        //Lateral
        this.lateral.display();

        //Top base
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.height);
        this.topBase.display();
        this.scene.popMatrix();
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