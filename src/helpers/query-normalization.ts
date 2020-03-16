import { errorHandler } from './error-handler'


export function queryNormalization<A, B, C extends keyof A>(reqParams: A, defaultParams: B, requiredParams: Array<C>): A{
  const missingKeys: Array<C> = []
  requiredParams.forEach(field => {
    if ( reqParams[field] === undefined ) missingKeys.push(field)
  })
  if (missingKeys.length > 0) errorHandler({message: `Не переданы обязательные параметры: ${missingKeys.join(', ')}`, status: 400})

  return {...defaultParams, ...reqParams}
}
