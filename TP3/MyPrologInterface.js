class MyPrologInterface {
    constructor(gameOrchestrator) {
        this.gameOrchestrator = gameOrchestrator;
        this.scene = this.gameOrchestrator.scene;
    }

    getPrologRequest(requestString, onSuccess, onError, port) {
        var requestPort = port || 8081
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        request.onload = onSuccess || function (data) {
            console.log("Request successful. Reply: " + data.target.response);
        };
        request.onerror = onError || function () {
            console.log("Error waiting for response");
        };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    /**
     * Handles server's response
     * @param {*} data 
     */
    handleReply(data) {
        let response = data.target.response;
        this.gameOrchestrator.handleReply(JSON.parse(response));
    }

    /**
     * Requests random board with a given size
     * @param {number} boardSize 
     */
    requestInitBoard(boardSize) {
        this.getPrologRequest("startGame(" + boardSize + ")", (data) => {
            this.handleReply.call(this, data)
        });
    }

    /**
     * Gets valid moves for the selected tile
     * @param {Array} board 
     * @param {number} col 
     * @param {number} row 
     * @param {string} player 
     */
    requestValidateCell(board, col, row, player) {
        let sBoard = this.boardToString(board);
        let p;
        if (player == "black") p = 0;
        else if (player == "white") p = 1;
        this.getPrologRequest("validStartCell(" + sBoard + "," + col + "," + row + "," + p + ")", (data) => {
            this.handleReply.call(this, data)
        });
    }

    /**
     * Requests Computer Move
     * @param {Array} board 
     * @param {string} currentPlayer 
     * @param {number} blackPoints 
     * @param {number} blackType 
     * @param {number} whitePoints 
     * @param {number} whiteType 
     */
    requestComputerMove(board, currentPlayer, blackPoints, blackType, whitePoints, whiteType) {
        let sBoard = this.boardToString(board);
        let sPlayer = this.playersToString(currentPlayer, blackType, blackPoints, whiteType, whitePoints);
        this.getPrologRequest("getComputerMove(" + sBoard + "," + sPlayer + "," + this.gameOrchestrator.getCurrentPlayerType() + ")", (data) => {
            this.handleReply.call(this, data)
        });
    }

    /**
     * Gets black and white points according to the movement
     * @param {*} startCell 
     * @param {*} endCell 
     * @param {string} currentPlayer 
     * @param {number} blackPoints 
     * @param {number} blackType 
     * @param {number} whitePoints 
     * @param {number} whiteType 
     */
    requestUpdatePoints(startCell, endCell, currentPlayer, blackPoints, blackType, whitePoints, whiteType) {
        let player = this.playersToString(currentPlayer, blackType, blackPoints, whiteType, whitePoints);
        let start = "[" + startCell.join() + "]";
        let end = "[" + endCell.join() + "]";
        this.getPrologRequest("updatePoints(" + start + "," + end + "," + player + ")", (data) => {
            this.handleReply.call(this, data)
        });
    }

    /**
     * Handles server's response
     * @param {*} data 
     */
    handleIntReply(data) {
        let response = data.target.response;
        this.gameOrchestrator.handleReply(parseInt(response));
    }

    /**
     * Asks the server if the game is over
     * @param {Array} board 
     * @param {string} player 
     */
    requestIsGameOver(board, player) {
        let sBoard = this.boardToString(board);
        let p;
        if (player == "black") p = 0;
        else if (player == "white") p = 1;
        this.getPrologRequest("isGameOver(" + sBoard + "," + p + ")", (data) => {
            this.handleIntReply.call(this, data)
        });
    }

    /**
     * Gets all the player's information after game over
     * @param {string} board 
     */
    requestWinner(board) {
        let sBoard = this.boardToString(board);
        this.getPrologRequest("gameOver(" + sBoard + ")", (data) => {
            this.handleReply.call(this, data)
        });
    }

    /**
     * Translates board array to string
     * @param {string} board 
     */
    boardToString(board) {
        let sBoard = "";
        let nCols = this.gameOrchestrator.nCols;
        let nRows = this.gameOrchestrator.nRows;

        for (let i = 0; i < nRows; i++) {
            let row = "[";
            let boardRow = board[i];
            for (let j = 0; j < nCols; j++) {
                let tile = "[" + boardRow[j].join(",") + "]";
                if (j != (nCols - 1)) tile += ","
                row += tile;
            }
            sBoard += row + "],";
        }

        return "[" + sBoard.slice(0, -1) + "]";
    }

    /**
     * Returns player as a string
     * @param {string} currentPlayer 
     * @param {number} typeBlack 
     * @param {number} pointsBlack 
     * @param {number} typeWhite 
     * @param {number} pointsWhite 
     * @return player in a string
     */
    playersToString(currentPlayer, typeBlack, pointsBlack, typeWhite, pointsWhite) {
        if (currentPlayer == "black")
            return ("[[" + 0 + "," + pointsBlack + "," + typeBlack + "],[" + 1 + "," + pointsWhite + "," + typeWhite + "]]");
        if (currentPlayer == "white")
            return ("[[" + 1 + "," + pointsWhite + "," + typeWhite + "],[" + 0 + "," + pointsBlack + "," + typeBlack + "]]");
    }
}