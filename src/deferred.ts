export type EnhancedPromise<T> = Promise<T> & { resolve(arg: any): void; reject(arg: any): void };

export type DeferredOptions = {
  timeout?: number;
  id?: string;
};

export const deferred = ({ id = 'anonymous deferred', timeout }: DeferredOptions) => {
  let resolve: any;
  let reject: any;
  let timeoutId: any;

  const promise = new Promise((resolver, rejector) => {
    resolve = resolver;
    reject = rejector;
  }) as EnhancedPromise<any>;

  promise.resolve = (arg: any) => {
    clearTimeout(timeoutId);
    resolve(arg);
  };

  promise.reject = (arg: any) => {
    clearTimeout(timeoutId);
    reject(arg);
  };

  if (typeof timeout === 'number') {
    timeoutId = setTimeout(() => reject({ reason: `timeout (${timeout}) reached on "${id}"` }), timeout);
  }

  return promise;
};
