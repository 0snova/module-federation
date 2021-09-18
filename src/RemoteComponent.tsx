import React, { useEffect, useState } from 'react';
import { loadScript } from './loadScript';
import { initRemoteModule } from './initRemoteModule';

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

  const Component = React.lazy(initRemoteModule(scope, module));

  return (
    <React.Suspense fallback="Loading System">
      <Component {...props} />
    </React.Suspense>
  );
}
