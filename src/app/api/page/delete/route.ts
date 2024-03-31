import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { orgs } from "@/lib/db/schema/org";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { utapi } from "../../uploadthing/core";
import { NeonDbError } from "@neondatabase/serverless";
import { deletePageValidator, pages } from "@/lib/db/schema/page";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = deletePageValidator.parse(body);

    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const deletedPage = (
      await db
        .delete(pages)
        .where(eq(pages.id, id))
        .returning({ name: pages.name, pageFileKey: pages.pageFileKey })
    )[0];

    try {
      await utapi.deleteFiles(deletedPage.pageFileKey);
    } catch (err) {
      console.log(err);
      return NextResponse.json(
        { message: `Error deleting the image: ${err}` },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: deletedPage }, { status: 200 });
  } catch (error) {
    if (error instanceof NeonDbError) {
      console.log(error);
      return NextResponse.json(
        {
          title: `Delete all the posts first`,
          message: `You need to delete your posts before you can delete your page`,
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: `${error}` }, { status: 500 });
  }
}
