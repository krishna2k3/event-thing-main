import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteOrgValidator, orgs } from "@/lib/db/schema/org";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { utapi } from "../../uploadthing/core";
import { NeonDbError } from "@neondatabase/serverless";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = deleteOrgValidator.parse(body);

    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const deletedOrg = (
      await db
        .delete(orgs)
        .where(eq(orgs.id, id))
        .returning({ name: orgs.name, orgFileKey: orgs.orgFileKey })
    )[0];

    if (deletedOrg.orgFileKey !== "")
      try {
        await utapi.deleteFiles(deletedOrg.orgFileKey);
      } catch (err) {
        console.log(err);
        return NextResponse.json(
          { message: `Error deleting the image: ${err}` },
          { status: 500 }
        );
      }
    return NextResponse.json({ message: deletedOrg }, { status: 200 });
  } catch (error) {
    if (error instanceof NeonDbError) {
      console.log(error);
      return NextResponse.json(
        {
          title: `Delete all the pages first`,
          message: `You need to delete your pages before you can delete your organisation`,
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: `${error}` }, { status: 500 });
  }
}
