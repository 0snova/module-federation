export interface RemoteCodeLoaderParams {
  url: string | (() => string);
  scope: string;
  module: string;
}
