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
  const [otherUser, setOtherUser] = useState<string>('');

  const [playing, setPlaying] = useState<boolean>(true);
  const [wins, setWins] = useState<number>(0);
  const [draws, setDraws] = useState<number>(0);
  const [loses, setLoses] = useState<number>(0);
  const [history, setHistory] = useState<players[]>([]);

  const handleFinishGame = (winner: players) => {
    setPlaying(false);
    setHistory([winner, ...history]);
  };

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
      console.log(other);
      setOtherUser(other);
    });

    setSocket(ioClient);
  }, []);

  return (
    <div className="App">
      <div className="main">
        <div className="userId">
          {otherUser !== '' ? `Playing with ${otherUser}` : socket && socket.id}
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
        <Board playing={playing} handleFinishGame={handleFinishGame} />
        <div className="scores">
          <div className="wins">{wins}</div>
          <div className="draws">{draws}</div>
          <div className="loses">{loses}</div>
        </div>

        <div
          className={playing ? 'playing' : 'reset'}
          onClick={() => setPlaying(true)}
        >
          {playing ? 'PLAYING' : 'RESET'}
        </div>
      </div>
    </div>
  );
}

export default App;
