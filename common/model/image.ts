// @flow
import { Tasl } from './tasl';

type Crop = { [key: string]: ImageType };
// We call this ImageType to not conflict with the native DOM Image
export type ImageType = {
  contentUrl: string;
  width: number;
  height: number;
  alt: string;
  tasl: Tasl;
  crops: { [key: string]: ImageType };
};
