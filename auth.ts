import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

const ADMIN_EMAIL = "khanalmanish984@gmail.com"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: "select_account" } },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }) {
      return user.email === ADMIN_EMAIL
    },

    async jwt({ token, user }) {
      // `user` is only present on the FIRST sign-in callback.
      // On subsequent requests, only `token` is available.
      // Everything you need downstream MUST be written into `token` here.
      if (user) {
        token.id = user.id ?? token.sub ?? ""
        token.role = "ADMIN"
      }
      return token
    },

    async session({ session, token }) {
      // token.role persists across requests because it was set above.
      // Without the type augmentation in next-auth.d.ts, TypeScript
      // will error here — that file makes these assignments valid.
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: { signIn: "/login", error: "/login" },
})
