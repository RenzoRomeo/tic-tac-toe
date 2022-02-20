import './App.css';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { Center, Flex, Text, Box, Button } from '@chakra-ui/react';
import { useClipboard } from '@mantine/hooks';
import { motion } from 'framer-motion';

import Board from './components/board';

const MotionText = motion(Text);

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

  const clipboard = useClipboard({ timeout: 500 });

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
    const ioClient = io('https://tic-tac-toe-backend-renzo.herokuapp.com/', {
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

    ioClient.on('reset', () => {
      window.location.href = '/';
    });

    setSocket(ioClient);
  }, []);

  return (
    <Center w="100vw" h="100vh" bg="#212529">
      <Flex direction="column" maxW="90%">
        {otherUser ? (
          <Box
            fontSize="1.5rem"
            p="1rem"
            bg="blackAlpha.500"
            borderRadius="10px"
            justifyContent="center"
          >
            <Text align="center">
              {!playing
                ? `${
                    history[0] === players.none
                      ? 'Draw'
                      : history[0] === players.X
                      ? 'X Wins!'
                      : 'O Wins!'
                  }`
                : turn
                ? 'Your Turn!'
                : 'Waiting...'}
            </Text>
          </Box>
        ) : (
          <Button
            bg={clipboard.copied ? 'green.500' : 'blackAlpha.500'}
            onClick={() => clipboard.copy(currentUser)}
          >
            {clipboard.copied ? 'Copied' : 'Share this link'}
          </Button>
        )}

        <Board
          squares={squares}
          handleFinishGame={handleFinishGame}
          handleNewMove={handleNewMove}
          mt="2rem"
        />

        <Flex
          direction="row"
          w="100%"
          justify="space-between"
          p="4rem"
          pb="0"
          fontSize="4rem"
        >
          {[wins, draws, loses].map((x, i) => (
            <MotionText
              whileHover={{ scale: 1.2 }}
              color={i === 0 ? 'green.500' : i === 1 ? 'yellow.500' : 'red.500'}
              cursor="default"
            >
              {x}
            </MotionText>
          ))}
        </Flex>
      </Flex>
    </Center>
  );
}

export default App;
