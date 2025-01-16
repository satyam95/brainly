import { Outlet, useNavigate } from "react-router";
import Sidebar from "./Sidebar";
import AddContentDialog from "./AddContentDialog";
import ShareBrainDialog from "./ShareBrainDialog";
import { useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";

const Layout = () => {
  const { authUser } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!authUser) {
      navigate("/sign-in");
    }
  }, [authUser, navigate]);

  if (!authUser) {
    return null;
  }
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container h-full flex flex-col  mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-3xl font-bold">{authUser.firstName}'s Notes</h1>
            <div className="flex gap-2">
              <ShareBrainDialog />
              <AddContentDialog />
            </div>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
