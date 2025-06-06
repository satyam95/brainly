import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Content } from "@/types";
import { z } from "zod";
import { contentSchema } from "@/schema/contentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import apiClient from "@/axios/apiClient";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/redux/hooks";
import { updateUserContent } from "@/redux/contentsSlice";

interface EditContentDialogProps {
  content: Content;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditContentDialog = ({
  content,
  open,
  onOpenChange,
}: EditContentDialogProps) => {
  const [tags, setTags] = useState<string[]>(content.tags || []);

  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof contentSchema>>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: content.title,
      description: content.description || "",
      link: content.link || "",
      type: content.type,
      tags: tags.join(", "),
    },
  });

  useEffect(() => {
    // Update tags when `content` changes
    setTags(content.tags || []);
  }, [content]);

  function handleAddTag(tag: string) {
    if (tag && !tags.includes(tag)) {
      const updatedTags = [...tags, tag];
      setTags(updatedTags);
      form.setValue("tags", updatedTags.join(", "));
    }
  }

  function handleRemoveTag(tag: string) {
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
    form.setValue("tags", updatedTags.join(", "));
  }

  async function onSubmit(values: z.infer<typeof contentSchema>) {
    const data = { ...values, tags };

    try {
      const res = await apiClient.put(`/content/${content._id}`, data);
      if (res.data.message) {
        setTags([]);
        onOpenChange(false);
        form.reset({ type: "type_link" });
        toast.success(res.data.message);
        console.log(res.data.content);
        dispatch(updateUserContent(res.data.content));
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Content</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input type="url" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="type_link">Link</option>
                      <option value="type_youtube">Youtube</option>
                      <option value="type_twitter">Twitter</option>
                      <option value="type_facebook">Facebook</option>
                      <option value="type_pinterest">Pinterest</option>
                      <option value="type_blog">Blog</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel>Tags (optional)</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Enter a tag and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const value = e.currentTarget.value.trim();
                          if (value) {
                            handleAddTag(value);
                            e.currentTarget.value = ""; // Clear input
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm font-medium"
                      >
                        {tag}
                        <button
                          type="button"
                          className="ml-2 text-red-500"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditContentDialog;
