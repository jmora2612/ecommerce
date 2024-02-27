"use client";

import { titleFont } from "@/config/fonts";
import { useCartStore, useUIStore } from "@/store";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";

export const TopMenu = () => {
  const openMenu = useUIStore((state) => state.openSideMenu);
  const {itemsInCart} = useCartStore((state) => state.getSummaryInformation());

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
  }, [])
  

  return (
    <nav className="flex px-5 justify-between items-center w-full">
      <div>
        <Link href={"/"}>
          <span className={`${titleFont.className} antialiased font-bold`}>
            Teslo
          </span>
          <span> | Shop</span>
        </Link>
      </div>

      <div className="hidden sm:block">
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href={"/gender/men"}
        >
          Hombres
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href={"/gender/women"}
        >
          Mujeres
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href={"/gender/kid"}
        >
          Niños
        </Link>
      </div>

      <div className="flex items-center">
        <Link href="/search" className="mx-2">
          <IoSearchOutline className="w-5 h-5" />
        </Link>
        <Link href={loading &&
          itemsInCart === 0 ? "/empty" :"/cart"
          
          } className="mx-2">
          <div className="relative">
            {(loading && itemsInCart > 0) && (
              <span className="fade-in absolute text-xs px-1 rounded-full font-bold bg-blue-700 text-white -right-2 -top-2">
                {itemsInCart}
              </span>
            )}

            <IoCartOutline className="w-5 h-5" />
          </div>
        </Link>
        <button
          onClick={() => openMenu()}
          className="m-2 p2- rounded-md transition-all hover:bg-gray-100"
        >
          Menu
        </button>
      </div>
    </nav>
  );
};
