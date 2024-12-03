import { readonly } from 'vue'
import type { State } from './state.js'
import { useOperationState } from './state.js'

export function useTrailingOperation<
  F extends (...args: never[]) => Promise<T>,
  T = Awaited<ReturnType<F>>,
>(
  fn: F,
): [
    (...args: Parameters<F>) => Promise<T>,
    ReturnType<typeof readonly<State<T>>>,
  ] {
  const _ = useOperationState<T>()
  let trailingPromise

  async function _fn(...args: never[]): Promise<T> {
    _.status = 'pending'
    _.result = undefined
    _.error = undefined

    const promise = fn(...args)
    trailingPromise = promise

    let result

    try {
      result = await promise
    }
    catch (error) {
      if (trailingPromise === promise) {
        _.error = error
        _.status = 'rejected'
      }

      throw error
    }

    if (trailingPromise === promise) {
      _.result = result
      _.error = null
      _.status = 'fulfilled'
    }

    return result
  }

  return [_fn, readonly(_ as State<T>)]
}
