export type OperationResult<T> =
  | { readonly ok: true; readonly data: T }
  | { readonly ok: false; readonly error: string }

export function success<T>(data: T): OperationResult<T> {
  return { ok: true, data }
}

export function failure<T = never>(error: string): OperationResult<T> {
  return { ok: false, error }
}
