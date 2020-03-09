import { Seo } from './schemas/seos'

let startParse: boolean = false


const keys = {
  4006: 1001,
  1006: 1001,
  
  1005: 1002,
  
  4004: 1003,
  1004: 1003,
  
  1008: 1004,
  4008: 1004,
  
  4007: 1005,
  1007: 1005,
  
  4011: 1006,
  
  4001: 1007,
  1012: 1007,
  
  
  
  
  
  
  4002: 1010,
  1001: 1010,
  
  4003: 1011,
  1003: 1011,
  
  4009: 1012,
  1009: 1012,
  
  1010: 1013,
  4010: 1013,
  
  5001: 2001,
  2001: 2001,
  
  5002: 2002,
  2002: 2002,
  
  5003: 2003,
  2003: 2003,
  
  
  
  2005: 2005,
  
  3005: 3002,
  
  6001: 3004,
  3001: 3004,
  
  6002: 3005,
  3002: 3005,
  
  6006: 3007,
  
  
  3006: 3008,
  
  6008: 3009,
  
  6007: 3011,
  3007: 3011
}

function start() {
  const cursor = Seo.find({}).cursor()
  
  cursor.on('data', async (doc) => {
    cursor.pause()
    
    let { _id,  category, sex, subcategory } = doc
  
    const newDoc: any = {}
  
    if (!category) newDoc.category = 0
    if (!sex) newDoc.sex = 0
    if (!subcategory) newDoc.subcategory = 0
    

    // @ts-ignore
    

    
    try {
      await Seo.findOneAndUpdate({ _id: _id }, newDoc, { upsert: false })
    } catch (e) {
      console.log(e.message)
    }
    
    
    cursor.resume()
  })
}

start()

