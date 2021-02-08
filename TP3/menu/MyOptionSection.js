/**
 * MyOptionSection
 * @constructor Saves the arguments passed and initializes shapes, materials and textures
 * @param {CGFscene} scene the scene
 * @param {Array} options array of strings with the options
 * @param {Array} clickIds the ids for picking of the arrows
 */
class MyOptionSection {

    constructor(scene, options, clickIds) {
        this.scene = scene;
        this.options = options;
        this.clickIds = clickIds;

        // Saving the current option
        this.selectedOption = new MySpriteText(scene, options[0]);
        this.selectedText = options[0];
        this.selectedId = 0;

        // Left arrow shape
        this.leftArrow = new MyButton(scene, "./resources/leftArrow.PNG", this.clickIds[0]);

        // Rigth arrow shape
        this.rigthArrow = new MyButton(scene, "./resources/rigthArrow.PNG", this.clickIds[1]);
    }

    /**
     * Gets the current option's id
     * @return {number} id of the current option
     */
    getSelectedId() {
        return this.selectedId;
    }

    /**
     * Goes to the previous option in the array
     */
    previousOption() {
        if (this.selectedId == 0) return;

        this.selectedId--;
        this.updateOption();
    }

    /**
     * Goes to the next option in the array
     */
    nextOption() {
        if (this.selectedId == this.options.length - 1) return;

        this.selectedId++;
        this.updateOption();
    }

    /**
     * Updates the current optio
     */
    updateOption() {
        this.selectedOption.setText(this.options[this.selectedId]);
        this.selectedText = this.options[this.selectedId];
    }

    /**
     * Displays the arrows and the current option
     */
    display() {
        this.leftArrow.display();
        this.displayCurrOpt();
        this.displayRigthArrw();
    }

    displayCurrOpt() {
        this.scene.pushMatrix();

        this.scene.translate(1, 0, 0);
        this.selectedOption.display();

        this.scene.popMatrix();
    }

    displayRigthArrw() {
        this.scene.pushMatrix();

        this.scene.translate(this.selectedText.length * 0.5 + 1.5, 0, 0);
        this.rigthArrow.display();

        this.scene.popMatrix();
    }
}