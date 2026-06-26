import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { mongoClient, mongoDb } from '@/lib/mongodb'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { initUserBoards } from '../init-user-boards'

export const auth = betterAuth({
  database: mongodbAdapter(mongoDb, { client: mongoClient }),
  emailAndPassword: { enabled: true },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (!user.id) return
          await initUserBoards(user.id)
        },
      },
    },
  },
})

export const getSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return session
}

export const signOut = async () => {
  const result = await auth.api.signOut({
    headers: await headers(),
  })

  if (result.success) {
    redirect('/sign-in')
  }
}
