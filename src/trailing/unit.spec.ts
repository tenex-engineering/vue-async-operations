import { expect } from 'vitest'
import { test } from 'vitest'
import { useTrailingOperation } from './index.js'

test('initial', async () => {
  const [, operation] = useTrailingOperation(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

  expect(operation.result).toBe(undefined)
  expect(operation.error).toBe(undefined)
  expect(operation.isInitial).toBe(true)
  expect(operation.isPending).toBe(false)
  expect(operation.isFulfilled).toBe(false)
  expect(operation.isRejected).toBe(false)
  expect(operation.isSettled).toBe(false)
})

test('pending', async () => {
  const deferred = Promise.withResolvers<void>()

  const [query, operation] = useTrailingOperation(async () => {
    await deferred.promise
  })

  const promise = query()

  expect(operation.result).toBe(undefined)
  expect(operation.error).toBe(undefined)
  expect(operation.isInitial).toBe(false)
  expect(operation.isPending).toBe(true)
  expect(operation.isFulfilled).toBe(false)
  expect(operation.isRejected).toBe(false)
  expect(operation.isSettled).toBe(false)

  deferred.resolve()
  await promise
})

test('fulfilled', async () => {
  const [query, operation] = useTrailingOperation(async (name: string) => {
    await new Promise((resolve) => setTimeout(resolve, 0))

    return `hello, ${name}!`
  })

  await query('friend')

  expect(operation.result).toBe('hello, friend!')
  expect(operation.error).toBe(undefined)
  expect(operation.isInitial).toBe(false)
  expect(operation.isPending).toBe(false)
  expect(operation.isFulfilled).toBe(true)
  expect(operation.isRejected).toBe(false)
  expect(operation.isSettled).toBe(true)
})

test('rejected', async () => {
  const [query, operation] = useTrailingOperation(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))

    throw Error('deliberately')
  })

  try {
    await query()
  } catch (error: unknown) {
    expect(operation.result).toBe(undefined)
    expect(operation.error).toBe(error)
    expect(operation.isInitial).toBe(false)
    expect(operation.isPending).toBe(false)
    expect(operation.isFulfilled).toBe(false)
    expect(operation.isRejected).toBe(true)
    expect(operation.isSettled).toBe(true)
  }
})

test('concurrent', async () => {
  const deferred = Promise.withResolvers<void>()

  const [query, operation] = useTrailingOperation(
    async (name: string, fn?: () => Promise<void>) => {
      await fn?.()

      return `hello, ${name}!`
    },
  )

  query('friend', async () => {
    await deferred.promise
  })
  await query('buddy')
  deferred.resolve()

  expect(operation.result).toBe('hello, buddy!')
})
