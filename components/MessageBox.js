import Image from "next/image";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import { useDispatch } from "react-redux";
import { infoFriendId } from "../redux/features/friendSlice";

function MessageBox({
  id,
  seen,
  user,
  setStyleOfMessage,
  setStyleOfMessageUser,
  setStyleOfChat
}) {

  const dispatch = useDispatch();
  const [realtimeDataOfFriend] = useCollection(db.collection("users"));

  const [realtimeMessages] = useCollection(
    db
      .collection("users")
      .doc(user.uid)
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "desc")
  );
  const ClickChatBox = async (FriendId) => {
    setStyleOfMessage(false);
    setStyleOfMessageUser(true);
    setStyleOfChat(true);
    const listMessage = db
      .collection("users")
      .doc(user.uid)
      .collection("chats")
      .doc(id);
    await listMessage.update({
      seen: true,
    });
    dispatch(
      infoFriendId({
        friendId: FriendId
      })
    );
  };
  return (
    <div>
      {realtimeDataOfFriend &&
        realtimeDataOfFriend.docs.map(
          (friend) =>
            friend.id === id && (
              <div
                onClick={() => ClickChatBox(friend.id)}
                key={friend.id}
                className="flex items-center hover:bg-gray-300 cursor-pointer p-2 mb-4 rounded-md"
              >
                <Image
                  className="rounded-full cursor-pointer"
                  width={50}
                  height={50}
                  src={friend.data().AvatarImage}
                />
                <div className="ml-4 w-full">
                  <h4 className="text-lg">
                    {friend.data().surname} {friend.data().name}{" "}
                  </h4>
                  <span
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: "1",
                      WebkitBoxOrient: "vertical",
                    }}
                    className="overflow-hidden overflow-ellipsis"
                  >
                    {realtimeMessages &&
                      realtimeMessages.docs[0].data().message}
                  </span>
                </div>
                {!seen && (
                  <div className="ml-10 rounded-full w-4 h-[11px] bg-blue-500" />
                )}
              </div>
            )
        )}
    </div>
  );
}

export default MessageBox;
