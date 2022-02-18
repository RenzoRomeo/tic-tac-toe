import './board.css';

import { useState, useEffect } from 'react';
import Square from '../square/square';

import { players } from '../../App';

interface Props {
  playing: boolean;
  handleFinishGame: (winner: players) => void;
}

const Board: React.FC<Props> = ({ playing, handleFinishGame }) => {
  const [squares, setSquares] = useState<players[]>(
    Array(9).fill(players.none)
  );
  const [currentPlayer, setCurrentPlayer] = useState<players>(players.X);

  const handleClick = (i: number) => {
    if (playing && squares[i] === players.none) {
      setSquares(
        squares.map((square, j) => (j === i ? currentPlayer : square))
      );
      setCurrentPlayer(currentPlayer === players.X ? players.O : players.X);
    }
  };

  const check = () => {
    const winnerIndexes = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const winnerIndex of winnerIndexes) {
      let sum = 0;
      for (const index of winnerIndex) sum += squares[index];
      if (Math.abs(sum) === 3) {
        if (sum === 3) handleFinishGame(players.X);
        else handleFinishGame(players.O);
        return;
      }
    }
    if (!squares.includes(players.none)) handleFinishGame(players.none);
  };

  useEffect(() => {
    check();
  }, [squares]);

  useEffect(() => {
    if (playing) setSquares(Array(9).fill(players.none));
  }, [playing]);

  return (
    <div className="board">
      {squares.map((square, i) => (
        <Square
          key={i}
          handler={() => handleClick(i)}
          player={
            square === players.none ? '' : square === players.X ? 'X' : 'O'
          }
        />
      ))}
    </div>
  );
};

export default Board;
