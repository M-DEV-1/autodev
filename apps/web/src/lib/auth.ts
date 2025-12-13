
import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
            authorization: {
                params: {
                    scope: 'repo read:user',
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'github') {
                await connectDB();

                try {
                    const githubId = account.providerAccountId;

                    await User.findOneAndUpdate(
                        { githubId },
                        {
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            githubId,
                        },
                        { upsert: true, new: true }
                    );

                    return true;
                } catch (error) {
                    console.error('Error saving user to DB:', error);
                    return false;
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (session.user) {
                await connectDB();
                const dbUser = await User.findOne({ email: session.user.email });
                if (dbUser) {
                    // @ts-ignore
                    session.user.id = dbUser._id.toString();
                    // @ts-ignore
                    session.user.githubId = dbUser.githubId;
                    // @ts-ignore
                    session.accessToken = token.accessToken;
                }
            }
            return session;
        },
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
    },
    pages: {
        signIn: '/',
        error: '/',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
