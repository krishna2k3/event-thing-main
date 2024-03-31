import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema/page";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { eq } from "drizzle-orm";
import { FC } from "react";
import { posts } from "@/lib/db/schema/post";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import ModeratorPost from "@/components/Post/ModeratorPost";

interface pageProps {
  params: {
    pageId: string;
  };
}

const Editor = dynamic(() => import("@/components/Editor/Editor"), {
  ssr: false,
});

const page: FC<pageProps> = async ({ params }) => {
  const { pageId } = params;

  const session = await getAuthSession();
  const currpage = await db.query.pages.findFirst({
    where: eq(pages.id, pageId),
    with: { pageOf: true },
  });

  const pageposts = await db.query.posts.findMany({
    where: eq(posts.pageId, pageId),
  });

  return (
    <div className="flex gap-4">
      <div className="flex gap-4 flex-col w-[50%]">
        <Card className="w-[400px] h-min">
          <CardHeader>
            <img
              className="h-10 w-10 object-cover"
              alt={page.name + " logo"}
              src={
                currpage
                  ? currpage.pageImageUrl
                  : "https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
              }
            />
            {currpage?.name}
          </CardHeader>
          <Separator />
          <CardContent>Description: {currpage?.desc}</CardContent>
          <Separator />
          <CardContent>A page of {currpage?.pageOf.name}</CardContent>
        </Card>
        <Editor pageId={pageId} />
        <div className="w-auto flex justify-start">
          <Button type="submit" className="w-auto" form="subreddit-post-form">
            Post
          </Button>
        </div>
      </div>
      <div className="w-[50%] flex flex-col gap-4">
        <h1 className="text-xl">Posts</h1>
        <div className="flex flex-col gap-4">
          {pageposts.map((post, index) => (
            <Card key={index}>
              <ModeratorPost key={post.id} post={post} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
