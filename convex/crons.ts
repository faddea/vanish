import { cronJobs } from 'convex/server'
import { internal } from './_generated/api'
import { internalMutation } from './_generated/server'

const crons = cronJobs()

crons.interval('cleanup-expired', { hours: 1 }, internal.crons.cleanupExpired)

export default crons

export const cleanupExpired = internalMutation({
  handler: async (ctx) => {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000

    const oldFiles = await ctx.db.query('files').collect()
    for (const file of oldFiles) {
      if (file.createdAt < cutoff) {
        await ctx.storage.delete(file.storageId)
        await ctx.db.delete(file._id)
      }
    }

    const oldSessions = await ctx.db.query('sessions').collect()
    for (const session of oldSessions) {
      if (session.createdAt < cutoff) {
        const sessionFiles = await ctx.db.query('files').withIndex('by_session', (q) => q.eq('sessionCode', session.code)).collect()
        for (const f of sessionFiles) {
          await ctx.storage.delete(f.storageId)
          await ctx.db.delete(f._id)
        }
        await ctx.db.delete(session._id)
      }
    }
  },
})
