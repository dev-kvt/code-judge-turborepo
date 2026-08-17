"use client";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import logo from "@/../public/images/logo.png";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const NavbarProfile = dynamic(() => import("./navbar-profile"), { ssr: false });

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(" ");
}

import { useRole } from "@/providers/role-provider";

export default function Navbar() {
  const { role } = useRole();
  const navigation = [
    { name: "Overview", href: "/main", current: false },
    { name: "Assignments", href: "/", current: true },
    { name: "Doubt Board", href: "/doubts", current: false },
  ];

  if (role === "TEACHER") {
    navigation.push({ name: "Post Assignment", href: "/add-problem", current: false });
  }

  return (
    <Disclosure as="nav" className="border-default-bottom">
      {({ open }) => (
        <>
          <div className="mx-auto px-2 sm:px-6 lg:px-8 max-h-[63px]">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link href={"/main"}>
                    <div className="flex gap-3 align-middle items-center">
                      <Image src={logo} alt="logo" className="h-8 w-8" />
                      <h1 className="font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                        <span className="hidden lg:inline text-white text-base xl:text-lg">AI-Powered Code Grading & Doubt Resolution Portal</span>
                        <span className="hidden sm:inline lg:hidden text-white text-base">AI Code & Doubt Portal</span>
                        <span className="sm:hidden text-white text-sm">AI Portal</span>
                      </h1>
                    </div>
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item, index) => {
                      item.current = usePathname() === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "rounded-md px-3 py-2 text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}

                <NavbarProfile />
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
