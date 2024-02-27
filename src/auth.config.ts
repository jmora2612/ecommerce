import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import prisma from "./lib/prisma";
import bcryptjs from 'bcryptjs';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/new-account",
  },

  callbacks:{
    jwt({token, user}){
      if(user) token.data = user
      return token
    },
    session({session, token}){
      session.user = token.data as any;
      return session
    }
  },

  //con esto podemos usar signin como los de google, apple
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        //Buscar usuario por correo
        const user =await prisma.user.findFirst({
          where: {
            email:email.toLowerCase(),
          },
        });

        if (!user) return null;

        //Comparar contraseña
        if(!bcryptjs.compareSync(password, user.password)) return null;

        // regresar usuario sin password

        const{password: _, ...res} = user        
        return res;
      },
    }),
  ],
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);
