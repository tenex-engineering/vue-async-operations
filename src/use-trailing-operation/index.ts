import { readonly } from 'vue'
import { useOperationState } from '../use-operation-state.js'

export function useTrailingOperation<
  F extends (...args: never[]) => Promise<Awaited<ReturnType<F>>>,
>(
  fn: F,
): [
  (...args: Parameters<F>) => Promise<Awaited<ReturnType<F>>>,
  ReturnType<typeof readonly<ReturnType<typeof useOperationState<F>>>>,
] {
  const _ = useOperationState<F>()
  let trailingPromise

  async function _fn(...args: never[]): Promise<Awaited<ReturnType<F>>> {
    _.status = 'pending'
    _.result = undefined
    _.error = undefined

    const promise = fn(...args)
    trailingPromise = promise

    let result

    try {
      result = await promise
    } catch (error) {
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

  return [_fn, readonly(_)]
}
