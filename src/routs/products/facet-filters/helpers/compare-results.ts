type FirstResultItem = {
  value: string | number,
  count: number
}

type FinalResultItem = {
  value: string | number,
  count: number,
  available: boolean
}


export function compareResults(first: Array<FirstResultItem>, next: Array<string | number>): Array<FinalResultItem> {
  return first.map(item => {
    if (next.includes(item.value)) return {...item, available: true}
    else return {...item, available: false}
  })
}