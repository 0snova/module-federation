import React, { ReactElement, useMemo } from 'react';

import { useDynamicScript } from './useDynamicScript';
import { RemoteModuleLazyComponent } from './RemoteModuleLazyComponent';

interface ForwardRefFn<R> extends React.FunctionComponent {
  <P = Record<string, unknown>>(props: P & React.RefAttributes<R>): ReactElement | null;
}

export type RemoteComponentProps<T = any> = T & {
  scope: string;
  module: string;
  url?: string | (() => string);
  fallback?: React.ReactNode;
  loader?: React.ReactNode;
  error?: React.ReactNode;
};

export const RemoteComponent = React.forwardRef<HTMLElement, RemoteComponentProps>(
  (
    { url, scope, module, fallback = '', loader = '', error = 'Failed to load component', ...props },
    ref
  ): JSX.Element => {
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
) as ForwardRefFn<HTMLElement>;

RemoteComponent.displayName = 'RemoteComponent';
