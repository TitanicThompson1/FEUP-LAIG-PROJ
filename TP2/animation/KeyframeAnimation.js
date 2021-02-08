
/**
 * KeyFrameAnimation
 * @constructor
 * @param keyframes - array of KeyFrames objects
*/
class KeyFrameAnimation extends Animation {
    constructor(keyframes){
        super(keyframes[0].instant, keyframes[keyframes.length - 1].instant, keyframes[0].transf, keyframes[keyframes.length - 1].transf);

        this.keyframes = keyframes;
        this.firstTime = -1;
        this.finished = false;
        this.lastTime = this.startTime;

        //Initializing the KeyFrame range for interpolation
        this.previousKeyFrame = 0;
        this.nextKeyFrame = 1;

        this.currentTranslation = vec3.create();
        this.currentRotationX = vec3.create();
        this.currentRotationY = vec3.create();
        this.currentRotationZ = vec3.create();
        this.currentScale = vec3.create();

        this.currentState = [this.currentTranslation, this.currentRotationX, this.currentRotationY, this.currentRotationZ, this.currentScale];
    }

    /**
     * Updates animation's state depending on the current time
     * @param currentTime 
     */
    update(currentTime){

        if(this.finished) return;

        // Convert to seconds
        if(this.firstTime == -1) this.firstTime = currentTime;
        let current = (currentTime - this.firstTime) / 1000;
        
        // Verifies if animation is active
        if(current < this.startTime) return;

        // When there is only one Keyframe
        if(this.keyframes.length == 1 && !this.finished){
            this.currentTranslation = this.keyframes[this.previousKeyFrame].transf[0];
            this.currentRotationX = this.keyframes[this.previousKeyFrame].transf[1];
            this.currentRotationY = this.keyframes[this.previousKeyFrame].transf[2];
            this.currentRotationZ = this.keyframes[this.previousKeyFrame].transf[3];
            this.currentScale = this.keyframes[this.previousKeyFrame].transf[4];

            this.currentState = [this.currentTranslation, this.currentRotationX, this.currentRotationY, this.currentRotationZ, this.currentScale];
            this.finished = true;
            return;
        }
    
        if(current > this.endTime){
            this.finished = true;    
            return;
        } 

        //Updating previous and next  KeyFrame
        if(current >= this.keyframes[this.nextKeyFrame].instant){
            this.nextKeyFrame++;
            this.previousKeyFrame++;
        }    

        // Calculating deltaT
        this.deltaT = current - this.keyframes[this.previousKeyFrame].instant;
        let interpolationTime = this.deltaT / (this.keyframes[this.nextKeyFrame].instant - this.keyframes[this.previousKeyFrame].instant);

        // Doing interpolation
        vec3.lerp(this.currentTranslation, this.keyframes[this.previousKeyFrame].transf[0], this.keyframes[this.nextKeyFrame].transf[0], interpolationTime); // Translation
        vec3.lerp(this.currentRotationX, this.keyframes[this.previousKeyFrame].transf[1], this.keyframes[this.nextKeyFrame].transf[1], interpolationTime);   // RotationX
        vec3.lerp(this.currentRotationY, this.keyframes[this.previousKeyFrame].transf[2], this.keyframes[this.nextKeyFrame].transf[2], interpolationTime);   // RotationY
        vec3.lerp(this.currentRotationZ, this.keyframes[this.previousKeyFrame].transf[3], this.keyframes[this.nextKeyFrame].transf[3], interpolationTime);   // Rotationz
        vec3.lerp(this.currentScale, this.keyframes[this.previousKeyFrame].transf[4], this.keyframes[this.nextKeyFrame].transf[4], interpolationTime);       // Scale
        
        // Updating current state
        this.currentState = [this.currentTranslation, this.currentRotationX, this.currentRotationY, this.currentRotationZ, this.currentScale];        
    }

    /**
     * Applies aniamtion's transformations to the scene
     * @param scene 
     */
    apply(scene){
        

        scene.translate(this.currentState[0][0], this.currentState[0][1], this.currentState[0][2]);     // Translation
        scene.rotate(this.currentState[1][0], 1, 0, 0);                                                 // RotationX
        scene.rotate(this.currentState[2][1], 0, 1, 0);                                                 // RotationY
        scene.rotate(this.currentState[3][2], 0, 0, 1);                                                 // RotationZ
        scene.scale(this.currentState[4][0], this.currentState[4][1], this.currentState[4][2]);         // Scale
    }

    /**
     * Resets animation
     */
    reset(){
        this.firstTime = -1;
        this.finished = false;

        this.previousKeyFrame = 0;
        this.nextKeyFrame = 1;

        this.currentTranslation = vec3.create();
        this.currentRotationX = vec3.create();
        this.currentRotationY = vec3.create();
        this.currentRotationZ = vec3.create();
        this.currentScale = vec3.create();
        this.currentState = [this.currentTranslation, this.currentRotationX, this.currentRotationY, this.currentRotationZ, this.currentScale];
    }
}      