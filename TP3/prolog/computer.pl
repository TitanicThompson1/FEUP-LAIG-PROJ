%returns a random valid move 
choose_move(GameState, Player, 1, Move):-
        Player = [[Color|_]|_],
        valid_moves(GameState, Color, ListOfMoves),
        length(ListOfMoves, Len),
        random(0, Len, MoveNumber),
        nth0(MoveNumber, ListOfMoves, Move).

%returns the best move in the current state
choose_move(GameState, Player, 2, Move):-
        value(GameState, Player, Move).

%gets all the available moves and chooses the best one
value(GameState, Player, Value):-
        Player = [[Color|_]|_],
        valid_moves(GameState, Color, ListOfMoves),
        bestMove(GameState, Player, ListOfMoves, [], Value, [-1, -2], _).

%gets the best move from the list of available moves 
bestMove(_, _, [], Move, FinalMove, Value, FinalValue):- FinalValue = Value, FinalMove = Move.
bestMove(GameState, Player, [H | T], Move, FinalMove, Value, FinalValue):-
        evaluateMove(GameState, Player, H, MoveValue),
        compareValue(MoveValue, Value, H, Move, CurrentMove, CurrentValue),
        bestMove(GameState, Player, T, CurrentMove, FinalMove, CurrentValue, FinalValue).

%evaluates each move
evaluateMove(GameState, [[_, P1Points, _], [_, P2Points, _]], Move, MoveValue):-
        Move = [[Ci, Ri], [Cf, Rf]],
        getCell(GameState, Ci, Ri, StartCell),
        getCell(GameState, Cf, Rf, EndCell),
        updatePoints([[_, P1Points, _], [_, P2Points, _]], StartCell, EndCell, [[_, NewP1Points, _], [_, NewP2Points, _]]),
        P1PointDiff is (NewP1Points-P1Points),
        P2PointDiff is (NewP2Points-P2Points),
        calculateValue(P1PointDiff, P2PointDiff, StartCell, EndCell, MoveValue).

%calculates the value of a move
calculateValue(0, 0, [X | _], [X | _], [0, -1]).
calculateValue(0, 0, _, _, [0, 1]).
calculateValue(1, 0, _, _, [1, 0]).
calculateValue(V, _, _, _, [V, 1]).

%compares the values ​​of the current move and the best current move at the moment
compareValue([Vi, Ei], [Cv, _], Move, _, FinalMove, FinalValue):-
        Vi > Cv,
        FinalMove = Move,
        FinalValue = [Vi, Ei].

compareValue([Vi, _], [Cv, Ce], _, CurrentMove, FinalMove, FinalValue):-
        Vi < Cv,
        FinalMove = CurrentMove,
        FinalValue = [Cv, Ce].

compareValue([Vi, Ei], [_, Ce], Move, _, FinalMove, FinalValue):-
        Ei > Ce,
        FinalMove = Move,
        FinalValue = [Vi, Ei].

compareValue([Vi, Ei], [Cv, Ce], Move, CurrentMove, FinalMove, FinalValue):-
        randomChange([Vi, Ei], [Cv, Ce], Move, CurrentMove, FinalMove, FinalValue).


randomChange(_, [Cv, Ce], _, CurrentMove, FinalMove, FinalValue):-
        random(0, 2, 0),
        FinalMove = CurrentMove,
        FinalValue = [Cv, Ce].

randomChange([Vi, Ei], _, Move, _, FinalMove, FinalValue):-
        FinalMove = Move,
        FinalValue = [Vi, Ei].