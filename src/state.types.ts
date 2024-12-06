import type { StateDefaults } from './state.js'

type StateVariant<
  T extends Partial<U>,
  U = StateDefaults,
> = {
  [P in keyof T]: P extends keyof U ? T[P] : never
} & U

export type State<T> =
  | StateVariant<{
    status: 'initial',
    result: undefined,
    error: undefined,
    isInitial: true,
    isPending: false,
    isFulfilled: false,
    isRejected: false,
    isSettled: false,
  }>
  | StateVariant<{
    status: 'pending',
    result: undefined,
    error: undefined,
    isInitial: false,
    isPending: true,
    isFulfilled: false,
    isRejected: false,
    isSettled: false,
  }>
  | StateVariant<{
    status: 'fulfilled',
    result: T,
    error: undefined,
    isInitial: false,
    isPending: false,
    isFulfilled: true,
    isRejected: false,
    isSettled: true,
  }>
  | StateVariant<{
    status: 'rejected',
    result: undefined,
    error: unknown,
    isInitial: false,
    isPending: false,
    isFulfilled: false,
    isRejected: true,
    isSettled: true,
  }>