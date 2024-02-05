import Link from "next/link";
import { FC } from "react";
import { Button, buttonVariants } from "./ui/Button";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";
import { Icons } from "./Icons";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = async ({}) => {
  const session = await getAuthSession();
  return (
    <div className="sticky top-0 inset-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10]">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between">
        <Link href="/" className="flexitems-center">
          <Icons.logo className="" />
        </Link>

        {session ? (
          <UserAccountNav session={session} />
        ) : (
          <Button>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
