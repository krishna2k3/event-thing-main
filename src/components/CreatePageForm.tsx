"use client";

import { useMutation } from "@tanstack/react-query";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { UploadDropzone } from "@/lib/uploadthing";
import { NewPagePayload, insertPageValidator } from "@/lib/db/schema/page";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/Button";
import { toast } from "sonner";
import { Input } from "./ui/Input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/Form";
import { Textarea } from "./ui/Textarea";
import { Progress } from "./ui/Progress";

interface pageProps {}

const CreatePageForm: FC<pageProps> = ({}) => {
  const router = useRouter();
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  //   reset,
  // }
  const createPageForm = useForm<NewPagePayload>({
    resolver: zodResolver(insertPageValidator),
  });

  const [pageImageUrl, setPageImageURL] = useState<string>("");
  const [pageFileKey, setPageFileKey] = useState<string>("");

  const { mutate: createOrg, isPending } = useMutation({
    mutationFn: async ({ id, name, desc, moderatorEmail }: NewPagePayload) => {
      const payload: NewPagePayload = {
        id,
        name,
        desc,
        pageImageUrl,
        pageFileKey,
        moderatorEmail,
      };
      const { data } = await axios.post("/api/page/create", payload);
      return data;
    },

    onError: (err) => {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          toast(`Page name is conflicting with another some other page`, {
            description: `Your page name must be unique. Please change`,
          });
        } else if (err.response?.status === 400) {
          toast(`You do not have an organisation`, {
            description: `Please create an organisation to create a page`,
          });
        } else if (err.response?.status === 401) {
          toast(`Moderator user does not exist`, {
            description: `Please check the email of the moderator user`,
          });
        }
      } else {
        toast(`Some other error occurred`, {
          description: `Please try again later`,
        });
        redirect("/org");
      }
    },

    onSuccess: (data) => {
      const { name } = data.message;
      toast(`Organization created`, {
        description: `${name} was created successfully`,
      });
      createPageForm.reset();
      setPageImageURL("");
      setPageFileKey("");
      router.refresh();
    },
  });

  return (
    <div className="max-w-md">
      <Form {...createPageForm}>
        <form
          onSubmit={createPageForm.handleSubmit((e) => {
            createOrg(e);
          })}
        >
          <FormField
            control={createPageForm.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Id</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Type your page id"
                    defaultValue=""
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={createPageForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Name your page"
                    defaultValue=""
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={createPageForm.control}
            name="desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe your page"
                    defaultValue=""
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={createPageForm.control}
            name="moderatorEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Moderator</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Type your page moderator"
                    defaultValue=""
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <div className="w-60">
            {pageImageUrl === "" ? (
              <div>
                <UploadDropzone
                  appearance={{ button: "w-10" }}
                  endpoint="pageImageUploader"
                  config={{ mode: "auto" }}
                  onClientUploadComplete={async (res) => {
                    // Do something with the response
                    if (res) {
                      setPageImageURL(res[0].url);
                      setPageFileKey(res[0].key);
                    }
                    toast("Image was uploaded");
                  }}
                  onUploadError={(error: Error) => {
                    // Do something with the error.
                    toast("Some error occured while uploading the image", {
                      description:
                        "Please check the image file size and format. Else try again later.",
                    });
                  }}
                />
              </div>
            ) : (
              <img alt={"logo"} height={240} src={pageImageUrl} width={240} />
            )}
          </div>

          <Button disabled={isPending} type="submit">
            {isPending ? <Loader2 className="animate-spin" /> : "Create page"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreatePageForm;
