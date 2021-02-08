
/**
 * CamAnimKF
 * @constructor
 * @param scene the scene
 * @param camera the camera that is going to suffer the animation
 * @param previousPosition the previous position of the camera
 * @param nextPosition the next position of the camera
 * @param previousTarget the previous target of the camera
 * @param nextTarget the next target of the camera
 * 
 */
class CamAnimKF {
    constructor(scene, camera, previousPosition, nextPosition, previousTarget, nextTarget) {
        this.scene = scene;

        this.previousTarget = vec3.fromValues(...previousTarget);
        this.nextTarget = vec3.fromValues(...nextTarget);

        this.previousPosition = vec3.fromValues(...previousPosition);
        this.nextPosition = vec3.fromValues(...nextPosition);

        this.movPos = vec3.create();

        this.endTime = vec3.distance(this.nextPosition, this.previousPosition) / 3;

        this.camera = camera;

        this.firstTime = -1;
        this.finished = false;

        this.initiateVectors();
    }

    /**
     * Initiates the vectors and the state
     */
    initiateVectors() {
        this.currentPosition = vec3.create();
        this.currentTarget = vec3.create();
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

        this.interpolateKeyframes(current);
    }

    reset() {
        this.camera.setPosition(this.previousPosition);
        this.camera.setTarget(this.previousTarget);
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
            this.currentPosition = this.nextPosition;
            this.currentTarget = this.nextTarget;

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

        let interpolationTime = current / this.endTime;

        // Doing interpolation
        vec3.lerp(this.currentPosition, this.previousPosition, this.nextPosition, interpolationTime);
        vec3.lerp(this.currentTarget, this.previousTarget, this.nextTarget, interpolationTime);
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
        this.camera.setPosition(this.currentPosition);
        this.camera.setTarget(this.currentTarget);
    }
}