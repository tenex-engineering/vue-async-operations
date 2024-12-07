import type { StateDefaults } from './state.js'

type StateVariant<T extends U, U = Omit<StateDefaults, 'status'>> = Pick<T, keyof U>

export type State<T> =
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
