import { Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { useAppDispatch } from "@/redux/hooks";
import { removeUserContent } from "@/redux/contentsSlice";
import apiClient from "@/axios/apiClient";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import EditContentDialog from "./EditContentDialog";
import { Content } from "@/types";

interface ContentCardProps {
  content: Content;
}

const ContentCard = ({ content }: ContentCardProps) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const parts = content.link.split("/");
  const pinId = parts[parts.length - 2];

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

  // Function to get iframe height based on content type
  const getIframeHeight = (type: string) => {
    switch (type) {
      case "youtube":
        return "200px";
      case "twitter":
        return "500px";
      case "facebook":
        return "300px";
      case "pinterest":
        return "400px";
      default:
        return "300px";
    }
  };

  const iframeHeight = getIframeHeight(content.type);

  // Common iframe properties
  const iframeProps = {
    className: "w-full",
    style: { height: iframeHeight },
    onLoad: () => setIframeLoaded(true), // Set iframeLoaded to true when iframe is loaded
  };

  // Conditional src URL for iframe
  const iframeSrc =
    content.type === "youtube"
      ? content.link.replace("watch", "embed").replace("?v=", "/")
      : content.type === "twitter"
      ? `https://twitframe.com/show?url=${content.link.replace(
          "x.com",
          "twitter.com"
        )}`
      : content.type === "facebook"
      ? `https://www.facebook.com/plugins/post.php?href=${content.link}`
      : content.type === "pinterest"
      ? `https://assets.pinterest.com/ext/embed.html?id=${pinId}`
      : "";

  // Handle iframe loading with setTimeout as a fallback if `onLoad` is delayed
  useEffect(() => {
    if (!iframeLoaded) {
      const timer = setTimeout(() => {
        setIframeLoaded(true); // Fallback to set iframeLoaded if onLoad doesn't trigger
      }, 3000); // 3 seconds delay for fallback

      return () => clearTimeout(timer);
    }
  }, [iframeLoaded]);

  return (
    <>
      <Card className="break-inside">
        <CardHeader className="pb-4">
          <CardTitle className="flex justify-between items-center">
            <h3>{content.title}</h3>
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
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full rounded-lg overflow-hidden">
            {/* Show skeleton until iframe is loaded */}
            {!iframeLoaded ? (
              <Skeleton className="w-full" style={{ height: iframeHeight }} />
            ) : (
              // Render iframe once it's loaded
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
          <p className="text-sm text-muted-foreground my-4">
            {content.description}
          </p>
          {(content.type === "linkedIn" || content.type === "blog") && (
            <a href={content.link} target="_blank" rel="noopener noreferrer">
              Visit Link
            </a>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {content.tags.map((tag, index) => (
              <Badge key={`${tag}-${index}`} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
      <EditContentDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        content={content}
      />
    </>
  );
};

export default ContentCard;
