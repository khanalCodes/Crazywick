import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

const ADMIN_EMAILS = [
  "khanalmanish984@gmail.com",
  "sakarkhatiwada2060@gmail.com",
]

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // 👈 here
      authorization: {
        url: "https://accounts.google.com/o/oauth2/v2/auth",
        params: { hd: "*" },
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async signIn({ user }) {
      const email = user.email ?? ""
      return ADMIN_EMAILS.includes(email)
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = "ADMIN"
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },

  pages: { signIn: "/login", error: "/login" },
})