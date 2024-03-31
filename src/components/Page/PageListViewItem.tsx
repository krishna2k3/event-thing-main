import { Page } from "@/lib/db/schema/page";
import { FC } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "../ui/Card";

interface PageListViewProps {
  page: Page;
}

const PageListViewItem: FC<PageListViewProps> = async ({ page }) => {
  return (
    <Card className="grid grid-cols-3 max-w-xl">
      <CardContent className="p-4">
        <Link className="flex flex-col items-center justify-center" href={`page/${page.id}`}>
          <img className="rounded-2xl" src={page.pageImageUrl} />
          <p className="underline">page/{page.id}</p>
        </Link>
      </CardContent>
      <CardFooter className="text-sm col-span-2 p-2">{page.desc}</CardFooter>
    </Card>
  );
};

export default PageListViewItem;
