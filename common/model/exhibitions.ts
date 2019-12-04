import { HTMLString } from '../services/prismic/types';
import { Picture } from './picture';
import { ImagePromo } from './image-promo';
import { Place } from './places';
import { Contributor } from './contributors';
import { ImageType } from './image';
import { GenericContentFields } from './generic-content-fields';
import { Resource } from './resource';

// e.g. 'Permanent'
export type ExhibitionFormat = {
  id: string;
  title: string;
  description: string | null;
};

export type Exhibition = GenericContentFields & {
  shortTitle: string | null;
  type: 'exhibitions';
  format: ExhibitionFormat | null;
  start: Date;
  end: Date | null;
  isPermanent: boolean;
  statusOverride: string | null;
  intro: HTMLString | null;
  description: HTMLString;
  contributors: Contributor[];
  place: Place | null;
  exhibits: {
    exhibitType: 'exhibitions';
    item: Exhibition;
  };
  resources: Resource[];
  relatedIds: string[];
};

export type ExhibitionPromo = {
  id: string;
  format: ExhibitionFormat | null;
  url: string;
  title: string;
  shortTitle: string | null;
  image: ImageType;
  squareImage: Picture | null;
  start: Date;
  end: Date | null;
  statusOverride: string | null;
};

export type UiExhibition = Exhibition & {
  promo: ExhibitionPromo | null;
  galleryLevel: number; // this should be deprecated for place
  textAndCaptionsDocument: any; // TODO: <= not this
  featuredImageList: Picture[];
  relatedBooks: ImagePromo[];
  relatedEvents: ImagePromo[];
  relatedGalleries: ImagePromo[];
  relatedArticles: ImagePromo[];
  exhibits: {
    exhibitType: 'exhibitions';
    item: UiExhibition;
  }[];
};

// We don't use these types for exhibits above
// as it creates a `needs to be defined before use` error.
export type Exhibit = {
  exhibitType: 'exhibitions';
  item: Exhibition;
};

export type UiExhibit = {
  exhibitType: 'exhibitions';
  item: UiExhibition;
};
