export function queryNormalization<R, D>(reqParams: R, defaultParams: D): D{
  return {...defaultParams, ...reqParams}
}