import { deferred, EnhancedPromise } from './deferred';

const scriptsStatuses: Record<string, EnhancedPromise<string> | undefined> = {};

export const loadScript = (url: string, timeout = 30000): EnhancedPromise<string> => {
  if (scriptsStatuses[url]) {
    return scriptsStatuses[url] as EnhancedPromise<string>;
  }

  const def = deferred({ timeout });

  const { document: doc } = window;

  const script = doc.createElement('script');

  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', url);

  const onError = (err: any) => {
    if (scriptsStatuses[url]) {
      delete scriptsStatuses[url];
    }
    def.reject(err);
    clearEventHandlers();
  };

  const onLoad = () => {
    def.resolve(script);
    clearEventHandlers();
  };

  const clearEventHandlers = () => {
    script.removeEventListener('error', onError);
    script.removeEventListener('load', onLoad);
  };

  script.addEventListener('error', onError);
  script.addEventListener('load', onLoad);

  doc.head.appendChild(script);

  scriptsStatuses[url] = def;

  return scriptsStatuses[url] as EnhancedPromise<string>;
};
