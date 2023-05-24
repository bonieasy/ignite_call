import { NextApiRequest, NextApiResponse, NextPageContext } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'
import { PrismaAdapter } from '../../../lib/auth/prisma-adapter'

export function buildNextAuthOptions(
  req: NextApiRequest | NextPageContext['req'],
  res: NextApiResponse | NextPageContext['res'],
): NextAuthOptions {
  return {
    adapter: PrismaAdapter(req, res),

    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        authorization: {
          params: {
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code',
            scope:
              'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar',
          },
        },
        //metodo para ter acesso ao perfil, google retorna para nos
        profile(profile: GoogleProfile) {
          return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            username: '',
            avatar_url: profile.picture,
          }
        },
      }),
    ],
    callbacks: {
      //funcao que dispara quando user autentica o acesso
      async signIn({ user, account, profile, email, credentials }) {
        if (
          !account?.scope?.includes('https://www.googleapis.com/auth/calendar')
        ) {
          return '/register/connect-calendar/?error=permission'
        }

        return true
      },
      async redirect({ url, baseUrl }) {
        return '/register/connect-calendar'
      },
      async session({ session, user, token }) {
        return {
          ...session, //para pegar tudo dentro do session
          user,
        }
      },
    },
  }
}
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, buildNextAuthOptions(req, res))
}
