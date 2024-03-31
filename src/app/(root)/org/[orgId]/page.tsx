import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Page, pages } from "@/lib/db/schema/page";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { eq } from "drizzle-orm";
import { FC } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { orgs } from "@/lib/db/schema/org";
import PageListViewItem from "@/components/Page/PageListViewItem";

interface pageProps {
  params: {
    orgId: string;
  };
}

const Editor = dynamic(() => import("@/components/Editor/Editor"), {
  ssr: false,
});

const page: FC<pageProps> = async ({ params }) => {
  const { orgId } = params;

  const session = await getAuthSession();
  const currOrg = await db.query.orgs.findFirst({
    where: eq(orgs.id, orgId),
    with: { pages: true },
  });

  let orgPages: Page[] = [];
  if (currOrg) {
    orgPages = await db.query.pages.findMany({
      where: eq(pages.orgId, currOrg.id),
    });
  }

  return (
    <div className="flex gap-4">
      <div className="flex gap-4 flex-col w-[50%]">
        <Card className="w-[400px] h-min">
          <CardHeader>
            <img
              className="h-10 w-10 object-cover"
              alt={currOrg?.name || "" + " logo"}
              src={
                currOrg
                  ? currOrg.orgImageUrl
                  : "https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
              }
            />
            {currOrg?.name}
          </CardHeader>
          <Separator />
          <CardContent>Description: {currOrg?.desc}</CardContent>
          <Separator />
        </Card>
      </div>
      <div className="w-[50%] flex flex-col gap-4">
        <h1 className="text-xl">Pages</h1>
        <div className="flex flex-col gap-4">
          {orgPages.map((page, index) => (
            <PageListViewItem key={index} page={page} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
