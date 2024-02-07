import NextAuth from "next-auth";

declare module "next-auth" {
  interface session {
    user: {
      name: string;
      email: string;
      image: string;
      accessToken: string;
    };
  }
}
