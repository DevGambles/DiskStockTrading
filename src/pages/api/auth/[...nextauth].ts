import NextAuth, { Account, Profile, User, Session, JWT } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from "next-auth/providers/github"
import TwitterProvider from "next-auth/providers/twitter"
import FacebookProvider from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials"

import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
// import { JWT } from 'next-auth/jwt'
import { Adapter } from 'next-auth/adapters'
import bcrypt from "bcryptjs"
import UserModel from '@/models/userModel'
import connectDb from '@/utils/connectDb'
import { randomBytes, randomUUID } from 'crypto'

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Name", type: "text"},
        password: { label: "Password", type: "password",},
      },
      async authorize(credentials) {
        await connectDb()
        const user = await UserModel.findOne({ email: credentials!.email })
        if (!user) {
          throw new Error("Email is not registered.")
        }
        const isPasswordCorrect = await bcrypt.compare(
          credentials!.password,
          user.password
        )
        if (!isPasswordCorrect) {
          throw new Error("Password is incorrect.")
        }
        return user
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string
    }),
    GitHubProvider({
        clientId: process.env.GITHUB_ID as string,
        clientSecret: process.env.GITHUB_SECRET as string
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string
    })
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  session: {
    strategy: "jwt",
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 2 * 60 * 60, // 24 hours
    
    // The session token is usually either a random UUID or string, however if you
    // need a more customized session token string, you can define your own generate function.
    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString("hex")
    }
  },
  pages: {
    signIn: "/auth"
  },
  callbacks: {
    // generate jwt auth token
    async jwt({ token, user, account, profile, isNewUser, session } : {
      token: JWT, 
      user?: User, 
      account?: Account | null | undefined,
      profile?: Profile | undefined,
      isNewUser?: boolean | undefined,
      session?: Session | undefined
    }) {
      if(user){
        token.provider = account?.provider
        token.role = user.role
      }
      return token;
    },
    async session({ session, token } : {session: any, token: JWT}) {
      if( session.user){
        session.user.provider = token.provider;
        session.user.role = token.role;
      }
      return session
    },
  }
})