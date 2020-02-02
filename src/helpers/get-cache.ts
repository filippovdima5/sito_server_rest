import LRUCache from 'lru-cache'

// todo: Может нужно будет сортировать объекты
// или переходитьна GET запросы с query_params
// но пока что похер, делаю как было
// ибо и так всё затянулось

export const getCache = ( lru: LRUCache<any, any>, keyCache: any): any => {
  const key = typeof keyCache === 'object' ? JSON.stringify(keyCache) :  keyCache.toString()
  if (lru.get(key)) return lru.get(key)
  else throw Error('Кеша нет')
}