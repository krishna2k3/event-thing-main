"use client";

import EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";
import { uploadFiles } from "@/lib/uploadthing";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import "@/styles/editor.css";
import { toast } from "sonner";
import { Input } from "./ui/Input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "./ui/Select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/Form";
import { Separator } from "./ui/Separator";

type FormData = z.infer<typeof PostValidator>;

interface EditorProps {
  pageId: string;
}

export const Editor: React.FC<EditorProps> = ({ pageId }) => {
  const allowedUsersOption = [
    "All",
    "Organization Members Only",
    "Page Members Only",
  ];

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // }
  const createPostForm = useForm<FormData>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      pageId,
      title: "",
      content: null,
      price: "0",
      max_registrations: "0",
      allowedUsers: "Page Members Only",
    },
  });

  const ref = useRef<EditorJS>(null);
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const pathname = usePathname();

  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      pageId,
      allowedUsers,
      max_registrations,
      price,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = {
        title,
        content,
        pageId,
        allowedUsers,
        price,
        max_registrations,
      };
      const { data } = await axios.post("/api/post/create", payload);
      return data;
    },
    onError: () => {
      return toast("Something went wrong.", {
        description: "Your post was not published. Please try again.",
      });
    },
    onSuccess: () => {
      createPostForm.reset();
      router.refresh();
      return toast("Your post has been published.");
    },
  });

  const initializeEditor = useCallback(async () => {
    const EditorJSInstance = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current) {
      const editor = new EditorJSInstance({
        holder: "editor",
        onReady() {
          //@ts-ignore
          ref.current = editor as EditorJS;
        },
        placeholder: "Type here to write your post...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  // upload to uploadthing
                  const [res] = await uploadFiles({
                    endpoint: "postImageUploader",
                    files: [file],
                  });

                  console.log("This is the response", res);
                  return {
                    success: 1,
                    file: {
                      url: res.url,
                    },
                  };
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (Object.keys(createPostForm.formState.errors).length) {
      for (const [_key, value] of Object.entries(
        createPostForm.formState.errors
      )) {
        value;
        toast("Something went wrong.", {
          description: (value as { message: string }).message,
        });
      }
    }
  }, [createPostForm.formState.errors]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("In the browser; Setting isMounted to true");
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();
      setTimeout(() => {
        _titleRef?.current?.focus();
      }, 0);
    };

    console.log("Checking if isMounted is true");
    if (isMounted) {
      console.log("isMounted is true; Initializing the editor...");
      init();

      return () => {
        if (ref.current) {
          ref.current.destroy();
          //@ts-ignore
          ref.current = undefined;
        }
      };
    } else {
      console.log("isMounted is false");
    }
  }, [isMounted, initializeEditor]);

  async function onSubmit(data: FormData) {
    const blocks = await ref.current?.save();

    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
      pageId,
      price: data.price,
      allowedUsers: data.allowedUsers,
      max_registrations: data.max_registrations,
    };

    createPost(payload);
  }

  if (!isMounted) {
    return null;
  }

  const { ref: titleRef, ...rest } = createPostForm.register("title");

  return (
    <div className="w-fit p-4 bg-white rounded-lg border border-zinc-200">
      <Form {...createPostForm}>
        <form
          id="subreddit-post-form"
          className="w-fit"
          onSubmit={createPostForm.handleSubmit(onSubmit)}
        >
          <div className="mb-2">
            <FormField
              control={createPostForm.control}
              name="allowedUsers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allowed users</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select allowed users" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allowedUsersOption.map((allowedUser) => (
                        <SelectItem key={allowedUser} value={allowedUser}>
                          {allowedUser}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={createPostForm.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter 0 if it is a free event"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={createPostForm.control}
              name="max_registrations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max registrations</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter 0 to leave it uncapped"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
          </div>
          <Separator />
          <div className="prose prose-stone dark:prose-invert">
            <TextareaAutosize
              ref={(e) => {
                titleRef(e);
                // @ts-ignore
                _titleRef.current = e;
              }}
              {...rest}
              placeholder="Title"
              className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
            />
            <div id="editor" className="min-h-[500px]" />
            <p className="text-sm text-gray-500">
              Use{" "}
              <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
                /
              </kbd>{" "}
              to open the command menu.
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Editor;
