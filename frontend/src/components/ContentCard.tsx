import { Pencil, Share2, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Link } from "react-router";

interface Content {
  title: string;
  description: string;
  link: string;
  tags: string[];
  type: string;
  userId: string;
}

const ContentCard = ({ title, description, link, tags, type }: Content) => {
  const parts = link.split("/");
  const pinId = parts[parts.length - 2];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center">
          <h3>{title}</h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full rounded-lg overflow-hidden ">
          {type === "Youtube" && (
            <iframe
              className="w-full"
              src={link.replace("watch", "embed").replace("?v=", "/")}
              title="Parvesh Verma on Kejriwal, Delhi CM face, BJP Chances &amp; More | Delhi Elections 2025 | Ajeet Bharti"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          )}
          {type === "Twitter" && (
            <iframe
              src={`https://twitframe.com/show?url=${link.replace(
                "x.com",
                "twitter.com"
              )}`}
              className="w-full"
            ></iframe>
          )}
          {type === "Facebook" && (
            <iframe
              className="w-full"
              src={`https://www.facebook.com/plugins/post.php?href=${link}`}
              style={{ border: "none", overflow: "hidden" }}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
          )}
          {type === "Pinterest" && (
            <iframe
              src={`https://assets.pinterest.com/ext/embed.html?id=${pinId}`}
              className="w-full"
            ></iframe>
          )}
        </div>
        <p className="text-sm text-muted-foreground my-4">{description}</p>
        {type === "LinkedIn" && <Link to={link}>Vist Link</Link>}
        {type === "Blog" && <Link to={link}>Vist Link</Link>}
      </CardContent>
      <CardFooter>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ContentCard;
