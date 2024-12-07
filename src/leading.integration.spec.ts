import { createDeferredPromise } from './testing/deferred-promise.js'
import { expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { test } from 'vitest'
import TestBench from './testing/TestBench.vue'
import { useLeadingOperation } from './leading.js'

const selector = '[data-testid=operation]'

test('initial', async () => {
  const [, submission] = useLeadingOperation(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

  const wrapper = mount(TestBench, {
    props: {
      operation: submission,
    },
  })

  expect(wrapper.find(selector).text()).toEqual('initial')
})

test('pending', async () => {
  const deferred = createDeferredPromise()

  const [submit, submission] = useLeadingOperation(async () => {
    await deferred.promise
  })

  const wrapper = mount(TestBench, {
    props: {
      operation: submission,
    },
  })

  const promise = submit()
  await wrapper.vm.$nextTick()

  expect(wrapper.find(selector).text()).toEqual('pending')

  deferred.resolve()
  await promise
})

test('fulfilled', async () => {
  const [submit, submission] = useLeadingOperation(async (name: string) => {
    await new Promise((resolve) => setTimeout(resolve, 0))

    return `hello, ${name}!`
  })

  const wrapper = mount(TestBench, {
    props: {
      operation: submission,
    },
  })

  await submit('friend')

  const text = wrapper.find(selector).text()

  expect(text).toEqual(['settled', 'fulfilled', 'hello, friend!'].join(''))
})

test('rejected', async () => {
  const [submit, submission] = useLeadingOperation(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))

    throw Error('deliberately')
  })

  const wrapper = mount(TestBench, {
    props: {
      operation: submission,
    },
  })

  try {
    await submit()
  } catch {
    expect(wrapper.find(selector).text()).toEqual(
      ['settled', 'rejected', 'deliberately'].join(''),
    )
  }
})
