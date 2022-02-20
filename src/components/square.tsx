import { Center, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionCenter = motion(Center);

interface Props {
  player: 'X' | 'O' | '';
  handler: () => void;
}

const Square: React.FC<Props> = ({ player, handler }) => {
  return (
    <MotionCenter
      whileHover={{ scale: 1.05 }}
      onMouseDown={handler}
      boxSize={{ base: '6rem', sm: '8rem' }}
      bg="#0b090a"
      shadow="lg"
      cursor="pointer"
    >
      <Text fontSize="3rem">{player}</Text>
    </MotionCenter>
  );
};

export default Square;
