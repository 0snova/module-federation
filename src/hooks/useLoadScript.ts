import { useEffect, useState } from 'react';

import { loadScript } from '../internal/loadScript';

export interface UseLoadScriptResult {
  ready: boolean;
  failed: boolean;
}

export const useLoadScript = (url: string): UseLoadScriptResult => {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const promise = loadScript(url);

    setReady(false);
    setFailed(false);

    promise.then(() => {
      setReady(true);
    });

    promise.catch(() => {
      setReady(false);
      setFailed(true);
    });
  }, [url]);

  return { ready, failed };
};
