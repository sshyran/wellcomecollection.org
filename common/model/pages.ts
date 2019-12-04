import { GenericContentFields } from './generic-content-fields';

export type Page = GenericContentFields & {
  type: 'pages';
  datePublished: Date | null;
  // TODO (tagging): This is just for now, we will be implementing a proper site tagging
  // strategy for this later
  siteSection: string | null;
  // TODO: (drupal migration) This is used while we add the credit and
  // alt for Drupal content
  drupalPromoImage: string | null;
  drupalNid: string | null;
  drupalPath: string | null;
};
