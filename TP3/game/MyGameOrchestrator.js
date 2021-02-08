const TRANSLATE_6 = 6 / 15.2;
const TRANSLATE_9 = 9 / 21.2;
const TILE_SIZE = 1.23;

class MyGameOrchestrator {

    constructor(scene) {
        this.scene = scene;

        this.currentPlayer = "black";
        this.blackPoints = 0;
        this.whitePoints = 0;

        this.currentTheme = "Simple";
        this.scene.selectedTheme = "Simple";
        this.themesNames = ["Simple", "Room", "Picnic"];
        this.themesFilenames = ["SimpleTheme.xml", "LivingRoom.xml", "Picnic.xml"];
        this.loadThemes();


        this.prologHandler = new MyPrologInterface(this);
        this.gameSequence = new MyGameSequence();

        this.interface3D = new MyInterfaceBoard(scene, this);

        this.currentState = new MenuState(this);
                   
    }

    getAllThemes(){ return this.themesNames;}

    loadThemes() {
        this.themes = new Map();

        for (let i = 0; i < this.themesFilenames.length; i++) {
            let sceneGraph = new MySceneGraph(this.themesFilenames[i], this.scene);
            this.themes.set(this.themesNames[i], sceneGraph);
        }
    }   

    changeCurrentPlayer(){
        if(this.currentPlayer == "white") this.currentPlayer = "black";
        else if(this.currentPlayer == "black") this.currentPlayer = "white";
    }

    getCurrentTheme() {
        return this.themes.get(this.currentTheme);
    }

     /**
     * Get all avaiable themes
     * @return {Array} an array with all themes
     */
    getAllThemes(){ return this.themesNames;}

    /**
     * Sets the current theme to the one in the argument
     * @param {number} idTheme the position in the array of theme names
     */
    setCurrentTheme(idTheme) {
        this.currentTheme = this.themesNames[idTheme];
        this.scene.selectedTheme = this.currentTheme;
    }

    resetTimer(){this.interface3D.resetTimer();}

    changeCurrentPlayer() {
        if (this.currentPlayer == "white") this.currentPlayer = "black";
        else if (this.currentPlayer == "black") this.currentPlayer = "white";
    }

    setBoardSize(boardSize) {
        if (boardSize == 1) this.set6x6Board();
        else if (boardSize == 2) this.set6x9Board()
        else if (boardSize == 3) this.set9x9Board()
        this.initAuxBoards();
        this.gameboard = new MyGameBoard(this.scene, this.nRows, this.nCols);
    }

    set6x6Board() {
        this.boardSize = 1;
        this.nCols = 6;
        this.nRows = 6;
        this.nPlayerPieces = 9;
        this.nGreenPieces = 18;
    }

    set6x9Board() {
        this.boardSize = 2;
        this.nCols = 6;
        this.nRows = 9;
        this.nPlayerPieces = 18;
        this.nGreenPieces = 18;
    }

    set9x9Board() {
        this.boardSize = 3;
        this.nCols = 9;
        this.nRows = 9;
        this.nPlayerPieces = 27;
        this.nGreenPieces = 27;
    }

    initAuxBoards() {
        this.auxGreenBoard = new MyAuxBoard(this.scene, "green", this.nGreenPieces, this.nCols, this.nCols, this.nRows);
        this.auxBlackBoard = new MyAuxBoard(this.scene, "black", this.nPlayerPieces, this.nRows, this.nCols, this.nRows);
        this.auxWhiteBoard = new MyAuxBoard(this.scene, "white", this.nPlayerPieces, this.nRows, this.nCols, this.nRows);
    }

    displayAuxBoards() {
        this.auxWhiteBoard.display();

        this.scene.pushMatrix();
        this.auxBlackBoard.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2.0, 0, 1, 0);
        this.auxGreenBoard.display();
        this.scene.popMatrix();
    }

    resetTimer() {
        this.interface3D.resetTimer();
    }

    getBlackPoints() {
        return this.blackPoints;
    }

    getWhitePoints() {
        return this.whitePoints;
    }

    handleReply(response) {
        this.currentState.handleReply(response);
    }

    getCurrentPlayerType() {
        if (this.currentPlayer == "black") return this.blackType;
        if (this.currentPlayer == "white") return this.whiteType;
    }

    changePlayer() {
        if (this.currentPlayer == "black") this.currentPlayer = "white"
        else this.currentPlayer = "black"
        this.interface3D.setCurrentPlayer(this.currentPlayer)
    }

    setPlayer(player) {
        this.currentPlayer = player;
        this.interface3D.setCurrentPlayer(this.currentPlayer)
    }

    changeTheme(idTheme = -1) {

        this.scene.disableAllLigths();

        if(idTheme !== -1 && typeof idTheme == "number")
            this.currentTheme(idTheme);

        else if(typeof idTheme == "string"){
            this.currentTheme = idTheme;
        }
        
        this.changeBoardsThemes();    

        this.scene.initLights();

        this.scene.setUpNewThemCam();

        this.scene.updateInterface();

        
    }

    changeBoardsThemes() {
        this.auxWhiteBoard.changeTheme(this.scene.getCurrentTheme().gameboardTheme, this.scene.getCurrentTheme().tileTheme, this.scene.getCurrentTheme().piecesTheme);
        this.auxBlackBoard.changeTheme(this.scene.getCurrentTheme().gameboardTheme, this.scene.getCurrentTheme().tileTheme, this.scene.getCurrentTheme().piecesTheme);
        this.auxGreenBoard.changeTheme(this.scene.getCurrentTheme().gameboardTheme, this.scene.getCurrentTheme().tileTheme, this.scene.getCurrentTheme().piecesTheme);
        this.gameboard.changeTheme(this.scene.getCurrentTheme().gameboardTheme, this.scene.getCurrentTheme().tileTheme, this.scene.getCurrentTheme().piecesTheme);
    }

    updateBlackPoints(points) {
        this.blackPoints = points;
        this.interface3D.updateBlackPoints(this.blackPoints);
    }

    updateWhitePoints(points) {
        this.whitePoints = points;
        this.interface3D.updateWhitePoints(this.whitePoints);
    }

    changeState(state) {
        this.currentState = state;
    }

    restartGame() {
        this.currentPlayer = "black";
        this.blackPoints = 0;
        this.whitePoints = 0;

        this.gameboard = undefined;
        this.auxBlackBoard = undefined;
        this.auxWhiteBoard = undefined;
        this.auxGreenBoard = undefined;

        this.prologHandler = new MyPrologInterface(this);
        this.gameSequence = new MyGameSequence();

        this.interface3D = new MyInterfaceBoard(this.scene, this);

        this.changeState(new MenuState(this));
    }

    display() {
        this.scene.pushMatrix();
        this.scene.multMatrix(this.getCurrentTheme().boardTransf);
        
        this.displayInterface();
        this.scene.popMatrix();
        this.currentState.display();
    }

    displayInterface() {
        this.scene.pushMatrix();
        this.scene.translate(-0.7, 0, -0.7);
        this.scene.scale(1.5, 1.5, 1);
        this.interface3D.display();
        this.scene.popMatrix();
    }

    update(time) {
        this.currentState.update(time);
    }

    managePick(mode, results) {
        if (mode == false && this.currentState.checkPickingState()) {
            if (results != null && results.length > 0) {

                for (let i = 0; i < results.length; i++) {
                    let obj = results[i][0];
                    if (obj) {
                        let uniqueId = results[i][1];
                        this.currentState.OnObjectSelected(obj, uniqueId);
                    }
                }
                results.splice(0, results.length);
            }
        }
    }
}