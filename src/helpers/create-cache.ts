import LRU from 'lru'


export const createCache = <T>(lru: LRU<T>) => (
  (fetch: () => Promise<T> | T, name: string, handleError?: (error: any) => T) => async () => {
    try {
      let result = lru.get(name)
      
      if (result === undefined) {
        const resultResponse = await fetch()
        
        result = lru.set(name, resultResponse)
      }
      return result
    }
    catch (error) {
      if (handleError) {
        return handleError(error)
      }
      console.error(`cache '${name}' error \n`, error)
      throw error
    }
  }
)
