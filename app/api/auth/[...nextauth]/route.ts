import { signJwtAccessToken } from "@/lib/jwt";
import NextAuth, { Session as NextAuthSession } from "next-auth";
import { User as NextAuthUser } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import axios from "axios";
import { checkIfUserExist, createUser } from "@/routes/user-routes";

export interface MySession extends NextAuthSession {
  userToken?: string;
}
interface User extends NextAuthUser {
  userId?: string;
}

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User;
      account: any;
      profile?: any;
    }) {
      const isOAuth = account !== null; // true if OAuth, false if email and password. Change the logic later
      console.log({ email: profile?.email });

      const response = await checkIfUserExist(profile?.email as string);

      if (response && response.data?.userExist === true) {
        user.userId = response.data?._id;
        return true;
      } else {
        console.log({ profile, user });

        const data = {
          name: profile?.name,
          email: profile?.email,
          profilePic: profile?.image || (user?.image as string),
          verified: isOAuth, // true if OAuth, false if email and password
        };
        const response = await createUser(data);
        user.userId = response.data?._id;
        return true;
      }
    },
    async jwt({
      token,
      user,
      account,
    }: {
      token: any;
      user: User;
      account: any;
    }) {
      if (account) {
        console.log(user, token, account);
        // call the signToken function which returns a JWT token
        const jwtToken = signJwtAccessToken({
          userId: user?.userId as string,
          email: user?.email as string,
        });
        console.log({ jwtToken });

        token.userToken = jwtToken;
      }
      // the token object is passed done to the session call back for persistence
      return token;
    },

    async session({
      session,
      token,
      user,
    }: {
      session: MySession;
      token: any;
      user: any;
    }) {
      // Send properties to the client, like an access_token from a provider.
      session.userToken = token.userToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
