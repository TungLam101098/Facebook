import InputBox from "./InputBox";
import Posts from "./Posts";
import Stories from "./Stories";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";

const Feed = ({ user }) => {
  const [realtimeFriends] = useCollection(
    db.collection("users").doc(user.uid).collection("listfriends")
  );
  return (
    <div className="flex-grow h-screen pb-44 pt-6 mr-4 xl:mr-40 overflow-y-auto scrollbar-hide">
      <div className="mx-auto max-w-md md:max-w-2xl">
        {/* Stories */}
        <Stories user={user} />
        {/* InputBox */}
        <InputBox user={user} />
        {/* Posts */}
        {realtimeFriends &&
          realtimeFriends.docs.map((friend) => <Posts idUser={user.uid} uid={friend.id} />)}
      </div>
    </div>
  );
};

export default Feed;
