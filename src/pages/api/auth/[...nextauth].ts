import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import {fauna} from '../../../services/fauna'
import {query as q} from 'faunadb'

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  // jwt:{
  //   signingKey: process.env.JWT_SIGNKEY,
  // },
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      const {email} = user

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              {data: {email}}
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )
        return true
      }catch{
        return false
      } 
    },
  }
}

export default NextAuth(authOptions)