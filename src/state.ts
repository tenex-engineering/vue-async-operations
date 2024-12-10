import { computed } from 'vue'
import { reactive } from 'vue'
import { readonly } from 'vue'

type Status = 'initial' | 'pending' | 'fulfilled' | 'rejected'

export interface DefaultState<T = unknown> {
  status: Status
  result: T | undefined
  error: unknown | undefined
}

export function createDefaultState<T>() {
  const _: DefaultState<T> = reactive({
    status: 'initial',
    result: undefined,
    error: undefined,
  })

  return _
}

export function publishState<T, U extends DefaultState<T>>($: U) {
  const _ = readonly({
    result: computed(() => $.result),
    error: computed(() => $.error),
    isInitial: computed(() => $.status === 'initial'),
    isPending: computed(() => $.status === 'pending'),
    isFulfilled: computed(() => $.status === 'fulfilled'),
    isRejected: computed(() => $.status === 'rejected'),
    isSettled: computed((): boolean => _.isFulfilled || _.isRejected),
  })

  return _
}
