import ContentCard from "@/components/ContentCard";

const contents = [
  {
    _id: "67842912f6822d2dfa5e8759",
    title: "The Crown Final Season",
    description:
      "Witness the end of an era. The final season of The Crown is now streaming, only on Netflix.",
    link: "https://x.com/TheCrownNetflix/status/1573724707802808324",
    tags: ["tweet", "series"],
    type: "Twitter",
    userId: "6783dbe68abe753b5a11e426",
  },
  {
    _id: "67842912f6822d2dfa5e8760",
    title: "Squid Game: The Challenge",
    description:
      "Can you survive the game? Squid Game: The Challenge premieres tomorrow on Netflix.",
    link: "https://www.youtube.com/watch?v=0JCq_hmNhJs",
    tags: ["video", "reality show"],
    type: "Youtube",
    userId: "6783dbe68abe753b5a11e427",
  },
  {
    _id: "67842912f6822d2dfa5e8761",
    title: "Stranger Things Season 5 Teaser",
    description:
      "The wait is almost over. The Stranger Things Season 5 teaser is here!",
    link: "https://www.facebook.com/NetflixUK/videos/stranger-things-season-5-teaser-netflix/1284515949560504/",
    tags: ["teaser", "series"],
    type: "Facebook",
    userId: "6783dbe68abe753b5a11e428",
  },
  {
    _id: "67842912f6822d2dfa5e8763",
    title: "The Witcher Season 3 Trailer",
    description:
      "The hunt for Ciri begins. Watch The Witcher Season 3 trailer now on Netflix.",
    link: "https://www.youtube.com/watch?v=SzS8Ao0H6Co",
    tags: ["trailer", "series"],
    type: "Youtube",
    userId: "6783dbe68abe753b5a11e430",
  },
  {
    _id: "67842912f6822d2dfa5e8764",
    title: "Wednesday: Season 2",
    description:
      "She's back and creepier than ever. Wednesday Season 2 is streaming now on Netflix.",
    link: "https://in.pinterest.com/pin/943856034402468967/",
    tags: ["blog", "series"],
    type: "Pinterest",
    userId: "6783dbe68abe753b5a11e431",
  },
  {
    _id: "67842912f6822d2dfa5e8765",
    title: "Bridgerton Season 3",
    description:
      "The romance and drama return. Bridgerton Season 3 is out now, only on Netflix.",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7280939088474468352/",
    tags: ["announcement", "series"],
    type: "LinkedIn",
    userId: "6783dbe68abe753b5a11e432",
  },
  {
    _id: "67842912f6822d2dfa5e8766",
    title: "Extraction 3 Official Trailer",
    description:
      "The mission isn't over yet. Watch the Extraction 3 trailer now on Netflix.",
    link: "https://blog.netflix.com/extraction3-trailer",
    tags: ["movie", "trailer", "blog"],
    type: "Blog",
    userId: "6783dbe68abe753b5a11e433",
  },
];

const Home = () => {
  return (
    <div className="masonry masonry-md">
      {contents.map((content) => (
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
