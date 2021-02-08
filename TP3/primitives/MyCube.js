/**
 * MyCube
 * @constructor
 * @param scene - Reference to MyScene object
 * @param texture - path of the texture
 */

class MyCube extends CGFobject {
    constructor(scene, texture) {
        super(scene);
        this.scene = scene;
    
        this.initFaces();
        this.initMaterials();
        
        // Initializing texture
        this.texture = new CGFtexture(scene, texture);

    }


    initFaces() {
        this.front = new MyRectangle(this.scene, 0, 0, 1, 1);
        this.back = new MyRectangle(this.scene, 0, 0, 1, 1);
        this.left = new MyRectangle(this.scene, 0, 0, 1, 1);
        this.right = new MyRectangle(this.scene, 0, 0, 1, 1);
        this.top = new MyRectangle(this.scene, 0, 0, 1, 1);
        this.bottom = new MyRectangle(this.scene, 0, 0, 1, 1);
    }


    initMaterials() {
        this.material = new CGFappearance(this.scene);
        this.material.setAmbient(1, 1, 1, 1);
        this.material.setDiffuse(0.2, 0.2, 0.2, 1);
        this.material.setSpecular(0.2, 0.2, 0.2, 1);
       
    }


    /**
     * Displays the cube
     */
    display() {
        
        this.material.setTexture(this.texture);
        this.material.apply();

        //Front face
        this.displayFrontFace();

        //Back face
        this.displayBackFace();

        //Left face
        this.displayLeftFace();

        //Right face
        this.displayRightFace();

        //Top face
        this.displayTopFace();

        //Bottom face
        this.displayBottomFace();
    }


    displayBottomFace() {
        this.scene.pushMatrix();

        this.scene.translate(0, 0, -1);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.bottom.display();

        this.scene.popMatrix();
    }

    displayTopFace() {
        this.scene.pushMatrix();

        this.scene.translate(0, 1, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.top.display();

        this.scene.popMatrix();
    }

    displayRightFace() {
        this.scene.pushMatrix();

        this.scene.translate(1, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.right.display();

        this.scene.popMatrix();
    }

    displayLeftFace() {
        this.scene.pushMatrix();

        this.scene.translate(0, 0, -1);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.left.display();

        this.scene.popMatrix()
    }

    displayBackFace() {
        this.scene.pushMatrix();

        this.scene.translate(0, 0, -1);
        this.scene.translate(1, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.back.display();

        this.scene.popMatrix();
    }

    displayFrontFace() {
        this.scene.pushMatrix();

        this.front.display();
        
        this.scene.popMatrix();
    }
}