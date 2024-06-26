"use client";

import { formatTimeToNow } from "@/lib/utils";
// import { Post, User, Vote } from '@prisma/client'
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { FC, useRef } from "react";
import EditorOutput from "../Editor/EditorOutput";
import { Post as PostType } from "@/lib/db/schema/post";
import { User } from "@/lib/db/schema/user";
import DeletePost from "./DeletePost";

interface PostProps {
  post: PostType;
}

const Post: FC<PostProps> = ({ post }) => {
  const pRef = useRef<HTMLParagraphElement>(null);
  return (
    <div className="rounded-md bg-white shadow">
      <div className="px-6 py-4 flex justify-between">
        <div className="w-0 flex-1">
          <div className="mt-1 text-xs text-gray-500">
            {post.pageId ? (
              <>
                <a
                  className="underline text-zinc-900 text-sm underline-offset-2"
                  href={`/p/${post.pageId}`}
                >
                  r/{post.pageId}
                </a>
                <span className="px-1">•</span>
              </>
            ) : null}
            {formatTimeToNow(new Date(post.createdAt!))}
          </div>
          <a href={`/r/${post.pageId}/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {post.title}
            </h1>
          </a>

          <div className="relative text-sm w-full overflow-clip" ref={pRef}>
            <EditorOutput content={post.content} />
            {pRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"></div>
            ) : null}
          </div>
          <DeletePost post={post}/>
        </div>
      </div>
    </div>
  );
};
export default Post;
