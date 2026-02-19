export const Colors = {
  ink: '#0f0e0b',
  cream: '#f5f0e8',
  amber: '#d4821a',
  amberLight: '#f5a623',
  forest: '#1a3a2a',
  sage: '#4a7c5f',
  dust: '#c8b99a',
  paper: '#ede8dc',
  card: '#faf7f2',
  gold: '#c9a84c',
  red: '#c0392b',
  white: '#ffffff',
  // Book cover colors (cycling palette)
  coverColors: [
    '#2c5364',
    '#7b2d00',
    '#1a3a2a',
    '#3d0066',
    '#4a1942',
    '#1a2a4a',
    '#0f4c81',
    '#2e4a8a',
  ],
};

// Returns a cover color based on a stable index
export function coverColor(index: number): string {
  return Colors.coverColors[index % Colors.coverColors.length];
}
