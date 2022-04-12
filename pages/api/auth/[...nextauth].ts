import { NextApiHandler } from 'next';
import NextAuth, { SessionStrategy } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from 'next-auth/jwt';
import jwt from 'jsonwebtoken';
import prisma from '../../../lib/prisma';
import { getCookie } from 'cookies-next';

const authHandler: NextApiHandler = (req, res) => {
    const colorScheme = getCookie('mantine-color-scheme', { req, res }) || 'light';

    const options = {
        providers: [
            CredentialsProvider({
                // The name to display on the sign in form (e.g. "Sign in with...")
                name: "Credentials",
                // The credentials is used to generate a suitable form on the sign in page.
                // You can specify whatever fields you are expecting to be submitted.
                // e.g. domain, username, password, 2FA token, etc.
                // You can pass any HTML attribute to the <input> tag through the object.
                credentials: {
                  username: { label: "Username", type: "text", placeholder: "jsmith" },
                  password: {  label: "Password", type: "password" }
                },
                async authorize(credentials, req) {
                  // Add logic here to look up the user from the credentials supplied
                  const user = { id: 1, name: "J Smith", email: "jsmith@example.com" }
            
                  if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                    return user
                  } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null
            
                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                  }
                },
            })
        ],
        session: {
          strategy: "jwt" as SessionStrategy,
        },
        jwt: {
          async encode(params: {
            token: JWT
            secret: string
            maxAge: number
          }): Promise<string> {
            // return a custom encoded JWT string
            return jwt.sign(params.token, params.secret);
          },
          async decode(params: {
            token: string
            secret: string
          }): Promise<JWT | null> {
            // return a `JWT` object, or `null` if decoding failed
            return jwt.verify(params.token, params.secret) as JWT;
          },
        },
        adapter: PrismaAdapter(prisma),
        pages: {
            signIn: "/auth/signin"
        },
        theme: {
            colorScheme: colorScheme as "auto" | "dark" | "light",
            logo: "https://www.reggegroep.nl/images/logo/Reggegroep_tweeluik_plaatsnamen_horizontaal.png",
        }
    };

    NextAuth(req, res, options)
}
export default authHandler;