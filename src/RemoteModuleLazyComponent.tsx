import React from 'react';

import { initRemoteModule } from './initRemoteModule';

export const RemoteModuleLazyComponent = (scope: string, module: string) =>
  React.lazy(async () => {
    const m = initRemoteModule(scope, module);

    const { default: RemoteComponentModule } = await m();

    const withRef = React.forwardRef((props, ref) => {
      return <RemoteComponentModule ref={ref} {...props} />;
    });
    (withRef as React.FunctionComponent).displayName = `Remote(${RemoteComponentModule.displayName})`;

    return {
      default: withRef,
    };
  });
