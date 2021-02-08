/**
 * Game State
 * @param {MyGameOrchestrator} gameOrchestrator reference of game orchestrator
 */
class GameState {

    constructor(gameOrchestrator) {
        this.gameOrchestrator = gameOrchestrator;
    }

    /**
     * Handles the picking by user and consequences
     * @param {Object} object the object clicked
     * @param {number} id the id of the object clicked
     */
    OnObjectSelected(object, id) {}

    /**
     * Check if the user can pick objects in this state
     * @return True, if the user can pick objects. False otherwise
     */
    checkPickingState() {}

    /**
     * Updates active animations
     * @param {number} current time
     */
    update(time) {}

    /**
     * Displays current state
     */
    display() {}

    /**
     * Handles the server's response
     * @param {*} response 
     */
    handleReply(response) {}
}