import { createDeferredPromise } from './testing/deferred-promise.js'
import { expect } from 'vitest'
import { LeadingOperationError } from './leading.js'
import { test } from 'vitest'
import { useLeadingOperation } from './leading.js'

test('initial', async () => {
  const [, submission] = useLeadingOperation(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

  expect(submission.result).toBe(undefined)
  expect(submission.error).toBe(undefined)
  expect(submission.isInitial).toBe(true)
  expect(submission.isPending).toBe(false)
  expect(submission.isFulfilled).toBe(false)
  expect(submission.isRejected).toBe(false)
  expect(submission.isSettled).toBe(false)
})

test('pending', async () => {
  const deferred = createDeferredPromise()

  const [submit, submission] = useLeadingOperation(async () => {
    await deferred.promise
  })

  const promise = submit()

  expect(submission.result).toBe(undefined)
  expect(submission.error).toBe(undefined)
  expect(submission.isInitial).toBe(false)
  expect(submission.isPending).toBe(true)
  expect(submission.isFulfilled).toBe(false)
  expect(submission.isRejected).toBe(false)
  expect(submission.isSettled).toBe(false)

  deferred.resolve()
  await promise
})

test('fulfilled', async () => {
  const [submit, submission] = useLeadingOperation(async (name: string) => {
    await new Promise((resolve) => setTimeout(resolve, 0))

    return `hello, ${name}!`
  })

  await submit('friend')

  expect(submission.result).toBe('hello, friend!')
  expect(submission.error).toBe(undefined)
  expect(submission.isInitial).toBe(false)
  expect(submission.isPending).toBe(false)
  expect(submission.isFulfilled).toBe(true)
  expect(submission.isRejected).toBe(false)
  expect(submission.isSettled).toBe(true)
})

test('rejected', async () => {
  const [submit, submission] = useLeadingOperation(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))

    throw Error('deliberately')
  })

  try {
    await submit()
  } catch (error) {
    expect(submission.result).toBe(undefined)
    expect(submission.error).toBe(error)
    expect(submission.isInitial).toBe(false)
    expect(submission.isPending).toBe(false)
    expect(submission.isFulfilled).toBe(false)
    expect(submission.isRejected).toBe(true)
    expect(submission.isSettled).toBe(true)
  }
})

test('concurrent', async () => {
  const deferred = createDeferredPromise()

  const [submit, submission] = useLeadingOperation(async (name: string) => {
    await deferred.promise

    return `hello, ${name}!`
  })

  const promise = submit('friend')

  await expect(() => submit('buddy')).rejects.toThrowError(
    LeadingOperationError,
  )

  deferred.resolve()
  await promise

  expect(submission.result).toBe('hello, friend!')
})
