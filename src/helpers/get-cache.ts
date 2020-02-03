import LRUCache from 'lru-cache'

// todo: Может нужно будет сортировать объекты
// или переходитьна GET запросы с query_params
// но пока что похер, делаю как было
// ибо и так всё затянулось

export const getCache = ( lru: LRUCache<any, any>, keyCache: any): any => {
  const key = typeof keyCache === 'object' ? JSON.stringify(keyCache) :  keyCache
  const res = lru.get(key)


  if (res) return res
  else throw Error('Кеша нет')
}