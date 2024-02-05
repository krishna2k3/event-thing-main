import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { orgs } from "@/lib/db/schema/org";
import { insertPageValidator, pages } from "@/lib/db/schema/page";
import { NeonDbError } from "@neondatabase/serverless";
import { eq, DrizzleError } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, desc, moderatorEmail, pageImageUrl, pageFileKey } =
      insertPageValidator.parse(body);

    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const org = await db.query.orgs.findFirst({
      where: eq(orgs.adminId, session.user.id),
    });

    if (org) {
      const page = await db.query.pages.findFirst({ where: eq(pages.id, id) });
      if (page) {
        return NextResponse.json(
          {
            message: "Page with same account handle already exists",
          },
          {
            status: 409,
          }
        );
      } else {
        const newPage = (
          await db
            .insert(pages)
            .values({
              id,
              name,
              desc,
              moderatorEmail,
              pageImageUrl,
              pageFileKey,
              orgId: org.id,
              pageVerified: org.orgVerified,
            })
            .returning({ id: pages.id, name: pages.name, desc: orgs.desc })
        )[0];
        return NextResponse.json({ message: newPage }, { status: 201 });
      }
    } else {
      return NextResponse.json(
        { message: "You need to have an organisation to create a page" },
        { status: 400 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        }
      );
    } else if (error instanceof NeonDbError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 401,
        }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
