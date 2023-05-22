import Tetris from '../Tetris';

interface Props {
  tetrisPieces: Record<string, number>;
}

const Step3 = (props: Props) => {
  const { tetrisPieces } = props;

  const convertTetrisPiecesToArrayPieces = (obj: {
    [key: string]: number;
  }): ('I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z')[] =>
    Object.entries(obj).flatMap(([key, value]) => Array(value).fill(key));

  return <Tetris initialQueue={convertTetrisPiecesToArrayPieces(tetrisPieces)} />;
};

export default Step3;
