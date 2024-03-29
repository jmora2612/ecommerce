"use server";

import { signIn } from "@/auth.config";
import { sleep } from "@/utils";
import { AuthError } from "next-auth";

// ...

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    // await sleep(2);
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirect: false,
    });

    return "Success";
  } catch (error) {
    return "Crendeciales invalidas";
  }
}

export const login = async(email:string, password:string)=>{
  try {
    await signIn("credentials", {email, password});
    return { ok:true}
  } catch (error) {
    return {ok:false, message:'No se pudo iniciar sesion'}
  }
}
