
/**
 * MySpriteAnimation
 * @constructor
 * @param scene - reference to MyScene object
 * @param spritesheet - reference to the spritesheet of the animation
 * @param duration - duration of the animation
 * @param startCell - the cell where the animation is going to start
 * @param endCell - the cell where the animation is going to end
 */
class MySpriteAnimation {
    constructor(scene, spritesheet, duration, startCell, endCell) {
        this.scene = scene;
        this.spritesheet = spritesheet;
        this.duration = duration;
        this.startCell = startCell;
        this.endCell = endCell;

        this.currentCell = startCell;
        this.cellsPerSecond = (endCell - startCell) / duration; 

        this.geometry = new MyRectangle(scene, 0, 0, 1, 1);

        //Auxiliary variables
        this.finished = false;
        this.firstTime = -1;
        this.lastTime = -1;
        
    }

    update(currentTime){

        if(this.firstTime == -1) {
            this.firstTime = currentTime;
        }
        
        let current = (currentTime - this.firstTime) / 1000;        // Time in seconds

        current = current % this.duration;      //This allows the animation to run indefinitly

        this.currentCell = parseInt(current * this.cellsPerSecond, 10);
    }

    display(){

        this.scene.setActiveShaderSimple(this.spritesheet.shader);
        this.spritesheet.texture.bind(0); //activate the texture shader

        this.scene.pushMatrix();
        this.spritesheet.activateCellP(this.currentCell);
        this.geometry.display();

        this.scene.popMatrix();
        this.spritesheet.reset();
    }
}