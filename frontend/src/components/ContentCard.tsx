import { Pencil, Trash2, Loader2 } from "lucide-react";
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
  const [isLoaded, setIsLoaded] = useState(false); // Renamed from iframeLoaded for clarity
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [twitterError, setTwitterError] = useState<string | null>(null);
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
    const isValid =
      (url.includes("twitter.com") || url.includes("x.com")) &&
      /\/status\/\d+$/.test(url);
    if (!isValid) {
      console.warn(`Invalid Twitter URL: ${url}`);
      setTwitterError("Invalid Twitter URL format");
    }
    return isValid;
  };

  // Function to get embed height based on content type
  const getEmbedHeight = (type: string) => {
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

  const embedHeight = getEmbedHeight(content.type);

  // Conditional src URL for embed (non-Twitter content)
  const embedSrc = (() => {
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

  // Determine sandbox attributes for non-Twitter embeds
  const getSandboxAttributes = (type: string) => {
    const baseSandbox = "allow-scripts allow-same-origin allow-presentation";
    return baseSandbox;
  };

  // Load Twitter widget with retry mechanism
  useEffect(() => {
    if (content.type === "twitter" && isValidTwitterUrl(content.link) && !isLoaded) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      script.onload = () => {
        const tryLoadWidget = (attempts = 3, delay = 500) => {
          if (window.twttr?.widgets && twitterWidgetRef.current) {
            window.twttr.widgets
              .load(twitterWidgetRef.current)
              .then(() => setIsLoaded(true))
              .catch((err) => {
                if (attempts > 0) {
                  setTimeout(() => tryLoadWidget(attempts - 1, delay), delay);
                } else {
                  setTwitterError("Failed to render Twitter post after retries");
                  setIsLoaded(true);
                }
              });
          } else if (attempts > 0) {
            setTimeout(() => tryLoadWidget(attempts - 1, delay), delay);
          } else {
            setTwitterError("Twitter widget script not loaded");
            setIsLoaded(true);
          }
        };
        tryLoadWidget();
      };
      script.onerror = () => {
        setTwitterError("Failed to load Twitter widget script");
        setIsLoaded(true);
      };
      document.body.appendChild(script);

      const timer = setTimeout(() => {
        if (!isLoaded) {
          setTwitterError("Twitter widget load timeout");
          setIsLoaded(true);
        }
      }, 5000);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
        clearTimeout(timer);
      };
    } else if (embedSrc && !isLoaded) {
      const timer = setTimeout(() => setIsLoaded(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, content.type, content.link, embedSrc]);

  return (
    <>
      <Card className="break-inside shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-4 border-b border-gray-200">
          <CardTitle className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">{content.title}</h3>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowEditDialog(true)}
                className="hover:bg-gray-100"
                aria-label="Edit content"
              >
                <Pencil size={16} color="#4B5563" /> {/* Fixed type error by using size and color props */}
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                size="icon"
                disabled={isDeleting}
                className="hover:bg-gray-100"
                aria-label="Delete content"
              >
                {isDeleting ? <Loader2 size={16} color="#4B5563" className="animate-spin" /> : <Trash2 size={16} color="#4B5563" />}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="w-full rounded-lg overflow-hidden">
            {!isLoaded ? (
              <Skeleton className="w-full h-[500px] bg-gray-200" />
            ) : content.type === "twitter" && isValidTwitterUrl(content.link) && !twitterError ? (
              <div
                ref={twitterWidgetRef}
                className="w-full twitter-embed-container"
                style={{ minHeight: embedHeight }}
                role="region"
                aria-label={`Twitter post: ${content.title}`}
              >
                <blockquote className="twitter-tweet">
                  <a
                    href={content.link.replace("x.com", "twitter.com")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View tweet
                  </a>
                </blockquote>
              </div>
            ) : content.type === "twitter" && (twitterError || !isValidTwitterUrl(content.link)) ? (
              <div className="w-full p-4 bg-red-50 rounded-lg text-center">
                <p className="text-sm text-red-600 font-medium">
                  {twitterError || "Invalid Twitter post URL"}
                </p>
                <a
                  href={content.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  View on Twitter/X
                </a>
              </div>
            ) : (
              embedSrc && (
                <iframe
                  className="w-full max-w-full rounded-lg"
                  style={{ height: embedHeight, minHeight: "300px" }}
                  src={embedSrc}
                  title={`${content.type} content: ${content.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  sandbox={getSandboxAttributes(content.type)}
                  onLoad={() => setIsLoaded(true)}
                  onError={(e) => {
                    console.error("Iframe load error:", e);
                    setIsLoaded(true);
                  }}
                ></iframe>
              )
            )}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            {content.description}
          </p>
          {(content.type === "linkedIn" || content.type === "blog") && (
            <a
              href={content.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Visit Link
            </a>
          )}
        </CardContent>
        <CardFooter className="p-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {content.tags.map((tag, index) => (
              <Badge key={`${tag}-${index}`} variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
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