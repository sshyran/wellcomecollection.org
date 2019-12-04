export type Work = Object & {
  type: 'Work';
};

export type CatalogueApiError = {
  errorType: string;
  httpStatus: number;
  label: string;
  description: string;
  type: 'Error';
};

export type CatalogueResultsList = {
  type: 'ResultList';
  totalResults: number;
  results: Work[];
  pageSize: number;
  prevPage: string | null;
  nextPage: string | null;
};

export type CatalogueAggregationBucket = {
  count: number;
  data: {
    id: string;
    label: string;
    type: string;
  };
  type: 'AggregationBucket';
};

export type CatalogueApiRedirect = {
  type: 'Redirect';
  status: number;
  redirectToId: string;
};
