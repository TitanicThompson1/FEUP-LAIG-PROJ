
/**
 * MyCamera
 * This class is very similar to CGFcamera, but it adds the getTarget and getPosition functions
 */
class MyCamera extends CGFcamera{
    constructor(fov, near, far, position, target){
        super(fov, near, far, position, target)
        this.position = position;
        this.target = target;
    }

    getTarget(){ return this.target;}

    getPosition(){return this.position;}

    setTarget(target){
        this.target = target;
        super.setTarget(target);
    }

    setPosition(position){
        this.position = position;
        super.setPosition(position);
    }

}