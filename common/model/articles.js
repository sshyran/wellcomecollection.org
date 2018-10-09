// @flow
import type {ArticleSeries} from './article-series';
import type {GenericContentFields} from './generic-content-fields';
import type {LabelField} from './label-field';
import type {ColorSelection} from './color-selections';

export type Article = {|
  type: 'articles',
  ...GenericContentFields,
  format: ?LabelField,
  datePublished: Date,
  series: ArticleSeries[],
  color?: ?ColorSelection
|}
