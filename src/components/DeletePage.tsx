"use client";
import { Page } from "@/lib/db/schema/page";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { toast } from "sonner";
import { Button } from "./ui/Button";
import { Loader2 } from "lucide-react";

interface DeletePageProps {
  page: Page | undefined;
}

type DeletePage = {
  id: string;
};

const DeletePage: FC<DeletePageProps> = ({ page }) => {
  const router = useRouter();
  const { mutate: deletePage, isPending } = useMutation({
    mutationFn: async () => {
      if (page) {
        const payload: DeletePage = { id: page.id };
        const { data } = await axios.post("/api/page/delete", payload);
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
      toast(`Page deleted`, {
        description: `${name} was deleted successfully`,
      });
      router.refresh();
    },
  });
  return (
    <Button
      variant="destructive"
      disabled={isPending}
      onClick={() => deletePage()}
    >
      {isPending && <Loader2 className="animate-spin" color="white" />}Delete
    </Button>
  );
};

export default DeletePage;
