import { createDefaultState } from './state.js'
import type { OperationState } from './state.types.js'
import { publishState } from './state.js'

/**
 * Creates a utility for managing asynchronous operations where only the first invocation
 * (the "leading" operation) is allowed to execute until it resolves. Subsequent calls made
 * while the first is pending will throw a `LeadingOperationError`.
 *
 * @param fn - The asynchronous function to be controlled.
 *
 * @returns
 * - A tuple containing:
 *   1. A wrapped version of the provided function that enforces the "leading" behavior.
 *   2. A state object tracking the current operation's status, result, and error.
 *
 * @throws {LeadingOperationError} If the operation is invoked while the previous invocation is still pending.
 *
 * @example
 * import { useLeadingOperation } from '@txe/vue-async-operations'
 *
 * const [submit, submission] = useLeadingOperation(async ({ title, body }) => {
 *   const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
 *     method: 'POST',
 *     body: JSON.stringify({ title, body }),
 *     headers: {
 *       'Content-type': 'application/json; charset=UTF-8',
 *     },
 *   })
 *
 *   const data = await response.json()
 *
 *   return data
 * })
 */
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

  return [_fn, publishState(_) as OperationState<T>]
}

export class LeadingOperationError extends Error {}
