import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateCode(): string {
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return code
}

export const create = mutation({
  handler: async (ctx) => {
    let code: string
    let exists = true
    do {
      code = generateCode()
      const existing = await ctx.db.query('sessions').withIndex('by_code', (q) => q.eq('code', code)).first()
      exists = existing !== null
    } while (exists)

    await ctx.db.insert('sessions', { code, createdAt: Date.now() })
    return code
  },
})

export const validate = mutation({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const session = await ctx.db.query('sessions').withIndex('by_code', (q) => q.eq('code', code)).first()
    return session ? { code: session.code, createdAt: session.createdAt } : null
  },
})

export const join = query({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const session = await ctx.db.query('sessions').withIndex('by_code', (q) => q.eq('code', code)).first()
    if (!session) return null
    return { code: session.code, createdAt: session.createdAt }
  },
})
