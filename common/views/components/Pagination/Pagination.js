// @flow
import { font } from '../../../utils/classnames';
import Control from '../Buttons/Control/Control';
import Space from '../styled/Space';

export type Props = {|
  total: number,
  prevPage?: ?number,
  currentPage: number,
  pageCount: number,
  nextPage?: ?number,
  nextQueryString?: string,
  prevQueryString?: string,
  range?: {|
    beginning: number,
    end: number,
  |},
|};

const Pagination = ({
  prevPage,
  currentPage,
  pageCount,
  nextPage,
  nextQueryString,
  prevQueryString,
}: Props) => (
  <div
    className={`pagination float-r flex-inline flex--v-center font-pewter ${font(
      'lr',
      6
    )}`}
  >
    {prevPage && prevQueryString && (
      <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
        <Control
          link={{
            href: prevQueryString,
            as: prevQueryString,
          }}
          type="light"
          extraClasses={`icon--180`}
          icon="arrow"
          text={`Previous (page ${prevPage})`}
        />
      </Space>
    )}

    <span>
      Page {currentPage} of {pageCount}
    </span>

    {nextPage && nextQueryString && (
      <Space as="span" h={{ size: 'm', properties: ['margin-left'] }}>
        <Control
          link={{
            href: nextQueryString,
            as: nextQueryString,
          }}
          type="light"
          icon="arrow"
          text={`Next (page ${nextPage})`}
        />
      </Space>
    )}
  </div>
);

export default Pagination;
export class PaginationFactory {
  static fromList(
    l: [],
    total: number,
    currentPage: number = 1,
    pageSize: number = 32,
    getParams: {} = {}
  ) {
    const size = l.length;
    const pageCount = Math.ceil(total / pageSize);
    const prevPage =
      pageCount > 1 && currentPage !== 1 ? currentPage - 1 : null;
    const nextPage =
      pageCount > 1 && currentPage !== pageCount ? currentPage + 1 : null;
    const beginning = pageSize * currentPage - pageSize + 1;
    const range = {
      beginning: beginning,
      end: beginning + size - 1,
    };
    const nextQueryString = buildQueryString(nextPage, getParams);
    const prevQueryString = buildQueryString(prevPage, getParams);
    const pagination: Props = {
      total,
      range,
      pageCount,
      currentPage,
      nextPage,
      prevPage,
      nextQueryString,
      prevQueryString,
    };
    return pagination;
  }
}

function buildQueryString(page: number | null, getParams: {} = {}): string {
  const paramsArray = Object.keys(getParams)
    .map(key => {
      if (key !== 'page') {
        return `${key}=${encodeURIComponent(getParams[key])}`;
      }
    })
    .filter(_ => _);

  const paramsString = paramsArray.join('&');

  if (paramsArray.length && page) {
    return `?${paramsString}&page=${page}`;
  } else if (page) {
    return `?page=${page}`;
  } else if (paramsArray.length) {
    return `?${paramsString}`;
  } else {
    return '';
  }
}
