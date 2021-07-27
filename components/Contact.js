import { Avatar } from "@material-ui/core";
import Image from "next/image";
import { useCollection } from "react-firebase-hooks/firestore";
import { db, firestore } from "../firebase";
import firebase from "firebase";

import {
  VideoCameraIcon,
  PhoneIcon,
  MinusIcon,
  XIcon,
  PlusCircleIcon,
  PhotographIcon,
  ReceiptTaxIcon,
  PresentationChartLineIcon,
  EmojiHappyIcon,
  ThumbUpIcon,
} from "@heroicons/react/solid";
import {  useRef, useState } from "react";
import Messager from "./Messager";

const Contact = ({ id, user }) => {
  const [realtimeDataOfFriend] = useCollection(db.collection("users"));

  const [styleOfChat, setStyleOfChat] = useState(false);
  const [styleOfIconChat, setStyleOfIconChat] = useState(false);
  const [focused, setFocused] = useState(false);
  const MessageRef = useRef(null);
  const [DataOfFriend, setDataOfFriend] = useState(null);
  const messagesRef = useRef(null);

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

  const submitMessage = async (e) => {
    e.preventDefault();
    if (!MessageRef.current.value) return;
    setFocused(false);
    if (user.uid === DataOfFriend.idFriend) {
      await db
      .collection("users")
      .doc(user.uid)
      .collection("chats")
      .doc(DataOfFriend.idFriend)
      .collection("messages")
      .add({
        id: user.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: MessageRef.current.value,
      });
    } else {
      await db
      .collection("users")
      .doc(user.uid)
      .collection("chats")
      .doc(DataOfFriend.idFriend)
      .collection("messages")
      .add({
        id: user.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: MessageRef.current.value,
      });

    await db
      .collection("users")
      .doc(DataOfFriend.idFriend)
      .collection("chats")
      .doc(user.uid)
      .collection("messages")
      .add({
        id: user.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: MessageRef.current.value,
      });
    }

    const listChatRef = db
      .collection("users")
      .doc(DataOfFriend.idFriend)
      .collection("chats")
      .doc(user.uid);
    const snapShotListChat = await listChatRef.get();
    if (snapShotListChat.exists) {
      await listChatRef.set({
        id: user.uid,
        seen: false
      });
    }
    
    MessageRef.current.value = "";
  };
  const scrollToBottom = () => {
    messagesRef.current.scrollIntoView({
      behavior: "smooth"
    });
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
  const handleChange = (e) => {
    if (e.target.value === "") {
      setFocused(false);
    } else {
      setFocused(true);
    }
  };
  const onBlur = () => {
    setFocused(false);
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
                <p>
                  {friend.data().surname} {friend.data().name}{" "}
                </p>
                <div className="absolute bottom-2 left-7 bg-green-400 h-3 w-3 rounded-full border-white border-2"></div>
              </div>
            )
        )}
      {styleOfChat && (
        <div className="h-[455px] w-[338px] fixed bottom-0 right-20 rounded-lg bg-white z-10">
          <div className="flex-grow">
            <div className="flex justify-between p-2 items-center shadow-md">
              <div className="flex justify-center items-center">
                <div className="relative">
                  <Avatar src={DataOfFriend.img} />
                  <div className="absolute bottom-0 right-1 bg-green-400 h-3 w-3 rounded-full border-white border-2"></div>
                </div>
                <div className="ml-2 relative cursor-pointer">
                  <h4 className="font-bold text-base">
                    {DataOfFriend.fullName}
                  </h4>
                  <span className="text-sm">Đang hoạt động</span>
                </div>
              </div>
              <div className="flex space-x-4">
                <VideoCameraIcon className="h-5 text-blue-500 cursor-pointer" />
                <PhoneIcon className="h-5 text-blue-500 cursor-pointer" />
                <MinusIcon
                  onClick={() => turnOffChat()}
                  className="h-5 text-blue-500 cursor-pointer"
                />
                <XIcon
                  onClick={() => closeChat()}
                  className="h-5 text-blue-500 cursor-pointer"
                />
              </div>
            </div>
            <div className="h-[340px] pb-2 flex-grow overflow-y-auto p-2">
              <Messager img={DataOfFriend.img} user={user} id={DataOfFriend.idFriend}>
              </Messager>
              <div ref={messagesRef}  />
            </div>
          </div>
          <div className="flex justify-center flex-grow absolute bottom-2.5">
            <div className="flex space-x-3">
              <PlusCircleIcon className="h-7 text-blue-500" />
              <PhotographIcon
                className={`h-7 text-blue-500 ${focused ? "hidden" : ""}`}
              />
              <ReceiptTaxIcon
                className={`h-7 text-blue-500 ${focused ? "hidden" : ""}`}
              />
              <PresentationChartLineIcon
                className={`h-7 text-blue-500 ${focused ? "hidden" : ""}`}
              />
              <form className="relative ">
                <input
                  type="text"
                  ref={MessageRef}
                  onBlur={onBlur}
                  onChange={(e) => handleChange(e)}
                  className={` ${
                    focused ? "w-[248px]" : "w-32"
                  } rounded-xl px-1 pl-2 py-1 bg-gray-200 border-none focus:outline-none`}
                  placeholder="Aa"
                />
                <EmojiHappyIcon className="h-7 text-blue-500 absolute bottom-0.5 right-2" />
                <button hidden onClick={submitMessage} type="submit">
                  Submit
                </button>
              </form>
              <ThumbUpIcon className="h-7 text-blue-500" />
            </div>
          </div>
        </div>
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
