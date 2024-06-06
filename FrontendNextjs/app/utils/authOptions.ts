import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { AuthOptions } from 'next-auth'
import prisma from '../libs/prismadb'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { MySession } from '@/app/types'

export const authOptions: AuthOptions = {
  //@ts-ignore
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }
        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase(),
            },
          })
          if (!user || !user?.hashedPassword) {
            throw new Error('Invalid credentials')
          }
          const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword)
          if (!isCorrectPassword) throw new Error('Invalid credentials')

          return user
        } catch (error) {
          console.log('Error::', error)
          return null
        }
      },
    }),
  ],
  debug: process.env.NODE_ENV !== 'development',
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      // Assign the userid and role from the jwt callback below
      const mySession: MySession = session

      if (mySession?.user) {
        mySession.user.id = token.uid as string
        if (token.role) mySession.user.role = token.role as 'admin' | 'user'
        if (!token.role) mySession.user.role = 'user'
      }
      return mySession
    },
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id
        //@ts-ignore
        token.role = user.role
      }
      return token
    },
  },
}
