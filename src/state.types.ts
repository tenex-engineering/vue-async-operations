export interface StateDefaults<T = unknown> {
  status: 'initial' | 'pending' | 'fulfilled' | 'rejected',
  result: T | undefined,
  error: unknown | null | undefined,
  isInitial: boolean,
  isPending: boolean,
  isFulfilled: boolean,
  isRejected: boolean,
  isSettled: boolean,
}

type StateVariant<
  T extends Partial<U>,
  U = StateDefaults,
> = {
  [P in keyof T]: P extends keyof U ? T[P] : never
} & U

export type State<T> = (
  | StateVariant<{
    status: 'initial' | 'pending',
    result: undefined,
    error: undefined,
  }>
  | StateVariant<{
    status: 'fulfilled',
    result: T,
    error: null,
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
    error: null,
  }>
  | StateVariant<{
    isFulfilled: false,
    result: undefined,
    error: unknown,
  }>
)
