import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import { Button } from "./ui/button";
import { Plus, Share } from "lucide-react";

const Layout = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-3xl font-bold">All Notes</h1>
            <div className="flex gap-2">
              <Button variant="outline">
                <Share className="mr-2 h-4 w-4" />
                Share Brain
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Content
              </Button>
            </div>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
