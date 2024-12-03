import { readonly } from 'vue'
import { useOperationState } from './state.js'

export function useLeadingOperation<
  F extends (...args: never[]) => Promise<T>,
  T = Awaited<ReturnType<F>>,
>(
  fn: F,
): [
    (...args: Parameters<F>) => Promise<T>,
    ReturnType<typeof readonly<ReturnType<typeof useOperationState<T>>>>,
  ] {
  const _ = useOperationState<T>()

  async function _fn(...args: never[]): Promise<T> {
    if (_.status === 'pending') {
      throw Error('Cannot invoke operation while the leading one is pending')
    }

    _.status = 'pending'
    _.result = undefined
    _.error = undefined

    let result

    try {
      result = await fn(...args)
    }
    catch (error) {
      _.error = error
      _.status = 'rejected'

      throw error
    }

    _.result = result
    _.error = null
    _.status = 'fulfilled'

    return result
  }

  return [_fn, readonly(_)]
}
