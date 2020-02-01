export function queryNormalization<T, D>(reqParams: any, defaultParams: D): D{
  return {...defaultParams, ...reqParams}
}