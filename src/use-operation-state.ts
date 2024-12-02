import { computed } from 'vue'
import { define } from '@txe/define-x'
import { reactive } from 'vue'

type Status = 'idle' | 'pending' | 'fulfilled' | 'rejected'

export function useOperationState<
  F extends (...args: never[]) => Promise<unknown>,
>() {
  const _ = reactive({
    status: define<Status>('pending'),
    result: define<Awaited<ReturnType<F>> | undefined>(undefined),
    error: define<unknown>(undefined),
    isIdle: computed((): boolean => _.status === 'idle' || _.isSettled),
    isPending: computed((): boolean => _.status === 'pending'),
    isFulfilled: computed((): boolean => _.status === 'fulfilled'),
    isRejected: computed((): boolean => _.status === 'rejected'),
    isSettled: computed((): boolean => _.isFulfilled || _.isRejected),
  })

  return _
}
