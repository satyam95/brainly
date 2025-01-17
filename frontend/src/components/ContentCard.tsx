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
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { useAppDispatch } from "@/redux/hooks";
import { removeUserContent } from "@/redux/contentsSlice";
import apiClient from "@/axios/apiClient";
import toast from "react-hot-toast";
import Spinner from "./Spinner";

interface Content {
  _id: string;
  title: string;
  description: string;
  link: string;
  tags: string[];
  type: string;
  userId: string;
}

const ContentCard = ({
  _id,
  title,
  description,
  link,
  tags,
  type,
}: Content) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const parts = link.split("/");
  const pinId = parts[parts.length - 2];

  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await apiClient.delete(`/content/${_id}`);
      if (res.data.message) {
        toast.success(res.data.message);
        dispatch(removeUserContent(_id));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete content. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Define the height for skeleton and iframe based on the type
  const iframeHeight =
    {
      Youtube: "200px",
      Twitter: "500px",
      Facebook: "300px",
      Pinterest: "400px",
    }[type] || "300px";

  return (
    <Card className="break-inside">
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center">
          <h3>{title}</h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon">
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
          {type !== "Blog" && type !== "LinkedIn" && !iframeLoaded && (
            <Skeleton className={`w-full h-[${iframeHeight}]`} />
          )}
          {type === "Youtube" && (
            <iframe
              loading="lazy"
              className={`w-full h-[${iframeHeight}] ${
                !iframeLoaded ? "hidden" : ""
              }`}
              onLoad={() => setIframeLoaded(true)}
              src={link.replace("watch", "embed").replace("?v=", "/")}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          )}
          {type === "Twitter" && (
            <iframe
              loading="lazy"
              className={`h-[${iframeHeight}] w-full ${
                !iframeLoaded ? "hidden" : ""
              }`}
              onLoad={() => setIframeLoaded(true)}
              src={`https://twitframe.com/show?url=${link.replace(
                "x.com",
                "twitter.com"
              )}`}
              scrolling="no"
            ></iframe>
          )}
          {type === "Facebook" && (
            <iframe
              loading="lazy"
              className={`w-full h-[${iframeHeight}] ${
                !iframeLoaded ? "hidden" : ""
              }`}
              onLoad={() => setIframeLoaded(true)}
              src={`https://www.facebook.com/plugins/post.php?href=${link}`}
              style={{ border: "none", overflow: "hidden" }}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
          )}
          {type === "Pinterest" && (
            <iframe
              loading="lazy"
              src={`https://assets.pinterest.com/ext/embed.html?id=${pinId}`}
              className={`w-full h-[${iframeHeight}] ${
                !iframeLoaded ? "hidden" : ""
              }`}
              onLoad={() => setIframeLoaded(true)}
              scrolling="no"
            ></iframe>
          )}
        </div>
        <p className="text-sm text-muted-foreground my-4">{description}</p>
        {type === "LinkedIn" && (
          <a href={link} target="_blank" rel="noopener noreferrer">
            Visit Link
          </a>
        )}
        {type === "Blog" && (
          <a href={link} target="_blank" rel="noopener noreferrer">
            Visit Link
          </a>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={`${tag}-${index}`} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ContentCard;
