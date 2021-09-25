import React, { useEffect, useState, SuspenseProps, ReactNode } from 'react';
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
  fallback?: SuspenseProps['fallback'];
  notReadyComponent?: React.ReactNode | null;
  failedComponent?: React.ReactNode | null;
};

export function RemoteComponent<T>({
  fallback = null,
  notReadyComponent = null,
  failedComponent = null,
  url,
  urlDev,
  forceUrl,
  scope,
  module,
  ...props
}: RemoteComponentProps<T>) {
  const selectedUrl = forceUrl ?? ((process.env as any).isProduction ? url : urlDev);
  if (!selectedUrl) {
    throw new Error(`Unable to get URL for RemoteComponent module "${module}": ${selectedUrl}`);
  }
  const { failed, ready } = useDynamicScript(selectedUrl);

  if (!ready) {
    return <>{notReadyComponent}</>;
  }

  if (failed) {
    return <>{failedComponent}</>;
  }

  const Component = React.lazy(initRemoteModule(scope, module));

  return (
    <React.Suspense fallback={fallback}>
      <Component {...props} />
    </React.Suspense>
  );
}
