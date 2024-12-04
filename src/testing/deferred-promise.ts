type ExecArgs = Parameters<ConstructorParameters<typeof Promise<void>>[0]>

export function useDeferredPromise(): [
  Promise<unknown>,
  ExecArgs[0],
  ExecArgs[1],
] {
  let resolve!: ExecArgs[0]
  let reject!: ExecArgs[1]

  const promise = new Promise((...args) => {
    resolve = args[0]
    reject = args[1]
  })

  return [promise, resolve, reject]
}

export function createDeferredPromise(): {
  promise: Promise<unknown>
  resolve: ExecArgs[0]
  reject: ExecArgs[1]
} {
  const [promise, resolve, reject] = useDeferredPromise()

  return { promise, resolve, reject }
}
