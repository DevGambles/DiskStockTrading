import NextAuth from "next-auth";

declare module "next-auth" {

  interface Session {
    user: {
      name: string;
      email: string;
      image: string;
      provider: string;
      role: string;
    };
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  }

  interface JWT extends Record<string, unknown> {
    name?: string | null
    email?: string | null
    picture?: string | null
    sub?: string
    role?: string | null
  }
}