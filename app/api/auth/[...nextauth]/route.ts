import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize callback - credentials:", credentials);
        if (!credentials) {
          console.log("Authorize callback - no credentials provided.");
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          console.log("Authorize callback - user found and password matched:", user.email);
          return { id: user.id, email: user.email, role: user.role }
        } else {
          console.log("Authorize callback - user not found or password mismatch.");
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT callback - token:", token, "user:", user);
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      console.log("Session callback - session:", session, "token:", token);
      if (session.user) {
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/login", // Custom login page
  },
})

export { handler as GET, handler as POST }
