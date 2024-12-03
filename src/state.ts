import { computed } from 'vue'
import { reactive } from 'vue'
import type { StateDefaults } from './state.types.js'

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
