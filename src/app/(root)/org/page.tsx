import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ClientOrg, orgs } from "@/lib/db/schema/org";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import DeleteOrg from "@/components/Org/DeleteOrg";
import CreateOrgForm from "@/components/Org/CreateOrgForm";
import CreatePageForm from "@/components/Page/CreatePageForm";
import { Page, pages } from "@/lib/db/schema/page";
import DeletePage from "@/components/Page/DeletePage";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import { Link as LinkIcon } from "lucide-react";
import { Separator } from "@/components/ui/Separator";

const page = async ({}) => {
  let org: ClientOrg | undefined;

  let orgpages: Page[] | undefined;

  const session = await getAuthSession();

  if (session?.user) {
    org = await db.query.orgs.findFirst({
      where: eq(orgs.adminId, session.user.id),
      columns: {
        id: true,
        name: true,
        desc: true,
        orgImageUrl: true,
        orgFileKey: true,
        joinedAt: true,
        updatedAt: true,
        orgVerified: true,
      },
    });
    if (org) {
      orgpages = await db.query.pages.findMany({
        where: eq(pages.orgId, org.id),
      });
    }
  } else {
    redirect("/sign-in");
  }

  const orgUrl = `/org/${org?.id}`;

  return (
    <div>
      {org ? (
        <div className="flex justify-between">
          <Card className="w-[400px] h-min">
            <CardHeader className="flex gap-3">
              <img
                className="h-20 w-20 object-cover"
                alt={org.name + " logo"}
                src={
                  org.orgImageUrl
                    ? org.orgImageUrl
                    : "https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                }
              />
              <div className="flex flex-col">
                <p className="text-md">{org.name}</p>
                <p className="text-small text-default-500">
                  <LinkIcon href={orgUrl}>org/{org.id}</LinkIcon>
                </p>
              </div>
            </CardHeader>
            <Separator />
            <CardContent>
              <p>{org.desc}</p>
            </CardContent>
            <Separator />
            <CardFooter>
              <DeleteOrg org={org} />
            </CardFooter>
          </Card>

          <Card className="w-[400px] h-min">
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-md">Your pages</p>
                <p className="text-small text-default-500">
                  {orgpages?.length} page
                  {orgpages && (orgpages.length > 1 ? "s" : "")}
                </p>
              </div>
            </CardHeader>
            <Separator />
            {orgpages ? (
              orgpages.map((page) => (
                <div key={page.id}>
                  <CardContent
                    key={page.id}
                    className="flex flex-row justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        className="h-10 w-10 object-cover"
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
                          <LinkIcon href={orgUrl}>page/{page.id}</LinkIcon>
                        </p>
                      </div>
                    </div>
                    <div>
                      <DeletePage page={page} />
                    </div>
                  </CardContent>
                  <Separator />
                </div>
              ))
            ) : (
              <></>
            )}
          </Card>

          <CreatePageForm />
        </div>
      ) : (
        <div>
          <div>You don&apos;t have an organization yet</div>
          <CreateOrgForm />
        </div>
      )}
    </div>
  );
};

export default page;
