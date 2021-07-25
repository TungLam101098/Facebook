import Image from "next/image";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";

const Contact = ({ id }) => {
  const [realtimeDataOfFriend] = useCollection(db.collection("users"));
  return (
    <div>
      {realtimeDataOfFriend &&
        realtimeDataOfFriend.docs.map(
          (friend) =>
            friend.id === id && (
              <div className="flex items-center space-x-3 mb-2 relative hover:bg-gray-200 cursor-pointer p-2 rounded-xl">
                <Image
                  className="rounded-full"
                  objectFit="cover"
                  src={friend.data().AvatarImage}
                  width={50}
                  height={50}
                  layout="fixed"
                />
                <p>{friend.data().surname} {friend.data().name} </p>
                <div className="absolute bottom-2 left-7 bg-green-400 h-3 w-3 rounded-full"></div>
              </div>
            )
        )}
    </div>
  );
};

export default Contact;
