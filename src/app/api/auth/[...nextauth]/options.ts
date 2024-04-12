import prismaClient from '@/lib/prisma';
import { UserModel } from '@/models/User';
import { Session, TokenPayload, comparePassword } from '@/util/Authenticate';
import { JWT_SECRET_KEY } from '@/util/Config';
import { MEMBERSHIP_STATE } from '@/util/Constants';
import Database from '@/util/MongoHelper';
import BadRequest from '@/util/responses/BadRequest';
import InvalidEmail from '@/util/responses/InvalidEmail';
import UserBanned from '@/util/responses/UserBanned';
import UserEmailUnverified from '@/util/responses/UserEmailUnverified';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextAuthOptions, User } from 'next-auth';
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
            async authorize(credentials, req) {
                try {
                    const email = credentials!.email.toLowerCase();
                    const password = credentials!.password;

                    await Database.connect();
                    const user = await UserModel.findOne({ email }).catch(() => { throw new BadRequest(); });
                    if(!user) throw new InvalidEmail();

                    await comparePassword(password, user.password);
                    
                    if(user.accessLevel === MEMBERSHIP_STATE.BANNED) throw new UserBanned();
                    if(!user.emailVerified) throw new UserEmailUnverified();
                    
                    return {
                        email: user.email,
                        name: `${user.firstName} ${user.lastName}`,
                        id: user._id
                    };
                }catch (e){
                    console.error(e)
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt(params) {
            if(params.user) {
                const email = params.user.email;
                if(email) {
                    await Database.connect();
                    const user = await UserModel.findOne({ email }).catch(() => { throw new BadRequest(); });

                    params.token.accessLevel = user.accessLevel;
                    params.token._id = user._id;
                } 
            }
          return params.token;
        }
    },
    pages: {
        signIn: '/log-in',
        newUser: '/register'
    },
    secret: JWT_SECRET_KEY
}

export default authOptions; 