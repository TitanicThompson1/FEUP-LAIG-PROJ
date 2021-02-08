%translates the first cell list item
code(0, ' ').
code(1, 'G').
code(2, 'B').
code(3, 'W').

%translates the column letter into a number
column('A', 0). column('a', 0).
column('B', 1). column('b', 1).
column('C', 2). column('c', 2).
column('D', 3). column('d', 3).
column('E', 4). column('e', 4).
column('F', 5). column('f', 5).
column('G', 6). column('g', 6).
column('H', 7). column('h', 7).
column('I', 8). column('i', 8).
column(_, -1).

%translates the 
row('1', 0).
row('2', 1).
row('3', 2).
row('4', 3).
row('5', 4).
row('6', 5).
row('7', 6).
row('8', 7).
row('9', 8).
row(_, -1).

option('1', 1).
option('2', 2).
option('3', 3).
option('4', 4).
option(_, -1).

%prints the current game state
display_game(GameState, Player) :- 
        write('====================================================================\n'),
        printPlayersPoints(Player),
        Player = [[Color|_]|_],
        printBoard(GameState, Color).

%prints the row coordinate
printNumber(N):- Number is (N+1), write(Number), write('|').

%prints the cell points
printPoints(0, _Points):- write('     |').
printPoints(Color, Points):- Color\=0, format('~|~`0t~d~2+', Points).

%prints the cell stack height
printStack(0, _Stack).
printStack(Color, Stack):- Color\=0, write('/'), format('~|~`0t~d~2+', Stack), write('|').

%prints the cell color
printCellColor([Color|_]) :-
        write('  '),
        code(Color, Character),
        write(Character),
        write('  |').

%prints the cell Points and Stack Height
printCellPointsStack([Color, Points, Stack]) :-
        printPoints(Color, Points),
        printStack(Color, Stack).

%prints the color of all cells in a row
printLineColor([]).
printLineColor([Cell | Line]):- printCellColor(Cell), printLineColor(Line).

%prints points and stack height of all cells in a row
printLinePointsStack([]).
printLinePointsStack([Cell | Line]):- printCellPointsStack(Cell), printLinePointsStack(Line).

%prints a dashed separator
printSeparator(1, 0):- nl.
printSeparator(1, NoCol):- write('-----|'), Col is (NoCol-1), printSeparator(1, Col).
printSeparator(2, 0).
printSeparator(2, NoCol):- write('     |'), Col is (NoCol-1), printSeparator(2, Col).

%prints the board, line by line
printTab([], NoCol, NoRow, NoRow, _):- write(' |'), printSeparator(1, NoCol).
printTab([Line|B], NoCol, NoRow, CurrentRow, Player):- 
        write(' |'),
        Col=NoCol,
        printSeparator(1, Col),
        write(' |'),
        printLineColor(Line), nl,
        printNumber(CurrentRow),
        Col1=NoCol,
        printSeparator(2, Col1),
        printInfo(CurrentRow, Player), nl,
        write(' |'),
        printLinePointsStack(Line), nl,
        N1 is CurrentRow+1, printTab(B, NoCol, NoRow, N1, Player).

%prints the board and headings
printBoard(X, Player):- sizeBoard(X, NoCol, NoRow), printHeader(NoCol), printTab(X, NoCol, NoRow, 0, Player).

%prints the board columns and cell key 
printHeader(6):-
    write('\n    A     B     C     D     E     F    '),
    write('Cell Format: Color/Points/StackHeight\n').

%prints the board columns and cell key 
printHeader(9):-
    write('\n    A     B     C     D     E     F     G     H     I    '),
    write('Cell Format: Color/Points/StackHeight\n').

%prints the player turn on the forth line
printInfo(4, 0):- write(' It is black\'s turn!').
printInfo(4, 1):- write(' It is white\'s turn!').
printInfo(_N, _Player).

%prints the current points
printPlayersPoints([[0, BlackPoints, _], [1, WhitePoints, _]]):- printBlackPoints(BlackPoints), printWhitePoints(WhitePoints).
printPlayersPoints([[1, WhitePoints, _], [0, BlackPoints, _]]):- printBlackPoints(BlackPoints), printWhitePoints(WhitePoints).

%prints the current black points
printBlackPoints(1):- write('\n\n  Black: 1 point\n').
printBlackPoints(Points):- write('\n  Black: '), write(Points), write(' points\n').

%prints the current white points
printWhitePoints(1):- write('  White: 1 point\n\n').
printWhitePoints(Points):- write('  White: '), write(Points), write(' points\n\n').

%prints winner message
displayGameOver(0):- write('Black is the winner! Congrats!\n').
displayGameOver(1):- write('White is the winner! Congrats!\n').
displayGameOver(2):- write('I\'ts a tie!\n').

%prints points and highest stack of each player
displayPointsStack(BlackPoints, BlackHighestStack, WhitePoints, WhiteHighestStack):-
        write('Black ----> Points = '), write(BlackPoints), write(', Highest Stack: '), write(BlackHighestStack), nl,
        write('White ----> Points = '), write(WhitePoints), write(', Highest Stack: '), write(WhiteHighestStack), nl.

%prints a list of valid moves in a specific format
displayValidMoves(Moves):-
        write('You can move that piece to: '),
        displayValidMove(Moves, 1), nl.

%prints option number and the col and row of the valid move
displayValidMove([], _).
displayValidMove([H|T], N):-
        write(N), write('.'),
        H = [[_, _], [Col, Row]], 
        displayColRow(Col, Row), write('  '),
        NextN is (N+1), displayValidMove(T, NextN).

%prints message with the player and chosen move
displayMovePlayer([[0, _, 0], _], Move):- nl, write('Black plays '), displayMove(Move), nl, nl.
displayMovePlayer([[1, _, 0], _], Move):- nl, write('White plays '), displayMove(Move), nl, nl.
displayMovePlayer(_, Move):- nl, write('Computer plays '), displayMove(Move), nl, nl.

%prints a move represented by starting and ending column and row
displayMove([[Ci, Ri], [Cf, Rf]]):-
        displayColRow(Ci, Ri),
        write(' -> '), displayColRow(Cf, Rf).

%prints column and row
displayColRow(Col, Row):-
        column(CharCol, Col), row(CharRow, Row),
        write(CharCol), write(CharRow).

%prints the first menu
displayMenu:-
        write('===================================================================='), nl,
        write('|                                                                  |'), nl,
        write('|                               MENU                               |'), nl,
        write('|                                                                  |'), nl,
        write('|                     1 - Player vs Player                         |'), nl,
        write('|                     2 - Player vs Computer                       |'), nl,
        write('|                     3 - Computer vs Player                       |'), nl,
        write('|                     4 - Computer vs Computer                     |'), nl,
        write('|                                                                  |'), nl,
        write('===================================================================='), nl,
        write('How do you want to play? Insert the number of the chosen option: ').
        
%prints a menu with the options for the board size
displayBoardSizes:-
        write('===================================================================='), nl,
        write('|                                                                  |'), nl,
        write('|                   What is the size of the board?                 |'), nl,
        write('|                                                                  |'), nl,
        write('|                              1 - 6x6                             |'), nl,
        write('|                              2 - 9x6                             |'), nl,
        write('|                              3 - 9x9                             |'), nl,
        write('|                                                                  |'), nl,
        write('===================================================================='), nl,
        write('Insert the number of the chosen option: ').
        
