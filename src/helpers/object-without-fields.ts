export function objectWithoutFields<A, B>(object: any, excludedFields: Array<string>) {
  const newObj: any = {}

  Object.keys(object).forEach(key => {
    if (excludedFields.includes(key)) return
    newObj[key] = object[key]
  })

  return newObj
}