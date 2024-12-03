import { expect } from 'vitest'
import { test } from 'vitest'
import { useDeferredPromise } from './testing/deferred-promise.js'
import { useTrailingOperation } from './trailing.js'

test('fulfilled', async () => {
  const [deferred, resolve] = useDeferredPromise()

  const [query, operation] = useTrailingOperation(async (name: string) => {
    await deferred

    return `hello, ${name}!`
  })

  expect(operation.status).toBe('initial')
  expect(operation.result).toBe(undefined)
  expect(operation.error).toBe(undefined)

  const promise = query('friend')

  expect(operation.status).toBe('pending')

  resolve()
  await promise

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

  const [query, operation] = useTrailingOperation(
    async (name: string, option?: { subsequent: true }) => {
      if (option?.subsequent !== true) {
        await deferred
      }

      return `hello, ${name}!`
    },
  )

  query('friend')
  await query('buddy', { subsequent: true })

  expect(operation.result).toBe('hello, buddy!')

  resolve()
})
