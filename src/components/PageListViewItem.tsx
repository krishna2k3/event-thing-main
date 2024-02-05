import { Page } from "@/lib/db/schema/page";
import { FC } from "react";
import { Link } from "lucide-react";

interface PageListViewProps {
  page: Page;
}

const PageListViewItem: FC<PageListViewProps> = async ({ page }) => {
  return (
    <div>
      <div className="flex flex-row justify-between">
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
              <Link href={`/settings/page/${page.id}`}>page/{page.id}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageListViewItem;
