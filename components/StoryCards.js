import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import StoryCard from "./StoryCard";
import { Carousel } from "antd";

function StoryCards({ uid }) {
  const [realtimeStories] = useCollection(
    db
      .collection("users")
      .doc(uid)
      .collection("stories")
      .orderBy("timestamp", "desc")
  );
  return (
    <>
      {/* <Carousel> */}
        {realtimeStories &&
          realtimeStories.docs.map((story) => (
            <div>
              <StoryCard
                key={story.id}
                name={story.data().name}
                src={story.data().imageStory}
                profile={story.data().AvatarImage}
              />
            </div>
          ))}
      {/* </Carousel> */}
    </>
  );
}

export default StoryCards;
