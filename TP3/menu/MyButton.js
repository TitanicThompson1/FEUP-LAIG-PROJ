/**
 * MyButton
 * @constructor Saves the arguments passed and initializes shape, materials and textures
 * @param {CGFscene} scene the scene
 * @param {string} texture the path to the texture
 * @param {number} clickId the id to identify the button
 */
class MyButton {

    constructor(scene, texture, clickId) {
        this.scene = scene;
        this.clickId = clickId;
        this.texture = texture;
        this.createButton();

    }

    /**
     * Creates the shape, material and textures for the button
     */
    createButton() {

        //Creating shape
        this.bttn = new MyRectangle(this.scene, 0, 0, 0.5, 0.5);

        // Creating material
        this.mat = new CGFappearance(this.scene);
        this.mat.setAmbient(1, 1, 1, 1);
        this.mat.setDiffuse(0.2, 0.2, 0.2, 1);
        this.mat.setSpecular(0.2, 0.2, 0.2, 1);

        // Creating texture
        this.texture = new CGFtexture(this.scene, this.texture);
    }

    /**
     * Displays the button
     */
    display() {
        this.mat.setTexture(this.texture);
        this.mat.apply();
        this.scene.registerForPick(this.clickId, this.bttn);
        this.bttn.display();
        this.scene.clearPickRegistration();
    }
}