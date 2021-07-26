import { Avatar } from "@material-ui/core";
import { useEffect, useRef } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";

function Messager({ img, id, user }) {
  const messagesRef = useRef(null);
  const [realtimeMessages] = useCollection(
    db
      .collection("users")
      .doc(user.uid)
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  useEffect(() => {
    if (messagesRef.current) {
      scrollToBottom();
    }
  }, [realtimeMessages]);
  const scrollToBottom = () => {
    messagesRef.current.scrollIntoView({
      behavior: "smooth"
    });
  };
  return (
    <div>
      {realtimeMessages &&
        realtimeMessages.docs.map((message) =>
          message.data().id === user.uid ? (
            <div
              style={{ width: "fit-content" }}
              className="flex justify-center items-center ml-auto text-center mt-1"
            >
              <span className="bg-blue-600 rounded-xl p-2 text-white">
                {message.data().message}
              </span>
            </div>
          ) : (
            <div
              style={{ width: "fit-content" }}
              className="flex justify-center items-center text-left min-w-[20px] mt-1"
            >
              <Avatar src={img} />
              <span className="bg-gray-200 rounded-xl p-2 ml-2">
                {message.data().message}
              </span>
            </div>
          )
        )}
        <div ref={messagesRef} />
    </div>
  );
}

export default Messager;
