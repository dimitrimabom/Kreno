"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation.js";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user } = useKindeBrowserClient();
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [user]);

  const isActive = (link: string) => pathname === link;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed top-0 w-full backdrop-blur-sm">
      <nav className="md:px-[10%] p-5 border-b border-base-200 w-full bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold flex items-center">
              <div>
                <Image
                  src="/icon.png"
                  width={500}
                  height={500}
                  alt="Kreno logo"
                  className="w-6 h-6 md:w-8 md:h-8"
                />
              </div>
              <span>Kreno</span>
            </h1>

            {loading ? (
              <div>
                <Skeleton className="h-[20px] w-[100px] rounded-full" />
              </div>
            ) : (
              <div>
                <Badge variant="outline">{user?.email}</Badge>
              </div>
            )}
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href={"/create-company"}>
              <Button
                variant="link"
                className={`font-bold ${
                  isActive("/create-company")
                    ? "text-primary"
                    : "text-accent-foreground"
                }`}
              >
                Vos Entreprises
              </Button>
            </Link>
            <Link href={"/dashboard"}>
              <Button
                variant="link"
                className={`font-bold ${
                  isActive("/dashboard")
                    ? "text-primary"
                    : "text-accent-foreground"
                }`}
              >
                Réserver
              </Button>
            </Link>
          </div>

          <LogoutLink className="hidden md:flex">
            <Button className=" text-[12px]">Déconnexion</Button>
          </LogoutLink>

          <div className="md:hidden">
            <Button variant="ghost" className="mb-2" onClick={toggleMenu}>
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </nav>

      {isMenuOpen ? (
        <div className="md:hidden shadow-lg p-4 rounded-lg space-y-4 flex flex-col mt-3">
          <Link href={"/create-company"}>
            <Button
              variant="link"
              className={`font-bold ${
                isActive("/create-company")
                  ? "text-primary"
                  : "text-accent-foreground"
              }`}
            >
              Vos Entreprises
            </Button>
          </Link>
          <Link href={"/dashboard"}>
            <Button
              variant="link"
              className={`font-bold ${
                isActive("/dashboard")
                  ? "text-primary"
                  : "text-accent-foreground"
              }`}
            >
              Réserver
            </Button>
          </Link>

          <LogoutLink>
            <Button className=" text-[12px]">Déconnexion</Button>
          </LogoutLink>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Navbar;
