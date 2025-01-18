import { useState } from "react";
import { Share, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import apiClient from "@/axios/apiClient";
import { removeShareLink, setShareLink } from "@/redux/userSlice";

export default function ShareBrainDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const shareLink = useAppSelector((state) => state.user.shareLink);
  const dispatch = useAppDispatch();

  const generateShareLink = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post("/brain/share", { share: true });
      dispatch(
        setShareLink(
          `${import.meta.env.VITE_FRONTEND_URL}/brain/${response.data.hash}`
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to generate share link.");
    } finally {
      setLoading(false);
    }
  };

  const deleteShareLink = async () => {
    if (!shareLink) return;
    setLoading(true);
    setError(null);
    try {
      await apiClient.post("/brain/share", { share: false });
      dispatch(removeShareLink());
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to remove share link.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000); // Reset copied state after 5 seconds
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share className="mr-2 h-4 w-4" />
          Share Brain
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Your Second Brain</DialogTitle>
          <DialogDescription>
            Share your entire collection of notes, documents, tweets, and videos
            with others. They'll be able to import your content into their own
            Second Brain.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {shareLink ? (
            <div className="space-y-2 w-full flex flex-col justify-center">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
                <Button
                  variant="secondary"
                  onClick={handleCopy}
                  disabled={copied}
                >
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <Button
                variant="destructive"
                onClick={deleteShareLink}
                disabled={loading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Link
              </Button>
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={generateShareLink}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Share Link"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
