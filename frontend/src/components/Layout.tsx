import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import AddContentDialog from "./AddContentDialog";
import ShareBrainDialog from "./ShareBrainDialog";

const Layout = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-3xl font-bold">All Notes</h1>
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
