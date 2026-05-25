import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl()
  },
})

export const save = mutation({
  args: {
    sessionCode: v.string(),
    name: v.string(),
    size: v.number(),
    type: v.string(),
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('files', {
      sessionCode: args.sessionCode,
      name: args.name,
      size: args.size,
      type: args.type,
      storageId: args.storageId,
      downloaded: false,
      createdAt: Date.now(),
    })
  },
})

export const list = query({
  args: { sessionCode: v.string() },
  handler: async (ctx, { sessionCode }) => {
    const files = await ctx.db.query('files').withIndex('by_session', (q) => q.eq('sessionCode', sessionCode)).collect()
    return await Promise.all(files.map(async (f) => ({
      id: f._id,
      storageId: f.storageId,
      name: f.name,
      size: f.size,
      type: f.type,
      url: await ctx.storage.getUrl(f.storageId),
      downloaded: f.downloaded,
      createdAt: f.createdAt,
    })))
  },
})

export const markDownloaded = mutation({
  args: { fileId: v.id('files') },
  handler: async (ctx, { fileId }) => {
    await ctx.db.patch(fileId, { downloaded: true })
  },
})

export const remove = mutation({
  args: { fileId: v.id('files') },
  handler: async (ctx, { fileId }) => {
    const file = await ctx.db.get(fileId)
    if (!file) return
    await ctx.storage.delete(file.storageId)
    await ctx.db.delete(fileId)
  },
})
