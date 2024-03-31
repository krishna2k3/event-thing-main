import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Page, pages } from "@/lib/db/schema/page";
import { Post, posts } from "@/lib/db/schema/post";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { eq } from "drizzle-orm";
import { FC } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { orgs } from "@/lib/db/schema/org";
import PageListViewItem from "@/components/Page/PageListViewItem";
import EditorOutput from "@/components/Editor/EditorOutput";
import PostComponent from "@/components/Post/Post";

interface pageProps {
  params: {
    pageId: string;
  };
}

const page: FC<pageProps> = async ({ params }) => {
  const { pageId } = params;

  const session = await getAuthSession();
  const currPage = await db.query.pages.findFirst({
    where: eq(pages.id, pageId),
  });

  console.log(currPage);

  let pagePosts: Post[] = [];
  if (currPage) {
    pagePosts = await db.query.posts.findMany({
      where: eq(posts.pageId, currPage.id),
    });
  }

  return (
    <div className="flex gap-4">
      <div className="flex gap-4 flex-col w-[50%]">
        <Card className="w-[400px] h-min">
          <CardHeader>
            <img
              className="h-10 w-10 object-cover"
              alt={currPage?.name || "" + " logo"}
              src={
                currPage
                  ? currPage.pageImageUrl
                  : "https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
              }
            />
            {currPage?.name}
          </CardHeader>
          <Separator />
          <CardContent>Description: {currPage?.desc}</CardContent>
          <Separator />
        </Card>
      </div>
      <div className="w-[50%] flex flex-col gap-4">
        <h1 className="text-xl">Pages</h1>
        <div className="flex flex-col gap-4">
          {pagePosts.map((post, index) => (
            <PostComponent key={index} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
