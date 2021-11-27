import React, { useMemo } from 'react';

import { useDynamicScript } from './useDynamicScript';
import { RemoteModuleLazyComponent } from './RemoteModuleLazyComponent';

declare module 'react' {
  // interface forwardRef<T, P = Record<string, unknown>> extends React.FunctionComponent<P> {
  //   (render: (props: P, ref: React.Ref<T>) => React.ReactElement | null): (
  //     props: P & React.RefAttributes<T>
  //   ) => React.ReactElement | null;
  // }

  function forwardRef<T, P = Record<string, unknown>>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export type RemoteComponentProps<T = any> = T & {
  scope: string;
  module: string;
  url?: string | (() => string);
  fallback?: React.ReactNode;
  loader?: React.ReactNode;
  error?: React.ReactNode;
};

function RemoteComponentInner<T>(
  {
    url,
    scope,
    module,
    fallback = '',
    loader = '',
    error = 'Failed to load component',
    ...props
  }: RemoteComponentProps<T>,
  ref: React.ForwardedRef<HTMLElement>
): JSX.Element {
  const selectedUrl = typeof url === 'function' ? url() : url;

  if (!selectedUrl) {
    throw new Error(`[RemoteComponent] Unable to get RemoteComponent url '${selectedUrl}'.`);
  }
  const { failed, ready } = useDynamicScript(selectedUrl);

  const Component = useMemo(() => {
    if (!failed && ready) {
      return RemoteModuleLazyComponent(scope, module);
    }

    return null;
  }, [scope, module, failed, ready]);

  if (failed) {
    return <>{error}</>;
  }

  if (!ready) {
    return <>{loader}</>;
  }

  return <React.Suspense fallback={fallback}>{Component && <Component ref={ref} {...props} />}</React.Suspense>;
}

export const RemoteComponent = React.forwardRef(RemoteComponentInner);

(RemoteComponent as React.FunctionComponent).displayName = 'RemoteComponent';
