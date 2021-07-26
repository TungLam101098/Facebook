import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import StoryCard from "./StoryCard";

function StoryCards({uid}) {
  const [realtimeStories] = useCollection(
    db
      .collection("users")
      .doc(uid)
      .collection("stories")
      .orderBy("timestamp", "desc")
  );
  return (
    <div className="flex justify-center space-x-3 mx-auto">
      {realtimeStories &&
        realtimeStories.docs.map((story) => (
          <StoryCard
          key={story.id}
          name={story.data().name}
          src={story.data().imageStory}
          profile={story.data().AvatarImage}
        />
        ))}
      
    </div>
  )
}

export default StoryCards
