export function projectFields<A, C>(resDataFields: Array<string>) {
  const project = {
    _id: 0,
    id: "$_id"
  }
  if (resDataFields.find(key => (key === 'id'))) project.id = '$id'
  resDataFields.forEach(key => {
    // @ts-ignore
    // todo: Узнать как типизировать!
    project[key] = '$' + key
  })

  return project
}