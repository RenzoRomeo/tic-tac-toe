import './square.css';

interface Props {
  player: 'X' | 'O' | '';
  handler: () => void;
}

const Square: React.FC<Props> = ({ player, handler }) => {
  return (
    <div className="square" onMouseDown={handler}>
      {player}
    </div>
  );
};

export default Square;
