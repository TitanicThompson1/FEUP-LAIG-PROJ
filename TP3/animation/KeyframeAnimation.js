const TRANSL_POS = 0;
const ROTX_POS = 1;
const ROTY_POS = 2;
const ROTZ_POS = 3;
const SCALE_POS = 4;


/**
 * KeyFrameAnimation
 * @constructor
 * @param keyframes - array of KeyFrames objects
 */
class KeyFrameAnimation extends Animation {
    constructor(scene, keyframes) {
        super(keyframes[0].instant, keyframes[keyframes.length - 1].instant, keyframes[0].transf, keyframes[keyframes.length - 1].transf);

        this.scene = scene;

        this.keyframes = keyframes;
        this.firstTime = -1;
        this.finished = false;
        this.lastTime = this.startTime;

        //Initializing the KeyFrame range for interpolation
        this.previousKeyFrame = 0;
        this.nextKeyFrame = 1;

        this.initiateVectors();
    }


    /**
     * Initiates the vectors and the state
     */
    initiateVectors() {
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
    update(currentTime) {

        if (this.finished) return;

        // Convert to seconds
        if (this.firstTime == -1) this.firstTime = currentTime;
        let current = (currentTime - this.firstTime) / 1000;

        if (!this.valideAnim(current)) return;

        if (this.verifyOnlyOne()) return;

        this.updateKeyframes(current);

        this.interpolateKeyframes(current);

        // Updating current state
        this.currentState = [this.currentTranslation, this.currentRotationX, this.currentRotationY, this.currentRotationZ, this.currentScale];
    }


    /**
     * Verifies if animation already started or ended
     * @param current the time since the start of the program, in seconds
     */
    valideAnim(current) {

        // Verifies if animation is active
        if (current < this.startTime) return false;

        // Checks if the animation ended
        if (current > this.endTime) {
            this.currentTranslation = this.keyframes[this.keyframes.length - 1].transf[TRANSL_POS];
            this.currentRotationX = this.keyframes[this.keyframes.length - 1].transf[ROTX_POS];
            this.currentRotationY = this.keyframes[this.keyframes.length - 1].transf[ROTY_POS];
            this.currentRotationZ = this.keyframes[this.keyframes.length - 1].transf[ROTZ_POS];
            this.currentScale = this.keyframes[this.keyframes.length - 1].transf[SCALE_POS];

            this.currentState = [this.currentTranslation, this.currentRotationX, this.currentRotationY, this.currentRotationZ, this.currentScale];

            this.finished = true;
            return false;
        }
        return true;
    }

    /**
     * Verifies if there is only one keyframe. If so, ends the animation right away
     */
    verifyOnlyOne() {
        if (this.keyframes.length == 1 && !this.finished) {
            this.currentTranslation = this.keyframes[this.previousKeyFrame].transf[TRANSL_POS];
            this.currentRotationX = this.keyframes[this.previousKeyFrame].transf[ROTX_POS];
            this.currentRotationY = this.keyframes[this.previousKeyFrame].transf[ROTY_POS];
            this.currentRotationZ = this.keyframes[this.previousKeyFrame].transf[ROTZ_POS];
            this.currentScale = this.keyframes[this.previousKeyFrame].transf[SCALE_POS];

            this.currentState = [this.currentTranslation, this.currentRotationX, this.currentRotationY, this.currentRotationZ, this.currentScale];
            this.finished = true;
            return true;
        }
        return false;
    }


    /**
     * Updates the next and previous keyframes, if necessary
     * @param current the time since the start of the program, in seconds
     */
    updateKeyframes(current) {
        if (current >= this.keyframes[this.nextKeyFrame].instant) {
            this.nextKeyFrame++;
            this.previousKeyFrame++;
        }
    }

    /**
     * Does the interpolation of the transformations 
     * @param current the time since the start of the program, in seconds
     */
    interpolateKeyframes(current) {
        // Calculating deltaT
        this.deltaT = current - this.keyframes[this.previousKeyFrame].instant;
        let interpolationTime = this.deltaT / (this.keyframes[this.nextKeyFrame].instant - this.keyframes[this.previousKeyFrame].instant);

        // Doing interpolation
        vec3.lerp(this.currentTranslation, this.keyframes[this.previousKeyFrame].transf[0], this.keyframes[this.nextKeyFrame].transf[TRANSL_POS], interpolationTime); // Translation
        vec3.lerp(this.currentRotationX, this.keyframes[this.previousKeyFrame].transf[1], this.keyframes[this.nextKeyFrame].transf[ROTX_POS], interpolationTime); // RotationX
        vec3.lerp(this.currentRotationY, this.keyframes[this.previousKeyFrame].transf[2], this.keyframes[this.nextKeyFrame].transf[ROTY_POS], interpolationTime); // RotationY
        vec3.lerp(this.currentRotationZ, this.keyframes[this.previousKeyFrame].transf[3], this.keyframes[this.nextKeyFrame].transf[ROTZ_POS], interpolationTime); // Rotationz
        vec3.lerp(this.currentScale, this.keyframes[this.previousKeyFrame].transf[4], this.keyframes[this.nextKeyFrame].transf[SCALE_POS], interpolationTime); // Scale

    }


    /**
     * Return true if the animation ended. False otherwise
     */
    ended() {
        return this.finished;
    }

    /**
     * Applies aniamtion's transformations to the scene
     */
    apply() {
        this.scene.translate(this.currentState[0][0], this.currentState[0][1], this.currentState[0][2]); // Translation
        this.scene.rotate(this.currentState[1][0], 1, 0, 0); // RotationX
        this.scene.rotate(this.currentState[2][1], 0, 1, 0); // RotationY
        this.scene.rotate(this.currentState[3][2], 0, 0, 1); // RotationZ
        this.scene.scale(this.currentState[4][0], this.currentState[4][1], this.currentState[4][2]); // Scale
    }

    /**
     * Resets animation
     */
    reset() {
        this.firstTime = -1;
        this.finished = false;

        this.previousKeyFrame = 0;
        this.nextKeyFrame = 1;

        this.initiateVectors();
    }
}