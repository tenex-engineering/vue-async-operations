export interface StateDefaults<T = unknown> {
  status: 'initial' | 'pending' | 'fulfilled' | 'rejected',
  result: T | undefined,
  error: unknown | undefined,
  isInitial: boolean,
  isPending: boolean,
  isFulfilled: boolean,
  isRejected: boolean,
  isSettled: boolean,
}

type StateVariant<
  T extends {
    [P in keyof U]?: U[P]
  },
  U = StateDefaults,
> = U & {
  [P in keyof T]: T[P]
}

export type State<T> = (
  | StateVariant<{
    status: 'initial' | 'pending',
    result: undefined,
    error: undefined,
  }>
  | StateVariant<{
    status: 'fulfilled',
    result: T,
    error: undefined,
  }>
  | StateVariant<{
    status: 'rejected',
    result: undefined,
    error: unknown,
  }>
)
& (
  | StateVariant<{
    isFulfilled: true,
    result: T,
    error: undefined,
  }>
  | StateVariant<{
    isFulfilled: false,
    result: undefined,
    error: unknown,
  }>
)
