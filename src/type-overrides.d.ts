
declare module 'lru' {
  class LRU<T> {
    constructor(opts: { max?: number, maxAge?: number})
    constructor(length: number)
    length: number
    keys: Array<string>
    set(key: string, value: T): T
    get(key: string): T | undefined
    peek(key: string): T | undefined
    remove(key: string): T | undefined
    clear(): void
    //on(event: 'evict', callback: (evicted: {key: string, value: T}) => void )
  }
  
  export default LRU
}

