import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import KeycloakProvider from "next-auth/providers/keycloak";
import { CustomPrismaAdapter } from '../../../nextauth/custom-prisma-adapter';
import prisma from '../../../lib/prisma';
import { getCookie } from 'cookies-next';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {

  const colorScheme = getCookie('mantine-color-scheme', { req, res }) || 'light';

  return await NextAuth(req, res, {
    providers: [
      KeycloakProvider({
        clientId: process.env.KEYCLOAK_CLIENT,
        clientSecret: process.env.KEYCLOAK_SECRET,
        issuer: process.env.KEYCLOAK_ISSUER,
      })
    ],
    adapter: CustomPrismaAdapter(prisma),
    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
        error: "/auth/error"
    },
    callbacks: {
      async redirect({ url, baseUrl }) {
        return baseUrl
      }
    },
    theme: {
        colorScheme: colorScheme as "auto" | "dark" | "light",
    }
  })
}