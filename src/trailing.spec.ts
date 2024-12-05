import { expect } from 'vitest'
import { test } from 'vitest'
import { useDeferredPromise } from './testing/deferred-promise.js'
import { useTrailingOperation } from './trailing.js'

test('initial', async () => {
  const [query, operation] = useTrailingOperation(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

  expect(operation.status).toBe('initial')
  expect(operation.result).toBe(undefined)
  expect(operation.error).toBe(undefined)

  await query()
})

test('pending', async () => {
  const [deferred, resolve] = useDeferredPromise()

  const [query, operation] = useTrailingOperation(async () => {
    await deferred
  })

  const promise = query()

  expect(operation.status).toBe('pending')

  resolve()
  await promise
})

test('fulfilled', async () => {
  const [query, operation] = useTrailingOperation(async (name: string) => {
    await new Promise((resolve) => setTimeout(resolve, 0))

    return `hello, ${name}!`
  })

  await query('friend')

  expect(operation.status).toBe('fulfilled')
  expect(operation.result).toBe('hello, friend!')
  expect(operation.error).toBe(null)
})

test('rejected', async () => {
  const [query, operation] = useTrailingOperation(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))

    throw Error('deliberately')
  })

  try {
    await query()
  } catch (error: unknown) {
    expect(operation.status).toBe('rejected')
    expect(operation.result).toBe(undefined)
    expect(operation.error).toBe(error)
  }
})

test('concurrent', async () => {
  const [deferred, resolve] = useDeferredPromise()
  let first = true

  const [query, operation] = useTrailingOperation(async (name: string) => {
    if (first) {
      first = false
      await deferred

      return
    }

    await new Promise((resolve) => setTimeout(resolve, 0))

    return `hello, ${name}!`
  })

  query('friend')
  await query('buddy')

  expect(operation.result).toBe('hello, buddy!')

  resolve()
})
