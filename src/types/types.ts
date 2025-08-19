export type Params<T> = Promise<T>;
export type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;
