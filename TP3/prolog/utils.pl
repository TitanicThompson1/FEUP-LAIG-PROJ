%get cell content from GameState
getCell(GameState, CellCol, CellRow, Cell):-
        nth0(CellRow, GameState, Row),
        nth0(CellCol, Row, Cell).

%get size of Board
sizeBoard(GameState, NoCol, NoRow):-
        length(GameState, NoRow),
        nth0(0, GameState, Row),
        length(Row, NoCol).

%creates a new cell according to the move
updateCell([SC, SP, SS], [_EC, EP, ES], [NC, NP, NS]):-
        NC = SC,
        NP is (SP + EP),
        NS is (SS + ES).

%updates Cell, makes the StartCell empty, replaces EndCell content with the NewCell content
updateBoardGame(StartCell, StartCol, StartRow, EndCell, EndCol, EndRow, GameState, NewState):-
        updateCell(StartCell, EndCell, NewCell),
        updateBoard(GameState, StartCol, StartRow, [0, 0, 0], AuxState), %remove StartCell
        updateBoard(AuxState, EndCol, EndRow, NewCell, NewState). %add new values to the EndCell

%updates Board, replacing the current cell in the column and row given with the cell provided as an argument
updateBoard(GameState, Col, Row, Cell, NewState):- updateRow(GameState, Col, Row, Cell, NewState).

%when it is in the right row, it updates column; otherwise, updates row
updateRow([H|T], Col, 0, Cell, [NH|T]) :- updateColumn(H, Col, Cell, NH).
updateRow([H|T], Col, Row, Cell, [H|NT]) :-
        Row1 is (Row-1),
        updateRow(T, Col, Row1, Cell, NT).

%when it is in the right column, replace it with the new cell; otherwise, updates column
updateColumn([_H|T], 0, Cell, [Cell|T]).
updateColumn([H|T], Col, Cell, [H|NT]) :- 
        Col1 is (Col-1),
        updateColumn(T, Col1, Cell, NT).

%is Empty, when first element is 0
isEmpty([0, _, _]).

%changes order of sublists in order to change the current player
changePlayer([[Color1, Points1, P1], [Color2, Points2, P2]], Player) :- Player = [[Color2, Points2, P2], [Color1, Points1, P1]].

%update Player points
updatePoints(Player, [X|_], [X|_], Player). %capturing piece of the same color
updatePoints([[Color, Points, P1], Player], _, [1, 1|_], [[Color, NP, P1], Player]):- NP is (Points + 1). %capturing green piece
updatePoints([[Color, Points, P1], [Color1, Points1, P2]], [X|_], [Y, Add|_], [[Color, NP, P1], [Color1, NP1, P2]]):- %capturing enemy piece, update both sublists
            X\=Y, Y\=1,
            NP is (Points + Add),
            NP1 is (Points1 - Add).

%associates an index with a column and row
getColRowbyIndex(Index, Col, Row, MaxCol):-
        Col is (Index mod MaxCol),
        Row is (Index//MaxCol).

%adds a move to a list
addMove([], ListOfMoves, _, _, NewListOfMoves):-
        append(ListOfMoves, [], NewListOfMoves).

addMove(CleanFinal, ListOfMoves, CurrentCol, CurrentRow, NewListOfMoves):-
        append([[CurrentCol, CurrentRow]], CleanFinal, NewMove),
        append(ListOfMoves, [NewMove], NewListOfMoves).

%checks if the cell is not empty in order to find a valid move down; otherwise, updates row to continue searching for a valid move 
checkDownCell(Cell, _, Row, CurrentRow, _, _):-
        isEmpty(Cell),
        Row is (CurrentRow+1).
checkDownCell(_, MaxRow, Row, CurrentRow, CurrentCol, MoveDown):-
        NewMove = [[CurrentCol, CurrentRow]],
        append([], NewMove, MoveDown),
        Row is MaxRow.

%checks if the cell is not empty in order to find a valid move up; otherwise, updates row to continue searching for a valid move
checkUpCell(Cell, Row, CurrentRow, _, _):-
        isEmpty(Cell),
        Row is (CurrentRow-1).
checkUpCell(_, Row, CurrentRow, CurrentCol, MoveUp):-
        NewMove = [[CurrentCol, CurrentRow]],
        append([], NewMove, MoveUp),
        Row is -1.

%checks if the cell is not empty in order to find a valid move left; otherwise, updates row to continue searching for a valid move
checkLeftCell(Cell, Col, CurrentCol, _, _):-
        isEmpty(Cell),
        Col is (CurrentCol-1).
checkLeftCell(_, Col, CurrentCol, CurrentRow, MoveLeft):-
        NewMove = [[CurrentCol, CurrentRow]],
        append([], NewMove, MoveLeft),
        Col is -1.

%checks if the cell is not empty in order to find a valid move right; otherwise, updates row to continue searching for a valid move
checkRightCell(Cell, _, Col, CurrentCol, _, _):-
        isEmpty(Cell),
        Col is (CurrentCol+1).
checkRightCell(_, MaxCol, Col, CurrentCol, CurrentRow, MoveRight):-
        NewMove = [[CurrentCol, CurrentRow]],
        append([], NewMove, MoveRight),
        Col is MaxCol.

%counts points and finds heighest stack of both players
countPointsStack(GameState, BlackPoints, BlackHighestStack, WhitePoints, WhiteHighestStack) :-
        sizeBoard(GameState, MaxCol, MaxRow),
        getPlayerPieces(GameState, 0, _BlackP, BlackPieces, _WhiteP, WhitePieces, MaxCol, MaxRow),
        processPlayerPieces(BlackPieces, 0, 0, BlackPoints, BlackHighestStack),
        processPlayerPieces(WhitePieces, 0, 0, WhitePoints, WhiteHighestStack).       

%finds all white and black cells to make future calculations easier     
getPlayerPieces(_, Index, BlackP, BlackPieces, WhiteP, WhitePieces, MaxCol, MaxRow) :-
        Index is (MaxCol*MaxRow),
        deleteEmptyList(BlackP, Black),
        BlackPieces = Black,
        deleteEmptyList(WhiteP, White),
        WhitePieces = White.

getPlayerPieces(GameState, Index, BlackP, BlackPieces, WhiteP, WhitePieces, MaxCol, MaxRow) :-
        getColRowbyIndex(Index, CurrentCol, CurrentRow, MaxCol),
        getCell(GameState, CurrentCol, CurrentRow, Cell),
        processCell(Cell, BP, WP),
        append(BlackP, [BP], Black),
        append(WhiteP, [WP], White),
        NextIndex is (Index+1),
        getPlayerPieces(GameState, NextIndex, Black, BlackPieces, White, WhitePieces, MaxCol, MaxRow). 


%deletes and empty sublist from a list
deleteOne(X, L, L1):- append(La, [X|Lb], L), append(La, Lb, L1). 

%deletes all empty sublists from a list
deleteEmptyList(L1, L2) :- L2 = L1, \+member([], L1).
deleteEmptyList(L1, L2) :- 
        deleteOne([], L1, L),
        deleteEmptyList(L, L2). 

%processes cell by placing it in the respective type
processCell(Cell, BlackP, WhiteP):- Cell = [2|_], BlackP = Cell, WhiteP = [].
processCell(Cell, BlackP, WhiteP):- Cell = [3|_], WhiteP = Cell, BlackP = [].
processCell(_, [], []).

%given a list, adds the points of all pieces and saves the value of the highest stack
processPlayerPieces([], 0, 0, 0, 0).
processPlayerPieces([], P, S, Points, Stack):- Points = P, Stack = S.
processPlayerPieces([H|T], P, S, Points, Stack):-
        H = [_, CP, CS],
        FinalPoints is (P + CP),
        compareStack(S, CS, FinalStack),
        processPlayerPieces(T, FinalPoints, FinalStack, Points, Stack).

%stores the highest stack value in FinalStack; if the two stacks have the same value, so FinalStack is that value
compareStack(HighestStack, Stack, FinalStack):- Stack > HighestStack, FinalStack = Stack.
compareStack(HighestStack, _, HighestStack).

%according to the selected option, calls the generateBoard with the respective quantities of columns, rows and different pieces
initBoard(GameState, 1):- generateBoard(GameState, 9, 9, 18, 6, 6, []).   % size: 6x6
initBoard(GameState, 2):- generateBoard(GameState, 18, 18, 18, 6, 9, []). % size: 6x9
initBoard(GameState, 3):- generateBoard(GameState, 27, 27, 27, 9, 9, []). % size: 9x9

%generates a random board with the given size and quantities of black, white and green pieces
generateBoard(GameState, 0, 0, 0, _, 0, Board):- GameState = Board.
generateBoard(GameState, BlackP, WhiteP, GreenP, NoCols, NoRows, Board):-
        Col=NoCols,
        generateRow(BP, WP, GP, BlackP, WhiteP, GreenP, Col, [], FinalRow),
        append(Board, FinalRow, Row),
        NoRow is (NoRows-1),
        generateBoard(GameState, BP, WP, GP, NoCols, NoRow, Row).

%generates a random row with the given size
generateRow(BlackP, WhiteP, GreenP, BlackP, WhiteP, GreenP, 0, Row, FinalRow):- FinalRow = [Row].
generateRow(BlackP, WhiteP, GreenP, BP, WP, GP, NoCols, Row, FinalRow):-
        random(0, 3, Piece),
        generateCell(Piece, BP, WP, GP, NBP, NWP, NGP, Cell),
        append(Row, [Cell], NewRow),
        Col is (NoCols-1),
        generateRow(BlackP, WhiteP, GreenP, NBP, NWP, NGP, Col, NewRow, FinalRow).

%generates a cell according to a random number (0 -> green piece, 1 -> black piece)
generateCell(0, BlackP, WhiteP, GreenP, BP, WP, GP, Cell):- generateGreenPiece(BlackP, WhiteP, GreenP, BP, WP, GP, Cell). 
generateCell(1, BlackP, WhiteP, GreenP, BP, WP, GP, Cell):- generateBlackPiece(BlackP, WhiteP, GreenP, BP, WP, GP, Cell).
generateCell(2, BlackP, WhiteP, GreenP, BP, WP, GP, Cell):- generateWhitePiece(BlackP, WhiteP, GreenP, BP, WP, GP, Cell).

%generates a green piece making sure that there still are available green cells; otherwise, generates a random number and generateCell is called again
generateGreenPiece(BlackP, WhiteP, 0, BP, WP, GP, Cell):-
        random(0, 3, Piece),
        generateCell(Piece, BlackP, WhiteP, 0, BP, WP, GP, Cell).
generateGreenPiece(BlackP, WhiteP, GreenP, BP, WP, GP, Cell):-
        Cell = [1, 1, 1],
        BP = BlackP,
        WP = WhiteP,
        GP is (GreenP-1).

%generates a black piece making sure that there still are available black cells; otherwise, generates a random number and generateCell is called again
generateBlackPiece(0, WhiteP, GreenP, BP, WP, GP, Cell):-
        random(0, 3, Piece),
        generateCell(Piece, 0, WhiteP, GreenP, BP, WP, GP, Cell).
generateBlackPiece(BlackP, WhiteP, GreenP, BP, WP, GP, Cell):-
        Cell = [2, 0, 1],
        WP = WhiteP,
        GP = GreenP,
        BP is (BlackP-1).

%generates a white piece making sure that there still are available white cells; otherwise, generates a random number and generateCell is called again
generateWhitePiece(BlackP, 0, GreenP, BP, WP, GP, Cell):-
        random(0, 3, Piece),
        generateCell(Piece, BlackP, 0, GreenP, BP, WP, GP, Cell).
generateWhitePiece(BlackP, WhiteP, GreenP, BP, WP, GP, Cell):-
        Cell = [3, 0, 1],
        BP = BlackP,
        GP = GreenP,
        WP is (WhiteP-1).