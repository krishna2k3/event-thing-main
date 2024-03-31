"use client";
import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "../ui/DropdownMenu";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { Session } from "next-auth";

interface UserAccountNavProps {
  session: Session | null;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ session }) => {
  const router = useRouter();
  const logoutHandler = async () => {
    // await axios(CSRBaseUrl + "authenticate/logout/", {
    //   withCredentials: true,
    //   method: "post",
    // });

    toast("Success", {
      description: "You were logged out successfully.",
    });
    // console.log("inDevEnv", inDevEnvironment);
    router.push("/login");
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
