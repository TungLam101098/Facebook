import { Avatar } from "@material-ui/core";
import Image from "next/image";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import firebase from "firebase";

import {  useRef, useState } from "react";

import MessageUser from "./MessageUser";

const Contact = ({ id, user }) => {
  const [realtimeDataOfFriend] = useCollection(db.collection("users"));

  const [styleOfChat, setStyleOfChat] = useState(false);
  const [styleOfIconChat, setStyleOfIconChat] = useState(false);
  const [DataOfFriend, setDataOfFriend] = useState(null);

  const addChat = async (idFriend, img, surname, name) => {
    setStyleOfChat(true);
    setDataOfFriend({
      idFriend: idFriend,
      img: img,
      fullName: surname.concat(" ", name),
    });
    
    const listChatUserRef = db
      .collection("users")
      .doc(user.uid)
      .collection("chats")
      .doc(idFriend);
    const snapShotListFriend = await listChatUserRef.get();
    if (!snapShotListFriend.exists) {
      await listChatUserRef.set({
        id: idFriend,
      });
    }

    const listChatRef = db
      .collection("users")
      .doc(idFriend)
      .collection("chats")
      .doc(user.uid);
    const snapShotListChat = await listChatRef.get();
    if (!snapShotListChat.exists) {
      await listChatRef.set({
        id: user.uid,
      });
    }
  };

  const turnOffChat = () => {
    setStyleOfChat(false);
    setStyleOfIconChat(true);
  };
  const turnOnChat = () => {
    setStyleOfChat(true);
    setStyleOfIconChat(false);
  };
  const closeChat = () => {
    setStyleOfChat(false);
  };
  return (
    <div>
      {realtimeDataOfFriend &&
        realtimeDataOfFriend.docs.map(
          (friend) =>
            friend.id === id && (
              <div
                key={friend.id}
                onClick={() =>
                  addChat(
                    friend.id,
                    friend.data().AvatarImage,
                    friend.data().surname,
                    friend.data().name
                  )
                }
                className="flex items-center space-x-3 mb-2 relative hover:bg-gray-200 cursor-pointer p-2 rounded-xl"
              >
                <Image
                  className="rounded-full"
                  objectFit="cover"
                  src={friend.data().AvatarImage}
                  width={50}
                  height={50}
                  layout="fixed"
                />
                <p className="hidden sm:block">
                  {friend.data().surname} {friend.data().name}{" "}
                </p>
                <div className="absolute bottom-2 left-7 bg-green-400 h-3 w-3 rounded-full border-white border-2"></div>
              </div>
            )
        )}
      {styleOfChat && (
        <MessageUser DataOfFriend={DataOfFriend} turnOffChat={turnOffChat} closeChat={closeChat} user={user} />
      )}
      {styleOfIconChat && (
        <div
          onClick={() => turnOnChat()}
          className="bg-blue-500 rounded-full absolute right-6 bottom-7 cursor-pointer"
        >
          <Avatar src={DataOfFriend.img} />
        </div>
      )}
    </div>
  );
};

export default Contact;
