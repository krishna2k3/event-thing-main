import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema/page";
import { posts } from "@/lib/db/schema/post";
import { PostValidator } from "@/lib/validators/post";
import { NeonDbError } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, content, pageId, allowedUsers, max_registrations, price } =
      PostValidator.parse(body);

    const session = await getAuthSession();

    const pricenum = Number(price);
    const max_registrationsnum = Number(max_registrations);

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const page = await db.query.pages.findFirst({
      where: eq(pages.id, pageId),
    });

    if (page?.moderatorEmail === session.user.email) {
      const newPost = await db
        .insert(posts)
        .values({
          pageId,
          title,
          allowedUsers,
          content,
          max_registrations: max_registrationsnum,
          price: pricenum,
        })
        .returning({ id: posts.id, name: posts.title, content: posts.content });

      return NextResponse.json({ message: newPost }, { status: 201 });
    } else {
      return NextResponse.json(
        { message: "Unauthorized moderator" },
        { status: 401 }
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
