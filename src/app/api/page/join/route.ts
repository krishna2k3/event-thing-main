import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema/page";
import { pageMemberships } from "@/lib/db/schema/page-user";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { pageId }: { pageId: string } = body;

    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const page = (
      await db.select().from(pages).where(eq(pages.id, pageId)).limit(1)
    )[0];

    if (!page) {
      return NextResponse.json(
        { message: "Page does not exist" },
        { status: 404 }
      );
    } else {
      const isMember = await db
        .select()
        .from(pageMemberships)
        .where(eq(pageMemberships.userId, session.user.id))
        .limit(1);

      if (isMember) {
        return NextResponse.json(
          { message: "Already a member" },
          { status: 409 }
        );
      } else {
        const addMember = await db
          .insert(pageMemberships)
          .values({ pageId, userId: session.user.id });

        return NextResponse.json(
          { message: "Created page join request" },
          { status: 401 }
        );
      }
    }
  } catch (error) {
    console.log("some error occurred: ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
