import mongoose from 'src/libs/mongoose/index'
// @ts-ignore
import beautifyUnique  from 'mongoose-beautiful-unique-validation'
import config from 'config'

mongoose.set('debug', config.get('mongodb.debug'));
mongoose.plugin(beautifyUnique);
mongoose.connect(config.get('mongodb.uri') as string, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true});

export {mongoose}
