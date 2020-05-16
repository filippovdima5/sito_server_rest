export function customQueryParse(search: string) {
  if (!search || search === '?') return {}
  
  let foundFields: any = {}
  
  try {
    foundFields = Object.fromEntries(
      search.replace('?', '')
        .split('&')
        .map(i => i.split('='))
    )
  } catch (e) {
    console.error(e)
    return foundFields
  }
  
  
  
}


function parseNumber(str: string): number | null {
  if (isNaN(Number(str))) return null
  return Number(str)
}

function parseArrayNumber(str: string): Array<number> | null {
  if (!str) return null
  return str.split(',').filter(i => !isNaN(Number(i))).map(i => Number(i))
}

