import Prismic from 'prismic-javascript';
import {prismicApiV2} from './prismic-api';

export async function getCuratedList(id: string) {
  const fetchLinks = [
    'series.name', 'series.description', 'series.commissionedLength', 'series.color', 'series.wordpressSlug'
  ];
  const prismic = await prismicApiV2();
  const curatedLists = await prismic.query([
    Prismic.Predicates.at('my.curatedLists.uid', id),
    Prismic.Predicates.at('document.type', 'curatedLists')
  ], {fetchLinks});

  const curatedList = curatedLists.results.length > 0 && curatedLists.results[0];

  if (!curatedList) {
    return null;
  }

  return curatedList;
}
