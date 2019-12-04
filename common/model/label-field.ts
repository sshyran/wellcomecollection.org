import { HTMLString } from '../services/prismic/types';
import { ContentFormatId } from './content-format-id';

export type LabelField = {
  id: ContentFormatId | null;
  title: string | null;
  description: HTMLString | null;
};
