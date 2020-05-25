import mongoose from 'mongoose'
// @ts-ignore
import beautifyUnique  from 'mongoose-beautiful-unique-validation'
import config from 'config'


mongoose.set('debug', config.get('mongodb.debug'))
mongoose.plugin(beautifyUnique)


const options: mongoose.ConnectionOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
  
  autoIndex: true
}


mongoose.connect(config.get('mongodb.uri') as string, options).then(() => {
  console.info('Connected to mongodb.')
})

export { mongoose }
