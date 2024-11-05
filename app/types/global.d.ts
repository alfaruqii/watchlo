export interface Routes {
  pathname: string;
  query: {
    id: string;
    ep?: number;
    season?: number;
  };
}

export interface AnimeSchQueryParams {
  p?: string;
  pp?: string;
}
