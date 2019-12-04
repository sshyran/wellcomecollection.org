import { $Values } from '../utils/types';

export const ColorSelections = {
  Turquoise: 'turquoise',
  Red: 'red',
  Green: 'green',
  Purple: 'purple',
};

export type ColorSelection = $Values<typeof ColorSelections>;
