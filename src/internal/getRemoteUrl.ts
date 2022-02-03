export function getRemoteUrl(url?: string | (() => string)) {
  const selectedUrl = typeof url === 'function' ? url() : url;

  if (typeof selectedUrl !== 'string') {
    throw new Error(`getRemoteUrl: selected url must be a string, but got ${JSON.stringify(selectedUrl)}`);
  }

  return selectedUrl;
}
