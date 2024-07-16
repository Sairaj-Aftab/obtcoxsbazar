"use client";
import { busAuthData } from "@/lib/features/busAuth/busAuthSlice";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import img from "@/public/image/black_logo1.png";

const Nav = () => {
  const { data: session } = useSession();
  const pathName = usePathname();
  return (
    <>
      {pathName === "/display" ? null : (
        <header className="bg-primary-color">
          <div className="container mx-auto flex items-center flex-col">
            {pathName === "/" && (
              <div className="flex flex-col items-center">
                <h1 className="text-white text-3xl font-bold">
                  Online Bus Terminal
                </h1>
                <span className="text-white text-xl font-semibold">
                  Cox's Bazar
                </span>
              </div>
            )}
            <nav className="flex space-x-4 py-4">
              <Link
                href="/"
                className={`text-base font-medium text-white border border-transparent ${
                  pathName === "/" && "border-white"
                } hover:border-white py-1 px-2 rounded-sm`}
              >
                Home
              </Link>

              {/* <Link
                href="#"
                className="text-base font-medium text-white border border-transparent hover:border-white py-1 px-2 rounded-sm"
              >
                Where to Go
              </Link> */}
              <Link
                href="/all-bus-services"
                className={`text-base font-medium text-white border border-transparent ${
                  pathName === "/all-bus-services" && "border-white"
                } hover:border-white py-1 px-2 rounded-sm`}
              >
                All Bus Services
              </Link>
              <Link
                href="/about"
                className={`text-base font-medium text-white border border-transparent ${
                  pathName === "/about" && "border-white"
                } hover:border-white py-1 px-2 rounded-sm`}
              >
                About
              </Link>
              {!session && (
                <Link
                  href="/login"
                  className={`text-base font-medium text-white border border-transparent ${
                    pathName === "/login" && "border-white"
                  } hover:border-white py-1 px-2 rounded-sm`}
                >
                  Login
                </Link>
              )}
              {session && (
                <Link
                  href="/profile"
                  className={`text-base font-medium text-white border border-transparent ${
                    pathName === "/profile" && "border-white"
                  } hover:border-white py-1 px-2 rounded-sm`}
                >
                  Profile
                </Link>
              )}
            </nav>
          </div>
        </header>
      )}
    </>
  );
};

export default Nav;
