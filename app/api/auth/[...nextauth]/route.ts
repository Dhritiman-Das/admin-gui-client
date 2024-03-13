import { signJwtAccessToken } from "@/lib/jwt";
import NextAuth, { Account, Session, Profile } from "next-auth";
import { User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { checkIfUserExist, createUser } from "@/routes/user-routes";
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { AdapterUser } from "next-auth/adapters";

// interface User extends NextAuthUser {
//   userId?: string;
//   emailVerified: string;
//   role: string;
// }
// export interface MySession extends NextAuthSession {
//   userToken?: string;
// }

const authOptions = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
          verified: Boolean(profile.emailVerified),
        };
      },
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      type: "email",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User | AdapterUser;
      account: Account | null;
      profile?: Profile | undefined;
    }) {
      const isOAuth = account !== null; // true if OAuth, false if email and password. Change the logic later
      const email = profile?.email || user?.email;
      console.log({ user, account, profile, email });
      if (!!!email) {
        throw new Error(
          "The email associated with your authentication account was not found. Please ensure you have a verified email in your authentication account."
        );
      }
      return true;
      // const response = await checkIfUserExist(email);
      // if (response && response.data?.userExist === true) {
      //   user.id = response.data?._id;
      //   return true;
      // } else {
      //   console.log({ profile, user });
      //   const data = {
      //     name: profile?.name || "",
      //     email,
      //     image: profile?.image || (user?.image as string) || "",
      //     verified: isOAuth, // true if OAuth, false if email and password
      //   };
      //   const response = await createUser(data);
      //   user.id = response.data?._id;
      //   return true;
      // }
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
      console.log("jwt Hit", { user, token, account });
      if (user?.email && user?.id) {
        //   console.log(user, token, account);
        //   // call the signToken function which returns a JWT token
        const jwtToken = signJwtAccessToken({
          userId: user?.id as string,
          email: user?.email as string,
        });
        token.userToken = jwtToken;
        console.log({ tokenIz: token.userToken });
      }
      // the token object is passed done to the session call back for persistence
      return token;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: Session;
      token: any;
      user: any;
    }) {
      console.log("session Hit");
      // Send properties to the client, like an access_token from a provider.
      session.userToken = token.userToken;
      console.log({ session });

      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
  // @ts-ignore
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    error: "/auth/error",
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    verifyRequest: "/auth/verify-request",
  },
});

export { authOptions as GET, authOptions as POST };
