/**
 * KeyFrame
 * @constructor
 * @param instant - the instant, in seconds, of the aanimation 
 */
class KeyFrame{
    constructor(instant){
        this.instant = instant;
    }
    
    setTransformations(transformations){
        this.transf = transformations;
    }
}