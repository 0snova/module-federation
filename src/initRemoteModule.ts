declare function __webpack_init_sharing__(scope: string): Promise<void>;
declare const __webpack_share_scopes__: any;

export function initRemoteModule<M = any>(scope: string, module: M) {
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
