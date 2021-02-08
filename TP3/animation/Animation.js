/**
 * Animation
 * @constructor
 * @param startTime - the start time, in seconds, of the animation
 * @param endTime - the finish time, in seconds, of the animation
 * @param startTransf - the start geometrical transformation of the animation
 * @param endTransf - the final geometrical transformation of the animation
 */
class Animation {
    constructor(startTime, endTime, startTransf, endTransf) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.startTransf = startTransf;
        this.endTransf = endTransf;
    }
}