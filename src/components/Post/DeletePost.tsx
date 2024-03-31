"use client";
import { Post } from "@/lib/db/schema/post";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { toast } from "sonner";
import { Button } from "../ui/Button";
import { Loader2 } from "lucide-react";

interface DeletePostProps {
  post: Post | undefined;
}

type DeletePost = {
  id: string;
};

const DeletePost: FC<DeletePostProps> = ({ post }) => {
  const router = useRouter();
  const { mutate: deletePost, isPending } = useMutation({
    mutationFn: async () => {
      if (post) {
        const payload: DeletePost = { id: post.id };
        const { data } = await axios.post("/api/post/delete", payload);
        return data;
      }
    },

    onError: (err) => {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          toast(`${err.response.data.title}`, {
            description: `${err.response.data.message}`,
          });
        } else {
          toast(`Some error occured`, {
            description: `${err.message}`,
          });
        }
      } else {
        toast(`Some other error occurred`, {
          description: `Please try again later`,
        });
      }
    },

    onSuccess: (data) => {
      const { name } = data.message;
      toast(`Post deleted`, {
        description: `${name} was deleted successfully`,
      });
      router.refresh();
    },
  });
  return (
    <Button
      variant="destructive"
      disabled={isPending}
      onClick={() => deletePost()}
    >
      {isPending && <Loader2 className="animate-spin" color="white" />}Delete
    </Button>
  );
};

export default DeletePost;
