import { useState } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { contentSchema } from "@/schema/contentSchema";
import apiClient from "@/axios/apiClient";
import toast from "react-hot-toast";

const AddContentDialog = () => {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const form = useForm<z.infer<typeof contentSchema>>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      type: "Link",
    },
  });

  const token = localStorage.getItem("token");

  async function onSubmit(values: z.infer<typeof contentSchema>) {
    const data = { ...values, tags };
    console.log(token);
    try {
      const res = await apiClient.post("/content", data);
      if (res.data.message) {
        setTags([]);
        setOpen(false);
        form.reset({ type: "Link" });
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleAddTag(tag: string) {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  }

  function handleRemoveTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Content
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
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
                      <option value="link">Link</option>
                      <option value="youtube">Youtube</option>
                      <option value="twitter">Twitter</option>
                      <option value="facebook">Facebook</option>
                      <option value="pinterest">Pinterest</option>
                      <option value="blog">Blog</option>
                      <option value="document">Document</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
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
              Add Content
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContentDialog;
