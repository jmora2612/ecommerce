import { titleFont } from "@/config/fonts";
import Link from "next/link";

export const Footer = () => {
  return (
    <div className="flex w-full justify-center text-xs mb-10">
      <Link href="/">
        <span className={`${titleFont.className} font-bold antialiased`}>Teslo </span>
        <span>| shop </span>
        <span>| © {new Date().getFullYear()}</span>
      </Link>
      <Link className="mx-3" href="/">Privacidad & Legal</Link>
      <Link href="/">Ubicaciones</Link>
    </div>
  );
};
