import { useEffect, useState } from 'react';

import { initRemoteModule } from '../internal/initRemoteModule';
import { getRemoteUrl } from '../internal/getRemoteUrl';
import { RemoteCodeLoaderParams } from '../internal/types';

import { useLoadScript } from './useLoadScript';

export type RemoteCodeLoaderResult<T> = [T | null, boolean];

export function useRemoteCode<T = any>({ scope, module, url }: RemoteCodeLoaderParams): RemoteCodeLoaderResult<T> {
  const selectedUrl = getRemoteUrl(url);

  const { failed, ready } = useLoadScript(selectedUrl);

  const [remoteFunction, setRemoteFunction] = useState(null);
  const [isReadyToUse, setIsReadyToUse] = useState(false);

  useEffect(() => {
    if (!ready || failed) {
      return;
    }

    const moduleInitializer = initRemoteModule(scope, module);

    moduleInitializer().then((module) => {
      setRemoteFunction(() => module.default);
      setIsReadyToUse(true);
    });
  }, [module, scope, ready, failed]);

  return [remoteFunction, isReadyToUse];
}
