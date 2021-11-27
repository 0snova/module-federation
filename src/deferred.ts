export type EnhancedPromise<T> = Promise<T> & { resolve(arg: any): void; reject(arg: any): void };

export type DeferredOptions = {
  timeout?: number;
  id?: string;
};

export const deferred = ({ id = 'anonymous deferred', timeout }: DeferredOptions) => {
  let resolve: (value: string) => void;
  let reject: (value: any) => void;
  let timeoutId: ReturnType<typeof setTimeout>;

  const promise = new Promise<string>((resolver, rejector) => {
    resolve = resolver;
    reject = rejector;
  }) as EnhancedPromise<string>;

  promise.resolve = (arg) => {
    clearTimeout(timeoutId);
    resolve(arg);
  };

  promise.reject = (arg) => {
    clearTimeout(timeoutId);
    reject(arg);
  };

  if (typeof timeout === 'number') {
    timeoutId = setTimeout(() => reject({ reason: `timeout (${timeout}) reached on "${id}"` }), timeout);
  }

  return promise;
};
