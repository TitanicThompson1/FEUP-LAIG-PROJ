/**
 * KeyFrame
 * @constructor
 * @param instant - the instant, in seconds, of the aanimation 
 * @param transformations - an array with the transformations [Translation, RotateX, RotateY, RotateZ, Scale]
 */
class KeyFrame {
    constructor(instant, transformations = []) {
        this.instant = instant;
        this.transf = transformations;
    }

    /**
     * Sets transformations with given transformations array
     * @param transformations 
     */
    setTransformations(transformations) {
        this.transf = transformations;
    }
}