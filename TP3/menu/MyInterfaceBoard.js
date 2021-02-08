// Menu identifiers
const MENUS = {
    MainMenu: 1,
    LevelMenu: 2,
    InGameMenu: 3,
    GameOverMenu: 4
};
const ACTIONS_IB = {
    None: 0,
    GoToGame: 1,
    Undo: 2,
    LostTurn: 3,
    Restart: 4,
    Movie: 5
};

/**
 * MyInterfaceBoard
 * @constructor 
 * @param {CGFscene} scene the scene
 * @param {MyGameOrchestrator} gameOrchestrator reference of game orchestrator
 * 
 */
class MyInterfaceBoard {
    constructor(scene, gameOrchestrator) {
        this.scene = scene;
        this.gameOrchestrator = gameOrchestrator;

        this.createBoard();

        this.createMenus();
    }

    /**
     * Creates all the menus needed for the game
     */
    createMenus() {
        this.mainMenu = this.createMainMenu();
        this.levelMenu = this.createLevelMenu();
        this.inGameMenu = this.createInGameMenu();
        this.gameOverMenu = this.createGOMenu();
        this.currentMenu = MENUS.MainMenu;
    }

    /**
     * Creates the interface Board
     */
    createBoard() {
        this.board = new MyCube(this.scene, "resources/boardText.PNG");
    }

    /**
     * Creates all the elements of Main Menu inside an array and returns it
     * @return {Array}  The Main Menu
     */
    createMainMenu() {
        let mainMenu = [];
        mainMenu["Title"] = new MySpriteText(this.scene, "Welcome to Greener!");

        mainMenu["BoardSizes"] = new MyOptionSection(this.scene, ["6x6", "6x9", "9x9"], [1, 2]);
        mainMenu["Themes"] = new MyOptionSection(this.scene, this.gameOrchestrator.getAllThemes(), [3, 4]);

        mainMenu["Next"] = new MyButton(this.scene, "resources/NextBttnText.PNG", 5);

        return mainMenu;
    }

    /**
     * Creates all the elements of Level Menu inside an array and returns it
     * @return {Array}  The Level Menu
     */
    createLevelMenu() {
        let inGameMenu = [];
        inGameMenu["Title"] = new MySpriteText(this.scene, "Choose the players");

        inGameMenu["LabelPB"] = new MySpriteText(this.scene, "Black Player");
        inGameMenu["PB"] = new MyOptionSection(this.scene, ["Human", "Normal", "Hard"], [1, 2]);

        inGameMenu["LabelPW"] = new MySpriteText(this.scene, "White Player");
        inGameMenu["PW"] = new MyOptionSection(this.scene, ["Human", "Normal", "Hard"], [3, 4]);

        inGameMenu["MainMenu"] = new MyButton(this.scene, "resources/mmBttnText.PNG", 5);
        inGameMenu["Play"] = new MyButton(this.scene, "resources/playBttnText.PNG", 6);

        return inGameMenu;
    }

    /**
     * Creates all the elements of InGame Menu inside an array and returns it
     * @return {Array}  The InGame Menu
     */
    createInGameMenu() {
        let inGameMn = [];

        inGameMn["Timer"] = new MyTimer(this.scene, 20);
        inGameMn["Undo"] = new MyButton(this.scene, "resources/undoText.png", 100); // its this high to not collide with the ids of the pieces

        inGameMn["LabelScorePB"] = new MySpriteText(this.scene, "Black Points");
        inGameMn["ScorePB"] = new MySpriteText(this.scene, "0");

        inGameMn["LabelScorePW"] = new MySpriteText(this.scene, "White Points");
        inGameMn["ScorePW"] = new MySpriteText(this.scene, "0");

        inGameMn["Player"] = new MySpriteText(this.scene, "Black is playing!");

        return inGameMn;
    }

    /**
     * Creates all the elements of GameOver Menu inside an array and returns it
     * @return {Array}  The GameOver Menu
     */
    createGOMenu() {
        let gameOverMenu = [];

        gameOverMenu["Restart"] = new MyButton(this.scene, "resources/restartText.PNG", 101);
        gameOverMenu["Movie"] = new MyButton(this.scene, "resources/movieText.PNG", 102);
        gameOverMenu["BlackInfo"] = new MySpriteText(this.scene, " ");
        gameOverMenu["WhiteInfo"] = new MySpriteText(this.scene, " ");
        gameOverMenu["Winner"] = new MySpriteText(this.scene, " ");

        return gameOverMenu;
    }

    setWinnerGOMenu(winner, blackPoints, blackHighestStack, whitePoints, whiteHighestStack) {
        this.gameOverMenu["BlackInfo"].setText("Black: " + ('0' + blackPoints).slice(-2) + " points " + ('0' + blackHighestStack).slice(-2) + " highest stack")
        this.gameOverMenu["WhiteInfo"].setText("White: " + ('0' + whitePoints).slice(-2) + " points " + ('0' + whiteHighestStack).slice(-2) + " highest stack")

        if (winner == 0) this.gameOverMenu["Winner"].setText("Black is the winner!");
        else if (winner == 1) this.gameOverMenu["Winner"].setText("White is the winner!");
        else if (winner == 2) this.gameOverMenu["Winner"].setText("Tied Game! Play again!");
    }

    /**
     * Resets the timer to its original time
     */
    resetTimer() {
        this.inGameMenu["Timer"].reset();
    }

    /**
     * Returns the selected board size 
     * @return {number}  id of selected board size
     */
    getBoardSize() {
        return this.mainMenu["BoardSizes"].getSelectedId() + 1;
    }

    /**
     * Returns the type of black player
     * @return {number}  id of selected type for white player
     */
    getPBlack() {
        return this.levelMenu["PB"].getSelectedId();
    }

    /**
     * Returns the type of the white player
     * @return {number}  id of selected type for white player
     */
    getPWhite() {
        return this.levelMenu["PW"].getSelectedId();
    }


    getTheme(){return this.mainMenu["Themes"].getSelectedId();}


    /**
     * Updates the total points of black player in the board
     * @param {number} points black player current points
     */
    updateBlackPoints(points) {
        this.inGameMenu["ScorePB"].setText(points.toString());
    }

    /**
     * Updates the total points of white player in the board
     * @param {number} points white player current points
     */
    updateWhitePoints(points) {
        this.inGameMenu["ScorePW"].setText(points.toString());
    }

    /**
     * Sets the current player in the board
     * @param {string} current player
     */
    setCurrentPlayer(player) {
        if (player == "black") this.inGameMenu["Player"].setText("Black is playing!");
        else if (player == "white") this.inGameMenu["Player"].setText("White is playing!");
    }

    /**
     * Sets the new menu to be displayed
     * @param {number} idMenu id of the new menu
     */
    setCurrentMenu(idMenu) {
        this.currentMenu = idMenu;
    }

    /**
     * Check what element was clicked of which menu, and does the appropriate action
     * @param {number} id the id of the element clicked
     * @return {number} the action needed to be done after the calling of this function
     */
    clicked(id) {
        switch (id) {
            case 1:
                if (this.isCurrentMenu(MENUS.MainMenu)) this.mainMenu["BoardSizes"].previousOption();
                if (this.isCurrentMenu(MENUS.LevelMenu)) this.levelMenu["PB"].previousOption();
                break;

            case 2:
                if (this.isCurrentMenu(MENUS.MainMenu)) this.mainMenu["BoardSizes"].nextOption();
                if (this.isCurrentMenu(MENUS.LevelMenu)) this.levelMenu["PB"].nextOption();
                break;

            case 3:
                if (this.isCurrentMenu(MENUS.MainMenu)) this.mainMenu["Themes"].previousOption();
                if (this.isCurrentMenu(MENUS.LevelMenu)) this.levelMenu["PW"].previousOption();
                break;

            case 4:
                if (this.isCurrentMenu(MENUS.MainMenu)) this.mainMenu["Themes"].nextOption();
                if (this.isCurrentMenu(MENUS.LevelMenu)) this.levelMenu["PW"].nextOption();
                break;

            case 5:
                if (this.isCurrentMenu(MENUS.MainMenu)) this.currentMenu = MENUS.LevelMenu;
                else if (this.isCurrentMenu(MENUS.LevelMenu)) this.currentMenu = MENUS.MainMenu;
                break;

            case 6:
                if (this.isCurrentMenu(MENUS.LevelMenu)) this.currentMenu = MENUS.InGameMenu;
                return ACTIONS_IB.GoToGame;

            case 100:
                return ACTIONS_IB.Undo;

            case 101:
                return ACTIONS_IB.Restart;

            case 102:
                return ACTIONS_IB.Movie;

            default:
                break;
        }
        return ACTIONS_IB.None;
    }

    /**
     * Displays the interface board and its elements
     */
    display() {
        this.scene.pushMatrix();
        
        this.scene.translate(-0.5, 0, 0);
        
        this.displayBoard();
        this.displayCurrentMenu();

        this.scene.popMatrix();
    }


    displayCurrentMenu() {
        switch (this.currentMenu) {
            case MENUS.MainMenu:
                this.displayMainMn();
                break;
            case MENUS.LevelMenu:
                this.displayLevelMn();
                break;
            case MENUS.InGameMenu:
                this.displayInGameMn();
                break;
            case MENUS.GameOverMenu:
                this.displayGOMn();
                break;
            default:
                break;
        }
    }


    displayBoard() {
        this.scene.pushMatrix();

        this.scene.scale(4, 2, 0.5);
        this.board.display();

        this.scene.popMatrix();
    }

    displayMainMn() {
        this.displayM1Title();

        this.displayBoardSize();

        this.displayThemes();

        this.displayNextBttn();
    }

    displayM1Title() {
        this.scene.pushMatrix();

        this.scene.translate(0.6, 1.5, 0.05);
        this.scene.scale(0.3, 0.6, 1);
        this.mainMenu["Title"].display();

        this.scene.popMatrix();
    }

    displayBoardSize() {
        this.scene.pushMatrix();

        this.scene.translate(1.3, 1, 0.05);
        this.scene.scale(0.4, 0.6, 1);
        this.mainMenu["BoardSizes"].display();

        this.scene.popMatrix();
    }

    displayThemes() {
        this.scene.pushMatrix();

        this.scene.translate(1, 0.6, 0.05);
        this.scene.scale(0.4, 0.6, 1);
        this.mainMenu["Themes"].display();

        this.scene.popMatrix();
    }

    displayNextBttn() {
        this.scene.pushMatrix();

        this.scene.translate(1.8, 0.2, 0.05);
        this.scene.scale(1, 0.4, 1);
        this.mainMenu["Next"].display();

        this.scene.popMatrix();
    }

    displayLevelMn() {

        this.displayM2Title();

        this.displayPlayerBlack();

        this.displayPlayerWhite();

        this.displayM2Bttns();
    }

    displayM2Title() {
        this.scene.pushMatrix();

        this.scene.translate(0.6, 1.5, 0.05);
        this.scene.scale(0.3, 0.6, 1);
        this.levelMenu["Title"].display();

        this.scene.popMatrix();
    }

    displayPlayerBlack() {

        // Displaying the label of black player
        this.scene.pushMatrix();

        this.scene.translate(0.6, 1.1, 0.05);
        this.scene.scale(0.2, 0.4, 1);
        this.levelMenu["LabelPB"].display();

        this.scene.popMatrix();

        // Displaying the current option of player black
        this.scene.pushMatrix();

        this.scene.translate(0.55, 0.8, 0.05);
        this.scene.scale(0.2, 0.4, 1);
        this.levelMenu["PB"].display();

        this.scene.popMatrix();
    }

    displayPlayerWhite() {

        // Displaying the label of white player
        this.scene.pushMatrix();

        this.scene.translate(2.6, 1.1, 0.05);
        this.scene.scale(0.2, 0.4, 1);
        this.levelMenu["LabelPW"].display();

        this.scene.popMatrix();

        // Displaying the current option of player black
        this.scene.pushMatrix();

        this.scene.translate(2.55, 0.8, 0.05);
        this.scene.scale(0.2, 0.4, 1);
        this.levelMenu["PW"].display();

        this.scene.popMatrix();
    }

    displayM2Bttns() {

        // Main Menu Button
        this.scene.pushMatrix();

        this.scene.translate(1.3, 0.1, 0.05);
        this.scene.scale(1, 0.4, 1);
        this.levelMenu["MainMenu"].display();

        this.scene.popMatrix();

        // Play Button
        this.scene.pushMatrix();

        this.scene.translate(2.3, 0.1, 0.05);
        this.scene.scale(1, 0.4, 1);
        this.levelMenu["Play"].display();

        this.scene.popMatrix();
    }

    displayInGameMn() {

        this.displayTimer();

        this.displayUndo();

        this.displayScoreBlack();

        this.dipslayScoreWhite();

        this.displayCurrentPlayer();
    }

    displayCurrentPlayer() {
        this.scene.pushMatrix();

        this.scene.translate(1.4, 0.3, 0.05);
        this.scene.scale(0.25, 0.4, 1);
        this.inGameMenu["Player"].display();

        this.scene.popMatrix();
    }

    displayTimer() {
        this.scene.pushMatrix();

        this.scene.translate(0.3, 1.4, 0.05);
        this.scene.scale(0.3, 0.5, 1);
        this.inGameMenu["Timer"].display();

        this.scene.popMatrix();
    }

    displayUndo() {
        this.scene.pushMatrix();

        this.scene.translate(0.3, 0.5, 0.05);
        this.scene.scale(1.4, 1, 1);
        this.inGameMenu["Undo"].display();

        this.scene.popMatrix();
    }

    displayScoreBlack() {

        // Label for black player score
        this.scene.pushMatrix();

        this.scene.translate(1.8, 1.5, 0.05);
        this.scene.scale(0.2, 0.3, 1);
        this.inGameMenu["LabelScorePB"].display();

        this.scene.popMatrix();

        // Black player current score
        this.scene.pushMatrix();

        this.scene.translate(1.8, 1.3, 0.05);
        this.scene.scale(0.3, 0.3, 1);
        this.inGameMenu["ScorePB"].display();

        this.scene.popMatrix();
    }

    dipslayScoreWhite() {

        // Label for white player score
        this.scene.pushMatrix();

        this.scene.translate(1.8, 1, 0.05);
        this.scene.scale(0.2, 0.3, 1);
        this.inGameMenu["LabelScorePW"].display();

        this.scene.popMatrix();

        // White player current score
        this.scene.pushMatrix();

        this.scene.translate(1.8, 0.8, 0.05);
        this.scene.scale(0.3, 0.3, 1);
        this.inGameMenu["ScorePW"].display();

        this.scene.popMatrix();
    }

    displayGOMn() {

        // Restart Button
        this.scene.pushMatrix();

        this.scene.translate(0.9, 1.2, 0.01);
        this.scene.scale(1.6, 1, 1);
        this.gameOverMenu["Restart"].display();

        this.scene.popMatrix();

        // Movie Button
        this.scene.pushMatrix();

        this.scene.translate(2.3, 1.2, 0.01);
        this.scene.scale(1.4, 1, 1);
        this.gameOverMenu["Movie"].display();

        this.scene.popMatrix();

        // Black Info
        this.scene.pushMatrix();

        this.scene.translate(0.1, 0.8, 0.01);
        this.scene.scale(0.23, 0.3, 1);
        this.gameOverMenu["BlackInfo"].display();

        this.scene.popMatrix();

        // White Info
        this.scene.pushMatrix();

        this.scene.translate(0.1, 0.6, 0.01);
        this.scene.scale(0.23, 0.3, 1);
        this.gameOverMenu["WhiteInfo"].display();

        this.scene.popMatrix();

        // Winner
        this.scene.pushMatrix();

        this.scene.translate(0.4, 0.1, 0.01);
        this.scene.scale(0.3, 0.4, 1);
        this.gameOverMenu["Winner"].display();

        this.scene.popMatrix();
    }

    /**
     * Updates the timer if current menu is the InGame one. If the timer ended, returns the LostTurn action
     * @param {number} time current time
     * @return {number} LostTurn if timer ended. None action otherwise
     */
    update(time) {
        if (this.isCurrentMenu(MENUS.InGameMenu) && this.isTimerFinished(time))
            return ACTIONS_IB.LostTurn;

        return ACTIONS_IB.None;
    }

    /**
     * Verifies if timer has finished
     * @param {number} time current time
     * @return {Boolean} true if time ended. False otherwise  
     */
    isTimerFinished(time) {
        return this.inGameMenu["Timer"].update(time) == TIMER_STATE.Ended;
    }

    /**
     * Verifies if menu is the current menu
     * @param {number} menu 
     * @return {Boolean} True if menu is the current menu. False otherwise.
     */
    isCurrentMenu(menu) {
        return this.currentMenu == menu;
    }
}