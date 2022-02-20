import './App.css';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

import Board from './components/board/board';

export enum players {
  X = 1,
  O = -1,
  none = 0,
}

function App() {
  const [socket, setSocket] = useState<Socket>();
  const [currentUser, setCurrentUser] = useState<string>('');
  const [otherUser, setOtherUser] = useState<string>('');

  const [playing, setPlaying] = useState<boolean>(false);
  const [wins, setWins] = useState<number>(0);
  const [draws, setDraws] = useState<number>(0);
  const [loses, setLoses] = useState<number>(0);
  const [history, setHistory] = useState<players[]>([]);

  const [currentPlayer, setCurrentPlayer] = useState<players>(players.X);
  const [turn, setTurn] = useState<boolean>(true);

  const [squares, setSquares] = useState<players[]>(
    Array(9).fill(players.none)
  );

  const handleFinishGame = (winner: players) => {
    setPlaying(false);
    setHistory([winner, ...history]);
    switch (winner) {
      case players.none:
        setDraws(draws + 1);
        break;
      case currentPlayer:
        setWins(wins + 1);
        break;
      default:
        setLoses(loses + 1);
    }
    socket?.emit('finishedGame', otherUser);
  };

  const handleNewMove = (i: number) => {
    if (playing && turn && squares[i] === players.none) {
      const newSquares = squares.map((square, j) =>
        j === i ? currentPlayer : square
      );
      setSquares(newSquares);
      setTurn(false);
      socket?.emit('newMove', { otherUser, newSquares });
    }
  };

  useEffect(() => {
    if (playing) setSquares(Array(9).fill(players.none));
  }, [playing]);

  useEffect(() => {
    const other = window.location.pathname.substring(1);
    setOtherUser(other);
    const ioClient = io('http://localhost:8000', {
      query: {
        other,
      },
    });

    ioClient.on('error', (message) => {
      console.log(message);
      window.location.href = '/';
    });

    ioClient.on('otherJoined', (other) => {
      setOtherUser(other);
      setTurn(true);
      setCurrentPlayer(players.X);
      setPlaying(true);
    });

    ioClient.on('youJoined', (other) => {
      setOtherUser(other);
      setCurrentPlayer(players.O);
      setPlaying(true);
      setTurn(false);
    });

    ioClient.on('getMove', (newSquares: players[]) => {
      setSquares(newSquares);
      setTurn(true);
    });

    ioClient.on('connect', () => {
      setCurrentUser(ioClient.id);
    });

    setSocket(ioClient);
  }, []);

  return (
    <div className="App">
      <div className="main">
        <p>{turn ? 'you play' : 'other plays'}</p>
        <div className="userId">
          {otherUser !== '' ? `Playing with ${otherUser}` : currentUser}
        </div>
        {!playing ? (
          <div className="winner">
            {history[0] === players.none
              ? 'Draw'
              : history[0] === players.X
              ? 'X wins'
              : 'O Wins'}
          </div>
        ) : (
          <div className="winner-placeholder">Playing...</div>
        )}
        <Board
          squares={squares}
          handleFinishGame={handleFinishGame}
          handleNewMove={handleNewMove}
        />
        <div className="scores">
          <div className="wins">{wins}</div>
          <div className="draws">{draws}</div>
          <div className="loses">{loses}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
