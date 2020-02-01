export function queryNormalization<T>(reqParams: T, defaultParams: T): T{
  return {...defaultParams, ...reqParams}
}