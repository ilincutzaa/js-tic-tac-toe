document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const modal = document.getElementById("choiceModal");
    const chooseX = document.getElementById("chooseX");
    const chooseO = document.getElementById("chooseO");
    let cells = board.getElementsByTagName("td");
    let gameOver = false;
    let humanSymbol
    let computerSymbol
    let currentPlayer = "X"
    let firstMove
    let gameBoard =
        [
            "","","", //0,1,2
            "","","", //3,4,5
            "","",""  //6,7,8
        ]

    let winningPatterns =
        [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ]

    function checkWinner(gameBoard, playerSymbol) {
        return (winningPatterns.some(pattern => pattern.every(index => gameBoard[index] === playerSymbol)))
    }

    function determineWinningMove(playerSymbol){
        for(const pattern of winningPatterns){
            let move = null
            let nrOfFriendlyCells = 0
            for(const cellIdx of pattern){
                if(gameBoard[cellIdx] === playerSymbol){
                    nrOfFriendlyCells++;
                }
                else
                    if(gameBoard[cellIdx] === "")
                        move = cellIdx;
            }
            if(nrOfFriendlyCells === 2 && move !== null)
                return move
        }
        return null;
    }

    function determineSmartMove(playerSymbol){
        for(const pattern of winningPatterns){
            let move = null
            let nrOfFriendlyCells = 0
            let nrOfEmptyCells = 0
            for(const cellIdx of pattern){
                if(gameBoard[cellIdx] === playerSymbol){
                    nrOfFriendlyCells++;
                }
                else
                if(gameBoard[cellIdx] === ""){
                    move = cellIdx;
                    nrOfEmptyCells++;
                }
            }
            if(nrOfFriendlyCells + nrOfEmptyCells === 3)
                return move
        }
        return null;
    }

    function endGame(message){
        gameOver = true;
        board.style.cursor = "default";
        setTimeout(() => alert(message), 100);
    }

    function computerMoveSmart() {
        let emptyCells = gameBoard
            .map((value, index) => value === "" ? index : null)
            .filter(value => value !== null);
        if (emptyCells.length > 0) {
            let chosenCell = determineWinningMove(computerSymbol);
            if(chosenCell === null)
                chosenCell = determineWinningMove(humanSymbol);
            if(chosenCell === null)
                chosenCell = determineSmartMove(computerSymbol);
            if(chosenCell === null)
                chosenCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]

            gameBoard[chosenCell] = computerSymbol;
            cells[chosenCell].textContent = computerSymbol;

            if (checkWinner(gameBoard, computerSymbol))
                endGame("Computer won!");
        }
    }

    function checkDraw(){
        let emptyCells = gameBoard
            .map((value, index) => value === "" ? index : null)
            .filter(value => value !== null);
        if (emptyCells.length === 0)
            endGame("Draw!");
    }


    chooseX.addEventListener("click", () => {
        humanSymbol = "X";
        computerSymbol = "O";
        firstMove = "human"
        humanFirstMove();
    });

    chooseO.addEventListener("click", () => {
        humanSymbol = "O";
        computerSymbol = "X";
        firstMove = "computer"
        computerFirstMove();
    });

    function playGame(){
        modal.style.display = "none";
        board.style.cursor = "pointer";

        for (let i = 0; i < cells.length; i++) {
            cells[i].addEventListener("click", function () {
                if (!gameOver && cells[i].textContent === "" && currentPlayer === humanSymbol) {
                    cells[i].textContent = humanSymbol;
                    gameBoard[i] = humanSymbol;

                    if (checkWinner(gameBoard, humanSymbol)) {
                        endGame("You won!");
                        return;
                    }

                    if(firstMove === "human")
                        checkDraw();

                    currentPlayer = computerSymbol;
                    setTimeout(() => {
                        computerMoveSmart();
                        if(firstMove === "computer")
                            checkDraw();
                        currentPlayer = humanSymbol;
                    }, 500);

                }
            });
        }
    }

    function humanFirstMove(){
        playGame();
    }

    function computerFirstMove(){
        setTimeout(() => {
            cells[4].textContent = computerSymbol;
            gameBoard[4] = computerSymbol;
            currentPlayer = humanSymbol;
        }, 50);

        playGame();
    }

});
