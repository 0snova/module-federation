import { deferred, EnhancedPromise } from './deferred';

const scriptsCache: Record<string, [EnhancedPromise<string>, HTMLScriptElement] | null> = {};

export const loadScript = (url: string): [EnhancedPromise<string>, HTMLScriptElement] => {
  if (scriptsCache[url]) {
    return scriptsCache[url] as [EnhancedPromise<string>, HTMLScriptElement];
  }

  const dfd = deferred({ timeout: 30000 });

  const { document: doc } = window;

  const script = doc.createElement('script');

  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', url);

  script.addEventListener('error', (err) => {
    scriptsCache[url] = null;
    dfd.reject(err);
  });

  script.addEventListener('load', () => {
    dfd.resolve(script);
  });

  doc.head.appendChild(script);

  scriptsCache[url] = [dfd, script];

  return scriptsCache[url] as [EnhancedPromise<string>, HTMLScriptElement];
};
