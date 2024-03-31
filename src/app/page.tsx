import PageListViewItem from "@/components/Page/PageListViewItem";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema/page";

export default async function Home() {
  const session = await getAuthSession();
  const popularPages = await db.query.pages.findMany({
    orderBy: [pages.name],
  });
  return (
    <main className="flex min-h-screen flex-col">
      <div>
        {session?.user && <div>Welcome back {session?.user.name}!</div>}
        <div className="">
          <h2>Find pages to follow</h2>
          <Card className="">
            {popularPages.map((page) => (
              <PageListViewItem key={page.id} page={page} />
            ))}
          </Card>
        </div>
      </div>
    </main>
  );
}
