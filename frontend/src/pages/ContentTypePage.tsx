import AddContentDialog from "@/components/AddContentDialog";
import ContentCard from "@/components/ContentCard";
import { useAppSelector } from "@/redux/hooks";
import { Content } from "@/types";
import { useParams } from "react-router";

const ContentTypePage = () => {
  const { type } = useParams(); // Get type from URL params
  const { userContents } = useAppSelector((state) => state.contents); // Get contents from Redux

  console.log("Type from URL params:", type);
  console.log("All user contents:", userContents);

  // Ensure filteredContents is always an array
  const filteredContents =
    userContents?.filter(
      (content) => content.type?.toLowerCase() === type?.toLowerCase()
    ) || [];

  console.log("Filtered contents:", filteredContents);

  if (filteredContents.length == 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-4 text-center">
        <p className="text-lg font-medium text-gray-600">
          No content found for this category.
        </p>
        <AddContentDialog />
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4 p-4">
      {filteredContents.length > 0 &&
        filteredContents.map((content: Content) => (
          <ContentCard key={content._id} content={content} />
        ))}
    </div>
  );
};

export default ContentTypePage;
