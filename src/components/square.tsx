import { Center, Text } from '@chakra-ui/react';

interface Props {
  player: 'X' | 'O' | '';
  handler: () => void;
}

const Square: React.FC<Props> = ({ player, handler }) => {
  return (
    <Center
      onMouseDown={handler}
      boxSize={{ base: '6rem', sm: '8rem' }}
      bg="#343a40"
      shadow="lg"
      cursor="pointer"
    >
      <Text fontSize="3rem">{player}</Text>
    </Center>
  );
};

export default Square;
