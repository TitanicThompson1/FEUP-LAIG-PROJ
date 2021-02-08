const TIMER_STATE = {
    Running: 0,
    Ended: 1
};

/**
 * MyTimer
 * @constructor Saves the arguments passed and initializes shape and auxiliary variables
 * @param {CGFscene} scene the scene
 * @param {number} initialTime the initial time of the timer, in seconds. 
 */
class MyTimer {
    constructor(scene, initialTime) {
        this.scene = scene;
        this.initialTime = initialTime;
        this.timeRemaining = initialTime;

        // Shape of the timer
        this.geometry = new MySpriteText(scene, this.formatTime(this.timeRemaining));

        this.firstTime = -1;
        this.ended = false;
    }

    /**
     * Updates the remaining time on the timer. 
     * @param {number} currentTime the current time 
     * @return {number} TIMER_STATE.Ended if the timer has ended. TIMER_STATE.Running otherwise
     */
    update(currentTime) {
        if (this.ended) return;

        if (this.firstTime == -1) {
            this.firstTime = currentTime;
            return;
        }

        let timePassed = Math.floor((currentTime - this.firstTime) / 1000); // Converting to seconds

        this.timeRemaining = this.initialTime - timePassed;

        if(this.checkIfEnded() == TIMER_STATE.Ended) return TIMER_STATE.Ended;
        
        // Updating the time on the timer
        this.geometry.setText(this.formatTime(this.timeRemaining))

        return TIMER_STATE.Running;
    }

    /**
     * Checks if the timer has ended.
     * @return {number} TIMER_STATE.Ended if the timer has ended. TIMER_STATE.Running otherwise
     */
    checkIfEnded() {

        if (this.timeRemaining < 0) {
            this.timeRemaining = 0;
            this.ended = true;
            return TIMER_STATE.Ended;
        }
        return TIMER_STATE.Running;
    }

    /**
     * Displays the timer
     */
    display() {
        this.geometry.display();
    }

    /**
     * Resets the timer to its initial time
     */
    reset() {
        this.timeRemaining = this.initialTime;
        this.firstTime = -1;
        this.ended = false;
    }

    /**
     * Formats the time for the timer
     * @param {number} time
     * @return {string} The formatted time
     */
    formatTime(time) {
        let formattedTime = "";

        if (time < 60) {
            formattedTime += "00:";
        } else {
            let minutes = Math.floor(time / 60);
            if (minutes < 10) formattedTime += "0";
            formattedTime += minutes.toString() + ":";
        }

        let seconds = time % 60;
        if (seconds < 10) formattedTime += "0";
        formattedTime += seconds.toString();

        return formattedTime;
    }
}