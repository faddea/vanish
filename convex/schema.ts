import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  sessions: defineTable({
    code: v.string(),
    createdAt: v.number(),
  }).index('by_code', ['code']),

  files: defineTable({
    sessionCode: v.string(),
    name: v.string(),
    size: v.number(),
    type: v.string(),
    storageId: v.id('_storage'),
    downloaded: v.boolean(),
    createdAt: v.number(),
  }).index('by_session', ['sessionCode']),
})
