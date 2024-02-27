"use client";

import { login, registerUser } from "@/actions";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FormInputs = {
  name: string;
  email: string;
  password: string;
};

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const [errorMessage, setErrorMessage] = useState("");

  const onSubmint: SubmitHandler<FormInputs> = async (data) => {
    setErrorMessage("");

    const { name, email, password } = data;
    const res = await registerUser(name, email, password);
    if (!res.ok) {
      setErrorMessage(res.message);
      return;
    }   
    await login(email.toLocaleLowerCase(), password);
    window.location.replace('/');
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmint)} className="flex flex-col">
        <label htmlFor="email">Nombre completo</label>
        <input
          className={clsx("px-5 py-2 border bg-gray-200 rounded mb-5", {
            "border-red-500": errors.name?.type === "required",
          })}
          type="text"
          {...register("name", { required: true })}
        />
        {errors.name?.type === "required" && (
          <span
            className={clsx({
              "text-red-500 mb-5": errors.name?.type === "required",
            })}
          >
            El nombre es requerido
          </span>
        )}

        <label htmlFor="email">Correo electrónico</label>
        <input
          className="px-5 py-2 border bg-gray-200 rounded mb-5"
          type="email"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email?.type === "required" && (
          <span
            className={clsx({
              "text-red-500 mb-5": errors.email?.type === "required",
            })}
          >
            El correo electrónico es requerido
          </span>
        )}
        <label htmlFor="email">Contraseña</label>
        <input
          className={clsx("px-5 py-2 border bg-gray-200 rounded mb-5", {
            "border-red-500": errors.password,
          })}
          type="password"
          {...register("password", { required: true, minLength: 6 })}
        />
        {errors.password?.type === "required" && (
          <span
            className={clsx({
              "text-red-500 mb-5": errors.password?.type === "required",
            })}
          >
            La contraseña es requerida
          </span>
        )}

        <span className="text-red-500 mb-2">{errorMessage} </span>

        <button className="btn-primary">Crear cuenta</button>

        {/* divisor l ine */}
        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-500"></div>
          <div className="px-2 text-gray-800">O</div>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>

        <Link href="/auth/login" className="btn-secondary text-center">
          Ingresar
        </Link>
      </form>
    </>
  );
};
