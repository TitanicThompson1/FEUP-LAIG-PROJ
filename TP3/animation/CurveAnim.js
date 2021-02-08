class CurveAnim extends KeyFrameAnimation {
    constructor(scene, keyframes, height) {
        super(scene, keyframes);
        this.height = height;
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

        this.interpolateKeyframes(current, vec3);

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
            this.currentTranslation[1] = 0;
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
     * Does the interpolation of the transformations 
     * @param current the time since the start of the program, in seconds
     */
    interpolateKeyframes(current) {
        // Calculating deltaT
        this.deltaT = current - this.keyframes[this.previousKeyFrame].instant;
        let interpolationTime = this.deltaT / (this.keyframes[this.nextKeyFrame].instant - this.keyframes[this.previousKeyFrame].instant);

        // Curve 
        this.currentTranslation[0] = this.keyframes[this.nextKeyFrame].transf[0][0] * interpolationTime;
        this.currentTranslation[2] = this.keyframes[this.nextKeyFrame].transf[0][2] * interpolationTime;
        //this.currentTranslation[1] = (Math.pow(Math.sin(Math.PI * interpolationTime), this.height) * Math.abs(this.keyframes[this.nextKeyFrame].transf[0][2]));

        this.currentTranslation[1] = Math.sin(Math.PI * interpolationTime) * this.height + Math.abs(this.currentTranslation[0] + this.currentTranslation[2]) / 10;


        // Doing interpolation
        vec3.lerp(this.currentRotationX, this.keyframes[this.previousKeyFrame].transf[ROTX_POS], this.keyframes[this.nextKeyFrame].transf[ROTX_POS], interpolationTime); // RotationX
        vec3.lerp(this.currentRotationY, this.keyframes[this.previousKeyFrame].transf[ROTY_POS], this.keyframes[this.nextKeyFrame].transf[ROTY_POS], interpolationTime); // RotationY
        vec3.lerp(this.currentRotationZ, this.keyframes[this.previousKeyFrame].transf[ROTZ_POS], this.keyframes[this.nextKeyFrame].transf[ROTZ_POS], interpolationTime); // Rotationz
        vec3.lerp(this.currentScale, this.keyframes[this.previousKeyFrame].transf[SCALE_POS], this.keyframes[this.nextKeyFrame].transf[SCALE_POS], interpolationTime); // Scale
    }
}