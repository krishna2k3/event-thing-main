"use client";
import { ClientOrg } from "@/lib/db/schema/org";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { Button } from "../ui/Button";
import { toast } from "sonner";

interface DeleteOrgProps {
  org: ClientOrg | undefined;
}

type DeleteOrg = {
  id: string;
};

const DeleteOrg: FC<DeleteOrgProps> = ({ org }) => {
  const router = useRouter();
  const { mutate: deleteOrg, isPending } = useMutation({
    mutationFn: async () => {
      if (org) {
        const payload: DeleteOrg = { id: org.id };
        const { data } = await axios.post("/api/org/delete", payload);
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
      toast(`Organization deleted`, {
        description: `${name} was deleted successfully`,
      });
      router.refresh();
    },
  });
  return (
    <Button
      variant="destructive"
      disabled={isPending}
      onClick={() => deleteOrg()}
    >
      {isPending && <Loader2 className="animate-spin" color="white" />}Delete
      this organisation
    </Button>
  );
};

export default DeleteOrg;
