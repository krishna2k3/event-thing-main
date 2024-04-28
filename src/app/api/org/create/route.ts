import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { insertOrgValidator, orgs } from "@/lib/db/schema/org";
import { NeonDbError } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, desc, orgImageUrl, orgFileKey } = insertOrgValidator.parse(body);

    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const org = await db.query.orgs.findFirst({
      where: eq(orgs.adminId, session.user.id),
    });

    if (org) {
      return NextResponse.json(
        { message: "Maximum limit reached" },
        { status: 409 }
      );
    } else {
      const newOrg = (
        await db
          .insert(orgs)
          .values({ adminId: session.user.id, desc, name, id, orgImageUrl, orgFileKey })
          .returning({ id: orgs.id, name: orgs.name, desc: orgs.desc })
      )[0];
      return NextResponse.json({ message: newOrg }, { status: 201 });
    }
  } catch (error) {
    console.log("some error occurred: ", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }

    else if(error instanceof NeonDbError){
      if(error.code === "23505"){
        return NextResponse.json(
          { message: "An organisation with the same handle already exists" },
          { status: 401 }
        );
      }
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
