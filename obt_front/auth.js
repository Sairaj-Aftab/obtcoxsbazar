import NextAuth, { CredentialsSignin } from "next-auth";
import axios from "axios";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        paribahanName: { label: "Paribahan Name", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/paribahan/login`,
            {
              paribahanName: credentials.paribahanName,
              password: credentials.password,
            },
            { withCredentials: true }
          );
          if (response.data.user) {
            return response.data.user;
          }
          return null;
        } catch (error) {
          if (error.response) {
            throw new CredentialsSignin(error.response.data.message);
            // throw new Error(error.response.data.message || "Login failed");
          } else if (error.request) {
            throw new CredentialsSignin("No response received from server");
            // throw new Error("No response received from server");
          } else {
            throw new CredentialsSignin("An error occurred while logging in");
            // throw new Error("An error occurred while logging in");
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
