import React, { useEffect, useState } from 'react';
import { loadScript } from './loadScript';

declare function __webpack_init_sharing__(scope: string): Promise<void>;
declare const __webpack_share_scopes__: any;

export function loadComponent(scope: string, module: any) {
  const windowAny = window as any;
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__('default');

    const container = windowAny[scope];
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    const factory = await windowAny[scope].get(module);
    const Module = factory();
    return Module;
  };
}

export const useDynamicScript = (url: string) => {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const [promise, script] = loadScript(url);

    promise.then(() => {
      setReady(true);
      setFailed(false);
    });

    promise.catch(() => {
      setReady(false);
      setFailed(true);
    });

    return () => {
      document.head.removeChild(script);
    };
  }, [url]);

  return { ready, failed };
};

export type RemoteComponentProps<T> = T & {
  scope: string;
  module: string;
  url?: string;
  urlDev?: string;
  forceUrl?: string;
};

export function RemoteComponent<T>({ url, urlDev, forceUrl, scope, module, ...props }: RemoteComponentProps<T>) {
  const selectedUrl = forceUrl ?? ((process.env as any).isProduction ? url : urlDev);
  if (!selectedUrl) {
    throw new Error(`Unable to get RemoteComponent url ${selectedUrl}`);
  }
  const { failed, ready } = useDynamicScript(selectedUrl);

  if (!ready) {
    console.log('RemoteComponent is not readt yet');
    return <div>loading script {selectedUrl}</div>;
  }

  if (failed) {
    console.log('RemoteComponentfailed');
    return <div>failed to load script {selectedUrl}</div>;
  }

  const Component = React.lazy(loadComponent(scope, module));

  return (
    <React.Suspense fallback="Loading System">
      <Component {...props} />
    </React.Suspense>
  );
}
