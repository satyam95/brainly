import { cn } from "@/lib/utils";
import {
  Brain,
  FileText,
  Youtube,
  Twitter,
  LogOut,
  Link,
  Facebook,
  Podcast,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import apiClient from "@/axios/apiClient";
import toast from "react-hot-toast";
import { setAuthUser } from "@/redux/userSlice";

const sidebarItems = [
  { icon: Link, slug: "type_link", label: "Links" },
  { icon: Youtube, slug: "type_youtube", label: "YouTube" },
  { icon: Twitter, slug: "type_twitter", label: "Twitter" },
  { icon: Facebook, slug: "type_facebook", label: "Facebook" },
  { icon: Podcast, slug: "type_pinterest", label: "Pinterest" },
  { icon: FileText, slug: "type_blog", label: "Blogs" },
];

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { authUser } = useAppSelector((state) => state.user);
  async function onSubmit() {
    try {
      const res = await apiClient.get("/user/sign-out");
      if (res.data.message) {
        dispatch(setAuthUser(null));
        navigate("/sign-in");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="w-64 border-r bg-card px-3 flex flex-col">
      <NavLink to="/">
        <div className="flex items-center gap-2 p-4">
          <Brain className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold">Second Brain</span>
        </div>
      </NavLink>
      <nav className="space-y-1 grow">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.label}
            to={`/${item.slug.toLowerCase()}`}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage alt={authUser?.firstName} />
              <AvatarFallback>{authUser?.firstName.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="font-medium truncate">
                {authUser?.firstName} {authUser?.lastName}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onSubmit}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
