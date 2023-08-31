import Tetris from '../Tetris';

interface Props {
  isDesktop: boolean;
  tetrisPieces: Record<string, number>;
}

const Step3 = (props: Props) => {
  const { tetrisPieces, isDesktop } = props;

  const convertTetrisPiecesToArrayPieces = (obj: {
    [key: string]: number;
  }): ('I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z')[] =>
    Object.entries(obj).flatMap(([key, value]) => Array(value).fill(key));

  return <Tetris isDesktop={isDesktop} initialQueue={convertTetrisPiecesToArrayPieces(tetrisPieces)} />;
};

export default Step3;
