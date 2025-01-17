export const recordToCacheKey = (record: any): string => {
  const arr = Object.entries(record)
    .filter(([ _, value ]) => (value !== null && value !== undefined && value !== ''))
    .sort((a, b) => (a[0].localeCompare(b[0])))
  
  return JSON.stringify(arr)
}
