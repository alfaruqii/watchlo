export interface Routes {
  pathname: string,
  query: {
    title: string | number;
    ep: number;
    season?: number;
  }
}

export interface AnimeRecQueryParams {
  id?: string;
  q?: string;
}

