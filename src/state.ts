import { computed } from 'vue'
import { reactive } from 'vue'

export function useOperationState<T>(): StateDefaults<T> {
  const _: StateDefaults<T> = reactive({
    status: 'initial',
    result: undefined,
    error: undefined,
    isInitial: computed(() => _.status === 'initial'),
    isPending: computed(() => _.status === 'pending'),
    isFulfilled: computed(() => _.status === 'fulfilled'),
    isRejected: computed(() => _.status === 'rejected'),
    isSettled: computed(() => _.isFulfilled || _.isRejected),
  })

  return _
}

export interface StateDefaults<T = unknown> {
  status: 'initial' | 'pending' | 'fulfilled' | 'rejected'
  result: T | undefined
  error: unknown | undefined
  isInitial: boolean
  isPending: boolean
  isFulfilled: boolean
  isRejected: boolean
  isSettled: boolean
}
