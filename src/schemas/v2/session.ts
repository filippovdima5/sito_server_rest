import { Document, Model, Schema } from 'mongoose'
import { Context } from 'koa'
import { RouterContext } from 'koa-router'
import { SexId } from '../../types'
import { mongoose } from '../../libs/mongoose'


export const ONE_WEEK_MILLISECONDS = 1000 * 60 * 60 * 24 * 7


export interface SessionType {
  sex_id?: SexId,
  like_products: Array<string>,
}

export interface SessionInterface extends Document, SessionType {}
export interface SessionModel extends Model<SessionInterface>{
  setIdSession(ctx: Context): Promise<string>,
}

const SessionSchema = new Schema({
  sex_id: Number,
  like_products: [String],
  expires: { type: Date, expires: ONE_WEEK_MILLISECONDS / 1000 }
}, {
  timestamps: true
})



SessionSchema.statics.setIdSession = async function getIdSession(ctx: RouterContext): Promise<string> {
  const cookie = ctx.cookies.get('session-sito')
  
  if (cookie) {
    const checkSession = await Session.findOne({ _id: cookie })
    if (checkSession) return cookie
  }
  
  const newSession = new Session({})
  return newSession.save()
    .then(res => {
      ctx.cookies.set('session-sito', res._id, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_WEEK_MILLISECONDS)
      })
      return res._id
    })
}

export const Session = mongoose.model<SessionInterface, SessionModel>('Session', SessionSchema)
