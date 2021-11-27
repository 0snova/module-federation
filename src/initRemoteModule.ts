declare function __webpack_init_sharing__(scope: string): Promise<void>;
declare const __webpack_share_scopes__: any;

const modules = new Map<string, { default: unknown }>();

export function initRemoteModule(scope: string, module: string) {
  const windowAny = window as any;
  const maybeExistingModule = modules.get(`${scope}:${module}`);

  if (maybeExistingModule) {
    return async () => {
      return maybeExistingModule;
    };
  }

  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__('default');

    const container = windowAny[scope];
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    const factory = await container.get(module);
    const Module = factory();

    modules.set(`${scope}:${module}`, Module);

    return Module;
  };
}
