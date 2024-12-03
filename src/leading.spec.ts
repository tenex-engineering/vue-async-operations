import { expect } from 'vitest'
import { test } from 'vitest'
import { useDeferredPromise } from './testing/deferred-promise.js'
import { useLeadingOperation } from './leading.js'

test('fulfilled', async () => {
  const [deferred, resolve] = useDeferredPromise()

  const [submit, submission] = useLeadingOperation(async (name: string) => {
    await deferred

    return `hello, ${name}!`
  })

  expect(submission.status).toBe('initial')
  expect(submission.result).toBe(undefined)
  expect(submission.error).toBe(undefined)

  const promise = submit('friend')

  expect(submission.status).toBe('pending')

  resolve()
  await promise

  expect(submission.status).toBe('fulfilled')
  expect(submission.result).toBe('hello, friend!')
  expect(submission.error).toBe(null)
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
  const [deferred, resolve] = useDeferredPromise()

  const [submit] = useLeadingOperation(async () => {
    await deferred
  })

  submit()

  await expect(submit).rejects.toThrowError()

  resolve()
})
