import { createDefaultState } from './state.js'
import type { OperationState } from './state.js'
import { publishState } from './state.js'

/**
 * Wraps an asynchronous function to ensure that only the result of the most recent invocation
 * is tracked and reflected in the returned state. Even if earlier invocations are still pending,
 * their results are ignored once a new invocation starts.
 *
 * @param fn - The asynchronous function to be wrapped. It must return a promise.
 *
 * @returns A tuple containing:
 * - A wrapped version of the provided function that enforces the "trailing" behavior.
 * - A state object reflecting the most recent invocation's status, result, and error.
 *
 * @example
 * import { useTrailingOperation } from '@txe/vue-async-operations'
 *
 * let abortController: AbortController | undefined
 *
 * const [search, searchOperation] = useTrailingOperation(
 *   async ({ query }: { query: string }) => {
 *     abortController?.abort()
 *     abortController = new AbortController()
 *
 *     const params = new URLSearchParams({ query, tags: 'story' })
 *
 *     const response = await fetch(
 *       `http://hn.algolia.com/api/v1/search?${params}`,
 *       { signal: abortController.signal },
 *     )
 *
 *     const data = await response.json()
 *
 *     return data
 *   },
 * )
 */
export function useTrailingOperation<
  F extends (...args: never[]) => Promise<T>,
  T = Awaited<ReturnType<F>>,
>(fn: F): [(...args: Parameters<F>) => Promise<T>, OperationState<T>] {
  const _ = createDefaultState<T>()
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
    } catch (error) {
      if (trailingPromise === promise) {
        _.error = error
        _.status = 'rejected'
      }

      throw error
    }

    if (trailingPromise === promise) {
      _.result = result
      _.status = 'fulfilled'
    }

    return result
  }

  return [_fn, publishState(_) as OperationState<T>]
}
