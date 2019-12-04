import { getPrismicApi } from '../prismic/api';
import { asHtml } from '../prismic/parsers';
import GlobalAlert from '../../model/global-alert';

export async function fetchGlobalAlert(): GlobalAlert {
  const prismic = await getPrismicApi(null);
  const globalAlert = await prismic.getSingle('global-alert');

  return {
    text: globalAlert.data.text && asHtml(globalAlert.data.text),
    isShown: globalAlert.data.isShown && globalAlert.data.isShown === 'show',
  };
}
