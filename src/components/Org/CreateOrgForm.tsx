"use client";

import { NewOrgPayload, insertOrgValidator } from "@/lib/db/schema/org";
import { useMutation } from "@tanstack/react-query";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";
import { Button } from "../ui/Button";
import { Loader2 } from "lucide-react";
import { Input } from "../ui/Input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Form";
import { Textarea } from "../ui/Textarea";

interface pageProps {}

const CreateOrgForm: FC<pageProps> = ({}) => {
  const router = useRouter();
  // const {
  //   register,
  //   handleSubmit,
  //   control,
  //   formState: { errors },
  //   reset,
  // }
  const createOrgForm = useForm<NewOrgPayload>({
    resolver: zodResolver(insertOrgValidator),
  });

  const [orgImageUrl, setOrgImageURL] = useState<string>("");
  const [orgFileKey, setOrgFileKey] = useState<string>("");

  const { mutate: createOrg, isPending } = useMutation({
    mutationFn: async ({ id, name, desc }: NewOrgPayload) => {
      const payload: NewOrgPayload = {
        id,
        name,
        desc,
        orgImageUrl,
        orgFileKey,
      };
      const { data } = await axios.post("/api/org/create", payload);
      return data;
    },

    onError: (err) => {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          toast(`Maximum organization limit reached`, {
            description: `You cannot have more than one organization`,
          });
        }
        if (err.response?.status === 400) {
          toast(`Please check your input`, {
            description: `Your input is not correct`,
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
      createOrgForm.reset();
      setOrgImageURL("");
      setOrgFileKey("");
      router.refresh();
    },
  });

  return (
    <div className="max-w-md">
      <Form {...createOrgForm}>
        <form
          onSubmit={createOrgForm.handleSubmit((e) => {
            createOrg(e);
          })}
        >
          <FormField
            control={createOrgForm.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Id</FormLabel>
                <FormControl>
                  <Input placeholder="Type your organization id" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={createOrgForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name your organization" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={createOrgForm.control}
            name="desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your organization"
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <div className="w-60">
            {orgImageUrl === "" ? (
              <UploadDropzone
                appearance={{ button: "w-10" }}
                endpoint="orgImageUploader"
                config={{ mode: "auto" }}
                onClientUploadComplete={async (res) => {
                  // Do something with the response
                  if (res) {
                    setOrgImageURL(res[0].url);
                    setOrgFileKey(res[0].key);
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
            ) : (
              <img alt={"logo"} height={240} src={orgImageUrl} width={240} />
            )}
          </div>
          <Button disabled={isPending} type="submit">
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Create organisation"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateOrgForm;
