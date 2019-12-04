import { ArticleSeries } from './article-series';
import { GenericContentFields } from './generic-content-fields';
import { LabelField } from './label-field';
import { ColorSelection } from './color-selections';
import { MultiContent } from './multi-content';

export type Article = GenericContentFields & {
  type: 'articles';
  format: LabelField | null;
  datePublished: Date;
  series: ArticleSeries[];
  color?: ColorSelection | null;
  outroResearchLinkText: string | null;
  outroResearchItem: MultiContent | null;
  outroReadLinkText: string | null;
  outroReadItem: MultiContent | null;
  outroVisitLinkText: string | null;
  outroVisitItem: MultiContent | null;
};

export function getPositionInSeries(article: Article): number | null {
  const serialisedSeries = article.series.find(
    series => series.schedule.length > 0
  );
  if (serialisedSeries) {
    const titles = serialisedSeries.schedule.map(item => item.title);
    const index = titles.indexOf(article.title);
    return index > -1 ? index + 1 : null;
  }
}

export function getArticleColor(article: Article): string {
  return article.series.map(series => series.color).find(Boolean) || 'purple';
}
