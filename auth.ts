import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

const ADMIN_EMAILS = [
  "khanalmanish984@gmail.com",
  "sakarkhatiwada2060",
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        url: "https://accounts.google.com/o/oauth2/v2/auth",
        params: {
          hd: "*",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
  async signIn({ user }) {
  const email = user.email ?? "";

  return ADMIN_EMAILS.includes(email);
},
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? token.sub ?? ""
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