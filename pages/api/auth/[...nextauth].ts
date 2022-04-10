import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from "next-auth/providers/google";
import prisma from '../../../lib/prisma';
import { getCookie } from 'cookies-next';

const authHandler: NextApiHandler = (req, res) => {
    const colorScheme = getCookie('mantine-color-scheme', { req, res }) || 'light';

    const options = {
        providers: [
            GoogleProvider({
                clientId: process.env.OAUTH_GOOGLE_CLIENTID,
                clientSecret: process.env.OAUTH_GOOGLE_CLIENTSECRET,
                authorization: {
                    params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                    }
                }
            })
        ],
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

// const options = {
//     providers: [
//         GoogleProvider({
//             clientId: process.env.OAUTH_GOOGLE_CLIENTID,
//             clientSecret: process.env.OAUTH_GOOGLE_CLIENTSECRET,
//             authorization: {
//                 params: {
//                 prompt: "consent",
//                 access_type: "offline",
//                 response_type: "code"
//                 }
//             }
//         })
//     ],
//     adapter: PrismaAdapter(prisma),
//     theme: {
//         colorScheme: "auto" as "auto" | "dark" | "light",
//         logo: "https://www.reggegroep.nl/images/logo/Reggegroep_tweeluik_plaatsnamen_horizontaal.png",
//     }
// };