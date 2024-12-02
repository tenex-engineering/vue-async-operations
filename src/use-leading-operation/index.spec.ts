import { expect } from 'vitest'
import { test } from 'vitest'
import { useLeadingOperation } from './index.js'

test('fulfilled', async () => {
  const [submit, submission] = useLeadingOperation(async (name: string) => {
    await new Promise((resolve) => setTimeout(resolve, 0))

    return `hello, ${name}!`
  })

  expect(submission.status).toBe('idle')
  expect(submission.result).toBe(undefined)
  expect(submission.error).toBe(undefined)

  const promise = submit('friend')

  expect(submission.status).toBe('pending')

  await promise

  expect(submission.status).toBe('fulfilled')
  expect(submission.result).toBe('hello, friend!')
  expect(submission.error).toBe(null)
})

test('rejected', async () => {
  const [submit, submission] = useLeadingOperation(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))

    throw Error('deliberate')
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
  const [submit] = useLeadingOperation(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

  submit()

  await expect(submit).rejects.toThrowError()
})
