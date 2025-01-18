import apiClient from "@/axios/apiClient";
import ContentCard from "@/components/ContentCard";
import { Content } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface ShareContentTypes {
  content: Content[];
  email: string;
  firstName: string;
  lastName: string;
}

const PublicBrainPage = () => {
  const { shareLink } = useParams();
  const [contentData, setContentData] = useState<ShareContentTypes | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiClient.get(`/brain/${shareLink}`);
        setContentData(res.data);
      } catch (err: any) {
        console.error("Error fetching contents:", err);
        setError("Invalid shareable link or failed to load the shared brain contents.");
      } finally {
        setLoading(false);
      }
    };

    if (shareLink) {
      fetchContents();
    }
  }, [shareLink]);

  return (
    <div className="container mx-auto py-8">
      {contentData && (
        <h1 className="text-3xl font-bold mb-8">
          {contentData.firstName}'s Shared Notes
        </h1>
      )}
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && contentData && (
        <div className="masonry masonry-md">
          {contentData.content.map((content: Content) => (
            <ContentCard key={content._id} content={content} />
          ))}
        </div>
      )}
      {!loading && !contentData && !error && (
        <p className="text-gray-500">No contents available to display.</p>
      )}
    </div>
  );
};

export default PublicBrainPage;
