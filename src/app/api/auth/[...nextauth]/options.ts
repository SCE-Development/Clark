import prismaClient from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import type { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prismaClient) as Adapter,
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text', placeholder: 'poop@sjsu.edu' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials, req) => {
                const user = await prismaClient.user.findFirst({
                    where: {
                        email: credentials?.email,
                        password: credentials?.password,
                    },
                })
                if (user) {
                    return user
                }
                return null
            }
        })
    ],
    pages: {
        signIn: '/login',
        newUser: '/register'
    }
}

export default authOptions; 