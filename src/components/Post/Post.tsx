"use client";

import { formatTimeToNow } from "@/lib/utils";
import { FC, useRef } from "react";
import EditorOutput from "../Editor/EditorOutput";
import { Post as PostType } from "@/lib/db/schema/post";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

interface PostProps {
  post: PostType;
}

const Post: FC<PostProps> = ({ post }) => {
  return (
    <Card>
      <CardHeader>
        <div className="mt-1 text-xs text-gray-500">
          {post.pageId ? (
            <>
              <a
                className="underline text-zinc-900 text-sm underline-offset-2"
                href={`/page/${post.pageId}`}
              >
                r/{post.pageId}
              </a>
              <span className="px-1">•</span>
            </>
          ) : null}
          {formatTimeToNow(new Date(post.createdAt!))}
        </div>
      </CardHeader>
      <CardTitle className="px-6">{post.title}</CardTitle>
      <CardContent>
        <EditorOutput content={post.content} />
      </CardContent>
    </Card>
  );
};
export default Post;
