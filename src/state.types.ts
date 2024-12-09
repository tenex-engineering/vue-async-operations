import type { DefaultState } from './state.js'
import type { publishOperationState } from './state.js'

type StateVariant<
  T extends U,
  U = Omit<ReturnType<typeof publishOperationState>, 'result' | 'error'> &
  Omit<DefaultState, 'status'>,
> = Readonly<Pick<T, keyof U>>

export type OperationState<T> =
  | StateVariant<{
    result: undefined,
    error: undefined,
    isInitial: true,
    isPending: false,
    isFulfilled: false,
    isRejected: false,
    isSettled: false,
  }>
  | StateVariant<{
    result: undefined,
    error: undefined,
    isInitial: false,
    isPending: true,
    isFulfilled: false,
    isRejected: false,
    isSettled: false,
  }>
  | StateVariant<{
    result: T,
    error: undefined,
    isInitial: false,
    isPending: false,
    isFulfilled: true,
    isRejected: false,
    isSettled: true,
  }>
  | StateVariant<{
    result: undefined,
    error: unknown,
    isInitial: false,
    isPending: false,
    isFulfilled: false,
    isRejected: true,
    isSettled: true,
  }>
