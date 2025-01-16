import { useUserContents } from "@/axios/hooks/useUserContents";
import AddContentDialog from "@/components/AddContentDialog";
import ContentCard from "@/components/ContentCard";
import { useAppSelector } from "@/redux/hooks";
import { Content } from "@/types";

const Home = () => {
  useUserContents();
  const { userContents } = useAppSelector((state) => state.contents);

  if (userContents?.length == 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-4 text-center">
        <p className="text-lg font-medium text-gray-600">
          Please add new content.
        </p>
        <AddContentDialog />
      </div>
    );
  }

  return (
    <div className="masonry masonry-md">
      {userContents?.map((content: Content) => (
        <ContentCard
          key={content._id}
          title={content.title}
          description={content.description}
          link={content.link}
          tags={content.tags}
          type={content.type}
          userId={content.userId}
        />
      ))}
    </div>
  );
};

export default Home;
