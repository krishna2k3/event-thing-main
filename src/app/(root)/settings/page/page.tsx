import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Page, pages } from "@/lib/db/schema/page";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { Link as LinkIcon } from "lucide-react";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { FC } from "react";
import Link from "next/link";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getAuthSession();

  let yourPages: Page[] | undefined;

  if (session?.user) {
    if (session.user.email) {
      yourPages = await db.query.pages.findMany({
        where: eq(pages.moderatorEmail, session.user.email),
      });
    } else {
      <h1>You dont have an valid email</h1>;
    }
  } else {
    redirect("/sign-in");
  }
  return (
    <div>
      <Card className="w-[400px] h-min">
        <CardHeader>
          <div className="flex flex-col">
            <p className="text-md">Your pages</p>
            <p className="text-small text-default-500">
              {yourPages?.length} page
              {yourPages && (yourPages.length > 1 ? "s" : "")}
            </p>
          </div>
        </CardHeader>
        <Separator />
        {yourPages &&
          yourPages.map((page) => (
            <div key={page.id}>
              <CardContent className="flex flex-row justify-between p-6">
                <div className="flex items-center gap-3">
                  <img
                    className="h-16 w-16 object-cover rounded-sm"
                    alt={page.name + " logo"}
                    src={
                      page.pageImageUrl
                        ? page.pageImageUrl
                        : "https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                    }
                  />
                  <div className="flex flex-col">
                    <p className="text-md">{page.name}</p>
                    <p className="text-small text-default-500">
                      <Link href={`/settings/page/${page.id}`} className="flex items-center justify-center underline">
                        <LinkIcon className="h-4"/>
                        page/{page.id}
                      </Link>
                    </p>
                  </div>
                </div>
              </CardContent>
              <Separator />
            </div>
          ))}
        <CardFooter>Some footer text</CardFooter>
      </Card>
    </div>
  );
};

export default page;
