import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { orgs } from "@/lib/db/schema/org";
import { orgMemberships } from "@/lib/db/schema/org-user";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { orgId }: { orgId: string } = body;

    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const org = (
      await db.select().from(orgs).where(eq(orgs.id, orgId)).limit(1)
    )[0];

    if (!org) {
      return NextResponse.json(
        { message: "Organization does not exist" },
        { status: 404 }
      );
    } else {
      const isMember = await db
        .select()
        .from(orgMemberships)
        .where(eq(orgMemberships.userId, session.user.id))
        .limit(1);

      if (isMember) {
        return NextResponse.json(
          { message: "Already a member" },
          { status: 409 }
        );
      } else {
        const addMember = await db
          .insert(orgMemberships)
          .values({ orgId, userId: session.user.id });

        return NextResponse.json(
          { message: "Created organisation join request" },
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
