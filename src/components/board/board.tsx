import './board.css';

import { useEffect } from 'react';
import Square from '../square/square';

import { players } from '../../App';

interface Props {
  squares: players[];
  handleFinishGame: (winner: players) => void;
  handleNewMove: (index: number) => void;
}

const Board: React.FC<Props> = ({
  squares,
  handleFinishGame,
  handleNewMove,
}) => {

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

  return (
    <div className="board">
      {squares.map((square, i) => (
        <Square
          key={i}
          handler={() => handleNewMove(i)}
          player={
            square === players.none ? '' : square === players.X ? 'X' : 'O'
          }
        />
      ))}
    </div>
  );
};

export default Board;
