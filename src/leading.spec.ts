import { createDeferredPromise } from './testing/deferred-promise.js'
import { expect } from 'vitest'
import { test } from 'vitest'
import { useLeadingOperation } from './leading.js'

test('initial', async () => {
  const [submit, submission] = useLeadingOperation(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

  expect(submission.status).toBe('initial')
  expect(submission.result).toBe(undefined)
  expect(submission.error).toBe(undefined)

  await submit()
})

test('pending', async () => {
  const deferred = createDeferredPromise()

  const [submit, submission] = useLeadingOperation(async () => {
    await deferred.promise
  })

  const promise = submit()

  expect(submission.status).toBe('pending')

  deferred.resolve()
  await promise
})

test('fulfilled', async () => {
  const [submit, submission] = useLeadingOperation(async (name: string) => {
    await new Promise((resolve) => setTimeout(resolve, 0))

    return `hello, ${name}!`
  })

  await submit('friend')

  expect(submission.status).toBe('fulfilled')
  expect(submission.result).toBe('hello, friend!')
  expect(submission.error).toBe(undefined)
})

test('rejected', async () => {
  const [submit, submission] = useLeadingOperation(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))

    throw Error('deliberately')
  })

  try {
    await submit()
  } catch (error: unknown) {
    expect(submission.status).toBe('rejected')
    expect(submission.result).toBe(undefined)
    expect(submission.error).toBe(error)
  }
})

test('concurrent', async () => {
  const deferred = createDeferredPromise()

  const [submit] = useLeadingOperation(async () => {
    await deferred.promise
  })

  submit()

  await expect(submit).rejects.toThrowError()

  deferred.resolve()
})
