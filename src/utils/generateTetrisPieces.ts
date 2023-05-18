const pieces = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

const blocks: {
  [key: (typeof pieces)[number]]: number[][][];
} = {
  I: [[[1], [1], [1], [1]], [[1, 1, 1, 1]]],

  J: [
    [
      [0, 1],
      [0, 1],
      [1, 1]
    ],
    [
      [1, 0, 0],
      [1, 1, 1]
    ],
    [
      [1, 1],
      [1, 0],
      [1, 0]
    ],
    [
      [1, 1, 1],
      [0, 0, 1]
    ]
  ],

  L: [
    [
      [1, 0],
      [1, 0],
      [1, 1]
    ],
    [
      [1, 1, 1],
      [1, 0, 0]
    ],
    [
      [1, 1],
      [0, 1],
      [0, 1]
    ],
    [
      [0, 0, 1],
      [1, 1, 1]
    ]
  ],

  O: [
    [
      [1, 1],
      [1, 1]
    ]
  ],

  S: [
    [
      [0, 1, 1],
      [1, 1, 0]
    ],
    [
      [1, 0],
      [1, 1],
      [0, 1]
    ]
  ],

  T: [
    [
      [1, 1, 1],
      [0, 1, 0]
    ],
    [
      [0, 1],
      [1, 1],
      [0, 1]
    ],
    [
      [0, 1, 0],
      [1, 1, 1]
    ],
    [
      [1, 0],
      [1, 1],
      [1, 0]
    ]
  ],

  Z: [
    [
      [1, 1, 0],
      [0, 1, 1]
    ],
    [
      [0, 1],
      [1, 1],
      [1, 0]
    ]
  ]
};

export function countPieces(grid: number[][]): (number[][] | Record<string, number>)[] {
  const counts: Record<string, number> = {};

  // Iterate over each piece in the blocks object
  for (const piece of Object.keys(blocks)) {
    counts[piece] = 0; // Initialize the count for the current piece to 0

    // Iterate over different contribution intensities
    for (let pass = 1; pass <= 4; pass++) {
      // Iterate over each rotation of the current piece
      for (const rotation of blocks[piece]) {
        const pieceHeight = rotation.length;
        const pieceWidth = rotation[0].length;

        // Iterate over each possible starting position in the grid
        for (let row = 0; row <= grid.length - pieceHeight; row++) {
          for (let col = 0; col <= grid[row].length - pieceWidth; col++) {
            let matches = true;

            // Check if the current position and shape in the grid matches the current rotation of the piece
            for (let i = 0; i < pieceHeight; i++) {
              for (let j = 0; j < pieceWidth; j++) {
                const value = grid[row + i][col + j];
                const blockValue = rotation[i][j] * pass;

                // Compare the grid value and block value at each position
                // If they don't match, set matches to false and break out of the inner loop
                if (blockValue !== 0 && value !== blockValue) {
                  matches = false;
                  break;
                }
              }

              if (!matches) {
                break;
              }
            }

            // If all positions in the grid match the current rotation of the piece, increment the count
            if (matches) {
              counts[piece]++;

              // Modifies grid
              // Set the matching grid values to 0
              // Prevents going over the same value in the next loop
              for (let i = 0; i < pieceHeight; i++) {
                for (let j = 0; j < pieceWidth; j++) {
                  if (rotation[i][j] !== 0) {
                    grid[row + i][col + j] = 0;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return [counts, grid];
}
