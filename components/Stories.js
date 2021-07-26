import Image from "next/image";
import { PlusCircleIcon } from "@heroicons/react/solid";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import { useRouter } from "next/router";
import StoryCards from "./StoryCards";

const Stories = ({ user }) => {
  const router = useRouter();
  const [realtimeUser] = useCollection(db.collection("users"));

  const [realtimeFriends] = useCollection(
    db.collection("users").doc(user.uid).collection("listfriends")
  );

  const addStory = (id) => {
    if (!id) return;
    router.push(`/stories?id=${id}`);
  }

  return (
    <div className="flex justify-center space-x-3 mx-auto">
      {realtimeUser &&
        realtimeUser.docs.map(
          (dataUser) =>
            dataUser.id === user.uid && (
              <div
                style={{
                  borderBottomLeftRadius: "24px",
                  borderBottomRightRadius: "24px",
                }}
                onClick={() => addStory(dataUser.id)}
                className="relative h-14 w-14 md:h-20 md:w-20 lg:h-56 lg:w-32 cursor-pointer overflow-x 
    transition duration-200 transform ease-in hover:scale-105 hover:animate-pulse shadow-xl
    "
              >
                <Image
                  className="object-cover filter brightness-75 rounded-full lg:rounded-3xl"
                  src={dataUser.data().AvatarImage}
                  layout="fill"
                />
                <div className="absolute opacity-0 lg:opacity-100 z-50 bottom-7 left-12 bg-gray-100 rounded-full">
                  <PlusCircleIcon className="h-10 text-blue-500" />
                </div>
                <div
                  style={{
                    borderBottomLeftRadius: "24px",
                    borderBottomRightRadius: "24px",
                  }}
                  className="absolute opacity-0 lg:opacity-100 bottom-0 h-12 w-full bg-gray-100 text-center text-sm font-bold truncate pt-4"
                >
                  <p>Tạo tin</p>
                </div>
              </div>
            )
        )}
      {realtimeFriends &&
          realtimeFriends.docs.map((friend) => <StoryCards uid={friend.id} />)}
    </div>
  );
};

export default Stories;
