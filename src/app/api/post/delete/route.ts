import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { NeonDbError } from "@neondatabase/serverless";
import { deletePostValidator, Post, posts } from "@/lib/db/schema/post";
import { utapi } from "../../uploadthing/core";

type PostContent = {
  time: number;
  blocks: Block[];
  version: string;
};

type Block = ParagraphBlock | ImageBlock;

type ParagraphBlock = {
  id: string;
  type: "paragraph";
  data: {
    text: string;
  };
};

type ImageBlock = {
  id: string;
  type: "image";
  data: {
    file: {
      url: string;
      fileKey: string;
    };
    caption: string;
    withBorder: boolean;
    stretched: boolean;
    withBackground: boolean;
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = deletePostValidator.parse(body);

    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json(
        { message: "post id is missing" },
        { status: 400 }
      );
    }

    const deletedPost = (
      await db
        .delete(posts)
        .where(eq(posts.id, id))
        .returning({ content: posts.content, name: posts.title })
    )[0];

    try {
      const deletedPostContent: PostContent =
        deletedPost.content as PostContent;

      const imageBlocks = deletedPostContent.blocks.filter(
        (block): block is ImageBlock => block.type === "image"
      );
      const imageUrls = imageBlocks.map((block) => block.data.file.fileKey);
      console.log("imageUrls to delete: ", imageUrls);
      // Use utapi to delete the images by URLs
      if (imageUrls.length > 0) {
        const res = await utapi.deleteFiles(imageUrls);
        console.log(res);
      }
    } catch (err) {
      console.log(err);
      return NextResponse.json(
        { message: `Error deleting the image: ${err}` },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: deletedPost }, { status: 200 });
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
