import { readonly } from 'vue'
import { useOperationState } from '#app/modules/use-operation-state.js'

export function useLeadingOperation<
  F extends (...args: never[]) => Promise<Awaited<ReturnType<F>>>,
>(
  fn: F,
): [
  (...args: Parameters<F>) => Promise<Awaited<ReturnType<F>>>,
  ReturnType<typeof readonly<ReturnType<typeof useOperationState<F>>>>,
] {
  const _ = useOperationState<F>()

  async function _fn(...args: never[]): Promise<Awaited<ReturnType<F>>> {
    if (_.isPending) {
      throw Error('Cannot invoke operation while the leading one is pending')
    }

    _.status = 'pending'
    _.result = undefined
    _.error = undefined

    let result

    try {
      result = await fn(...args)
    } catch (error) {
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
