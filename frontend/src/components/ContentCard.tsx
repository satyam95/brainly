import { Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { useAppDispatch } from "@/redux/hooks";
import { removeUserContent } from "@/redux/contentsSlice";
import apiClient from "@/axios/apiClient";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import EditContentDialog from "./EditContentDialog";
import { Content } from "@/types";
import { Tweet } from "react-tweet";

interface ContentCardProps {
  content: Content;
}

const ContentCard = ({ content }: ContentCardProps) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await apiClient.delete(`/content/${content._id}`);
      if (res.data.message) {
        toast.success(res.data.message);
        dispatch(removeUserContent(content._id));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete content. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Extract tweet ID from the Twitter link
  const getTweetId = (link: string) => {
    const parts = link.split("/");
    return parts[parts.length - 1];
  };

  // Function to get aspect ratio for iframes based on content type
  const getAspectRatio = (type: string) => {
    switch (type) {
      case "type_youtube":
        return "16 / 9";
      case "type_facebook":
        return "4 / 3";
      case "type_pinterest":
        return "2 / 3";
      default:
        return "1 / 1";
    }
  };

  // Conditional src URL for iframe (excluding Twitter)
  const iframeSrc =
    content.type === "type_youtube"
      ? content.link.replace("watch", "embed").replace("?v=", "/")
      : content.type === "type_facebook"
      ? `https://www.facebook.com/plugins/post.php?href=${content.link}`
      : content.type === "type_pinterest"
      ? `https://assets.pinterest.com/ext/embed.html?id=${
          content.link.split("/").slice(-2)[0]
        }`
      : "";

  // Common iframe properties
  const iframeProps = {
    className: "w-full h-full rounded-lg",
    onLoad: () => setIframeLoaded(true),
  };

  // Handle iframe loading with setTimeout as a fallback
  useEffect(() => {
    if (!iframeLoaded && content.type !== "type_twitter") {
      const timer = setTimeout(() => {
        setIframeLoaded(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [iframeLoaded, content.type]);

  return (
    <>
      <div className="h-fit border rounded-md shadow-md p-3 break-inside">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold truncate">{content.title}</h3>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEditDialog(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleDelete}
                variant="ghost"
                size="icon"
                disabled={isDeleting}
              >
                {isDeleting ? <Spinner /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div>
            <div
              className={`w-full h-full rounded-lg overflow-hidden aspect-[${getAspectRatio(
                content.type
              )}]`}
            >
              {content.type === "type_twitter" ? (
                <div className="w-full h-full">
                  <Tweet id={getTweetId(content.link)} />
                </div>
              ) : content.type === "type_link" || content.type === "type_blog" ? (
                <div className="p-4 flex flex-col justify-center items-center gap-2 bg-muted rounded-lg">
                  <a
                    href={content.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-base font-medium"
                  >
                    Visit Link
                  </a>
                </div>
              ) : !iframeLoaded ? (
                <Skeleton className="w-full h-full rounded-lg" />
              ) : (
                iframeSrc && (
                  <iframe
                    {...iframeProps}
                    src={iframeSrc}
                    title={`${content.type} content`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  ></iframe>
                )
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground my-3 line-clamp-3">
            {content.description}
          </p>
        </div>
      </div>
      <EditContentDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        content={content}
      />
    </>
  );
};

export default ContentCard;
