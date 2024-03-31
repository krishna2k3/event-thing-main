"use client";
import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/DropdownMenu";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { Session } from "next-auth";
import {signOut} from "next-auth/react"
interface UserAccountNavProps {
  session: Session | null;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ session }) => {
  const router = useRouter();
  const logoutHandler = async () => {
    signOut({
      callbackUrl: `${window.location.origin}/sign-in`,
    });

    toast("Success", {
      description: "You were logged out successfully.",
    });
    // console.log("inDevEnv", inDevEnvironment);
    router.push("/sign-in");
    router.refresh();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="bg-slate-950">
          <AvatarImage
            src={session?.user.image ? session.user.image : ""}
            alt=""
          />
          <AvatarFallback>
            {session?.user.name && session?.user.name[0]}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        {session?.user && (
          <DropdownMenuItem>
            <Link href="/user-settings">{session.user.name}</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/settings/org">Manage Organisation</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings/page">Manage Page</Link>
        </DropdownMenuItem>

        {/* <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Manage</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>
                <Link href="/settings/org">Manage Organisation</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings/page">Manage Page</Link>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub> */}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            logoutHandler();
          }}
          className="cursor-pointer"
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
