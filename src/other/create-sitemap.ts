import fs from 'fs'
import path from 'path'
import { MetaTags } from '../schemas/v2/meta-tag'
import { appendFile } from '../libs'


async function f() {
  const pathFile = path.join(__dirname, 'sitemap.xml')
  console.log(pathFile)
  
  await appendFile(pathFile, `
  <?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
  `)
  
  const writeStream = fs.createWriteStream(pathFile, { flags: 'a' })
  const cursor = await MetaTags.find({}).cursor()
  
  cursor
    .on('data', data => {
      //console.log(data)
      const buffer = writeStream.write(`
         <url>
           <loc>https://sito.store${data.link}</loc>
           <lastmod>2020-05-26</lastmod>
         </url>
      `)
      if (!buffer) {
        cursor.pause()
        writeStream.once('drain', () => { cursor.resume() })
      }
    })
}

f()
