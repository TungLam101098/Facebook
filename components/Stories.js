import Image from "next/image";
import { PlusCircleIcon } from "@heroicons/react/solid";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import { useRouter } from "next/router";
import StoryCards from "./StoryCards";
import Carousel from "react-elastic-carousel";

const Stories = ({ user }) => {
  const router = useRouter();
  const [realtimeUser] = useCollection(db.collection("users"));

  const [realtimeFriends] = useCollection(
    db.collection("users").doc(user.uid).collection("listfriends")
  );

  const addStory = (id) => {
    if (!id) return;
    router.push(`/stories?id=${id}`);
  };
  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 350, itemsToShow: 2 },
    { width: 550, itemsToShow: 2 },
    { width: 768, itemsToShow: 2 },
    { width: 1200, itemsToShow: 2 },
  ];

  return (
    <div className="flex justify-center space-x-3 mx-auto">
      {realtimeUser &&
        realtimeUser.docs.map(
          (dataUser) =>
            dataUser.id === user.uid && (
              <div
                key={dataUser.id}
                style={{
                  borderBottomLeftRadius: "24px",
                  borderBottomRightRadius: "24px",
                  minWidth: "8rem",
                }}
                onClick={() => addStory(dataUser.id)}
                className="relative h-56 w-32 cursor-pointer overflow-x 
    transition duration-200 transform ease-in hover:scale-105 hover:animate-pulse shadow-xl ml-10 sm:ml-0
    "
              >
                <Image
                  className="object-cover filter brightness-75 rounded-3xl"
                  src={dataUser.data().AvatarImage}
                  layout="fill"
                />
                <div className="absolute opacity-100 z-40 bottom-7 left-12 bg-gray-100 rounded-full">
                  <PlusCircleIcon className="h-10 text-blue-500" />
                </div>
                <div
                  style={{
                    borderBottomLeftRadius: "24px",
                    borderBottomRightRadius: "24px",
                  }}
                  className="absolute opacity-100 bottom-0 h-12 w-full bg-gray-100 text-center text-sm font-bold truncate pt-4"
                >
                  <p>T???o tin</p>
                </div>
              </div>
            )
        )}

      {realtimeFriends && (
        <Carousel breakPoints={breakPoints} preventDefaultTouchmoveEvent={true}>
          {realtimeFriends.docs.map((friend) => (
            <StoryCards key={friend.id} uid={friend.id} />
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default Stories;
