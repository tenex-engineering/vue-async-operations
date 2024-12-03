export function useDeferredPromise() {
  type Args = Parameters<ConstructorParameters<typeof Promise<void>>[0]>

  let resolve!: Args[0]
  let reject!: Args[1]

  const deferred = new Promise<void>((...args) => {
    resolve = args[0]
    reject = args[1]
  })

  return [deferred, resolve, reject] satisfies [Promise<void>, Args[0], Args[1]]
}
