import { useEffect } from 'react';
import Square from './square';
import { BoxProps, SimpleGrid } from '@chakra-ui/react';

import { players } from '../App';

interface Props extends BoxProps {
  squares: players[];
  handleFinishGame: (winner: players) => void;
  handleNewMove: (index: number) => void;
}

const Board: React.FC<Props> = ({
  squares,
  handleFinishGame,
  handleNewMove,
  ...props
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
    <SimpleGrid columns={3} spacing="1.5rem" p="0.5rem" {...props}>
      {squares.map((square, i) => (
        <Square
          key={i}
          handler={() => handleNewMove(i)}
          player={
            square === players.none ? '' : square === players.X ? 'X' : 'O'
          }
        />
      ))}
    </SimpleGrid>
  );
};

export default Board;
