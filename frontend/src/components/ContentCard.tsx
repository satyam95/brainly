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
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "./ui/skeleton";
import { useAppDispatch } from "@/redux/hooks";
import { removeUserContent } from "@/redux/contentsSlice";
import apiClient from "@/axios/apiClient";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import EditContentDialog from "./EditContentDialog";
import { Content } from "@/types";

// Declare Twitter interface for TypeScript
interface Twitter {
  widgets: {
    load: (element?: HTMLElement | null) => Promise<void>;
  };
}

declare global {
  interface Window {
    twttr?: Twitter;
  }
}

interface ContentCardProps {
  content: Content;
}

const ContentCard = ({ content }: ContentCardProps) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [twitterError, setTwitterError] = useState(false);
  const twitterWidgetRef = useRef<HTMLDivElement>(null);

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

  // Validate Twitter URL
  const isValidTwitterUrl = (url: string) => {
    return (
      (url.includes("twitter.com") || url.includes("x.com")) &&
      /\/status\/\d+$/.test(url)
    );
  };

  // Function to get iframe/container height based on content type
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

  // Conditional src URL for iframe (non-Twitter content)
  const iframeSrc = (() => {
    if (content.type === "youtube") {
      return content.link.replace("watch", "embed").replace("?v=", "/");
    }
    if (content.type === "facebook") {
      return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(content.link)}`;
    }
    if (content.type === "pinterest") {
      return `https://assets.pinterest.com/ext/embed.html?id=${pinId}`;
    }
    return "";
  })();

  // Determine sandbox attributes based on content type
  const getSandboxAttributes = (type: string) => {
    const baseSandbox = "allow-scripts allow-same-origin";
    // Add allow-presentation only for content types that may need it
    return type === "youtube" || type === "facebook" || type === "pinterest"
      ? `${baseSandbox} allow-presentation`
      : baseSandbox;
  };

  // Load Twitter widget and handle loading state
  useEffect(() => {
    if (content.type === "twitter" && isValidTwitterUrl(content.link) && !iframeLoaded) {
      // Load Twitter widgets.js
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      script.onload = () => {
        if (window.twttr?.widgets) {
          window.twttr.widgets.load(twitterWidgetRef.current).then(() => {
            setIframeLoaded(true);
          }).catch((err) => {
            console.error("Twitter widget load error:", err);
            setTwitterError(true);
            setIframeLoaded(true);
          });
        } else {
          setTwitterError(true);
          setIframeLoaded(true);
        }
      };
      script.onerror = () => {
        console.error("Failed to load Twitter widgets.js");
        setTwitterError(true);
        setIframeLoaded(true);
      };
      document.body.appendChild(script);

      // Fallback timeout
      const timer = setTimeout(() => {
        setIframeLoaded(true);
      }, 3000);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
        clearTimeout(timer);
      };
    } else if (iframeSrc && !iframeLoaded) {
      // For non-Twitter iframes
      const timer = setTimeout(() => {
        setIframeLoaded(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [iframeLoaded, content.type, content.link, iframeSrc]);

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
                aria-label="Edit content"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleDelete}
                variant="ghost"
                size="icon"
                disabled={isDeleting}
                aria-label="Delete content"
              >
                {isDeleting ? <Spinner /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full rounded-lg overflow-hidden">
            {!iframeLoaded ? (
              <Skeleton className="w-full" style={{ height: iframeHeight }} />
            ) : content.type === "twitter" && isValidTwitterUrl(content.link) && !twitterError ? (
              // Twitter embed (no sandbox, as Twitter controls the iframe)
              <div
                ref={twitterWidgetRef}
                className="w-full"
                style={{ minHeight: iframeHeight }}
                role="region"
                aria-label={`Twitter post: ${content.title}`}
              >
                <blockquote className="twitter-tweet">
                  <a
                    href={content.link.replace("x.com", "twitter.com")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View tweet
                  </a>
                </blockquote>
              </div>
            ) : content.type === "twitter" && (twitterError || !isValidTwitterUrl(content.link)) ? (
              // Twitter error fallback
              <div className="w-full p-4 bg-gray-100 text-center rounded-lg">
                <p className="text-sm text-red-600">
                  {twitterError
                    ? "Failed to load Twitter post. Please try again later."
                    : "Invalid Twitter post URL."}
                </p>
                <a
                  href={content.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View on Twitter/X
                </a>
              </div>
            ) : (
              // Non-Twitter iframe content
              iframeSrc && (
                <iframe
                  className="w-full max-w-full"
                  style={{ height: iframeHeight, minHeight: "300px" }}
                  src={iframeSrc}
                  title={`${content.type} content: ${content.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  sandbox={getSandboxAttributes(content.type)}
                  onLoad={() => setIframeLoaded(true)}
                  onError={(e) => {
                    console.error("Iframe load error:", e);
                    setIframeLoaded(true);
                  }}
                ></iframe>
              )
            )}
          </div>
          <p className="text-sm text-muted-foreground my-4">
            {content.description}
          </p>
          {(content.type === "linkedIn" || content.type === "blog") && (
            <a
              href={content.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
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