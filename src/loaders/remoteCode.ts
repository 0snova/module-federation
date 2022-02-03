import { initRemoteModule } from '../internal/initRemoteModule';
import { getRemoteUrl } from '../internal/getRemoteUrl';
import { loadScript } from '../internal/loadScript';
import { RemoteCodeLoaderParams } from '../internal/types';

export async function remoteCode<T = any>({ scope, module, url }: RemoteCodeLoaderParams): Promise<T | null> {
  try {
    await loadScript(getRemoteUrl(url));

    const moduleInitializer = initRemoteModule(scope, module);
    const { default: code } = await moduleInitializer();

    return code;
  } catch (e) {
    return null;
  }
}
