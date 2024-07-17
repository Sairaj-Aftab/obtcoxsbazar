"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiMenu, BiX } from "react-icons/bi";
import { useState } from "react";

const Nav = () => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const pathName = usePathname();
  return (
    <>
      {pathName === "/display" ? null : (
        <header className="bg-primary-color">
          <div className="container mx-auto flex items-center flex-col">
            {pathName === "/" && (
              <div className="z-50 flex flex-col items-center">
                <h1 className="text-white text-3xl font-bold">
                  Online Bus Terminal
                </h1>
                <span className="text-white text-xl font-semibold">
                  Cox's Bazar
                </span>
              </div>
            )}
            {/* Desktop Menu */}
            <nav className="md:flex hidden space-x-4 py-4">
              <Link
                href="/"
                className={`text-base font-medium text-white border border-transparent ${
                  pathName === "/" && "border-white"
                } hover:border-white py-1 px-2 rounded-sm`}
              >
                Home
              </Link>
              <Link
                href="/all-bus-services"
                className={`text-base font-medium text-white border border-transparent ${
                  pathName === "/all-bus-services" && "border-white"
                } hover:border-white py-1 px-2 rounded-sm`}
              >
                All Bus Services
              </Link>
              <Link
                href="/all-bus-schedules"
                className={`text-base font-medium text-white border border-transparent ${
                  pathName === "/all-bus-schedules" && "border-white"
                } hover:border-white py-1 px-2 rounded-sm`}
              >
                All Bus Schedules
              </Link>
              <Link
                href="http://coxscab.com/apex/osman_erp/r/coxscab//transport-permission"
                target="_blank"
                className={`text-base font-medium text-white border border-transparent hover:border-white py-1 px-2 rounded-sm`}
              >
                Tourist Bus Entry Permission
              </Link>
              <Link
                href="/about"
                className={`text-base font-medium text-white border border-transparent ${
                  pathName === "/about" && "border-white"
                } hover:border-white py-1 px-2 rounded-sm`}
              >
                About
              </Link>
              <Link
                href="#"
                className={`text-base font-medium text-white border border-transparent ${
                  pathName === "/about" && "border-white"
                } hover:border-white py-1 px-2 rounded-sm`}
              >
                Contact Us
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
            {/* Mobile Nav */}
            <div className="z-50 py-2 flex md:hidden w-full px-5 justify-between items-center">
              <h1 className="text-5xl text-white font-bold">Logo Here</h1>
              {open ? (
                <BiX
                  className="text-white"
                  size={35}
                  onClick={() => setOpen(!open)}
                />
              ) : (
                <BiMenu
                  className="text-white"
                  size={35}
                  onClick={() => setOpen(!open)}
                />
              )}
            </div>
            <nav
              className={`flex flex-col  gap-3
        md:hidden bg-primary-color fixed w-full top-0 overflow-y-auto bottom-0 ${
          pathName === "/" ? "pt-32" : "pt-12"
        } pb-3 px-4 duration-500 ${open ? "left-0" : "left-[-100%]"}
        `}
            >
              <Link
                onClick={() => setOpen(!open)}
                href="/"
                className={`text-base font-medium text-white border border-transparent ${
                  pathName === "/" && "border-white"
                } hover:border-white py-1 px-2 rounded-sm`}
              >
                Home
              </Link>
              <Link
                onClick={() => setOpen(!open)}
                href="/all-bus-services"
                className={`text-base font-medium text-white border border-transparent ${
                  pathName === "/all-bus-services" && "border-white"
                } hover:border-white py-1 px-2 rounded-sm`}
              >
                All Bus Services
              </Link>
              <Link
                onClick={() => setOpen(!open)}
                href="/all-bus-schedules"
                className={`text-base font-medium text-white border border-transparent ${
                  pathName === "/all-bus-schedules" && "border-white"
                } hover:border-white py-1 px-2 rounded-sm`}
              >
                All Bus Schedules
              </Link>
              <Link
                onClick={() => setOpen(!open)}
                href="http://coxscab.com/apex/osman_erp/r/coxscab//transport-permission"
                className={`text-base font-medium text-white border border-transparent hover:border-white py-1 px-2 rounded-sm`}
              >
                Tourist Bus Entry Permission
              </Link>
              <Link
                onClick={() => setOpen(!open)}
                href="/about"
                className={`text-base font-medium text-white border border-transparent ${
                  pathName === "/about" && "border-white"
                } hover:border-white py-1 px-2 rounded-sm`}
              >
                About
              </Link>
              <Link
                onClick={() => setOpen(!open)}
                href="#"
                className={`text-base font-medium text-white border border-transparent ${
                  pathName === "/about" && "border-white"
                } hover:border-white py-1 px-2 rounded-sm`}
              >
                Contact Us
              </Link>
              {!session && (
                <Link
                  onClick={() => setOpen(!open)}
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
                  onClick={() => setOpen(!open)}
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
