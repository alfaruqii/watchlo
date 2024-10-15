export interface Routes {
  pathname: string,
  query: {
    id: string;
    ep: number;
    season?: number;
  }
}

export interface AnimeRecQueryParams {
  id?: string;
  q?: string;
}

export interface AnimeSchQueryParams {
  p?: string;
  pp?: string;
}

