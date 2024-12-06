import type { StateDefaults } from './state.js'

type StateVariant<
  T extends Partial<U>,
  U = StateDefaults,
> = {
  [P in keyof T]: P extends keyof U ? T[P] : never
} & U

export type State<T> = (
  | StateVariant<{
    status: 'initial',
    isInitial: true,
    result: undefined,
    error: undefined,
  }>
  | StateVariant<{
    status: 'pending',
    isPending: true,
    result: undefined,
    error: undefined,
  }>
  | StateVariant<{
    status: 'fulfilled',
    isFulfilled: true,
    result: T,
    error: null,
  }>
  | StateVariant<{
    status: 'rejected',
    isRejected: true,
    result: undefined,
    error: unknown,
  }>
) & (
  | StateVariant<{
    isFulfilled: true,
    status: 'fulfilled',
    result: T,
    error: null,
  }>
  | StateVariant<{
    isFulfilled: false,
    status: Exclude<StateDefaults['status'], 'fulfilled'>,
    result: undefined,
    error: unknown,
  }>
)
