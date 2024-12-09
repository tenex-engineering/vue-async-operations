import { createDefaultState } from './state.js'
import type { OperationState } from './state.types.js'
import { publishOperationState } from './state.js'

export function useLeadingOperation<
  F extends (...args: never[]) => Promise<T>,
  T = Awaited<ReturnType<F>>,
>(fn: F): [(...args: Parameters<F>) => Promise<T>, OperationState<T>] {
  const _ = createDefaultState<T>()

  async function _fn(...args: never[]): Promise<T> {
    if (_.status === 'pending') {
      throw new LeadingOperationError(
        'Cannot invoke operation while the leading one is pending',
      )
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
    _.status = 'fulfilled'

    return result
  }

  return [_fn, publishOperationState(_) as OperationState<T>]
}

export class LeadingOperationError extends Error {}
