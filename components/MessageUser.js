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
  PaperAirplaneIcon
} from "@heroicons/react/solid";
import { useRef, useState } from "react";
import Message from "./Message";
import firebase from "firebase";
import { db } from "../firebase";
import { Avatar } from "@material-ui/core";
import { useRouter } from "next/router";

function MessageUser({DataOfFriend, turnOffChat, closeChat, user}) {
  const router = useRouter();
  const MessageRef = useRef(null);
  const [focused, setFocused] = useState(false);

  const onBlur = () => {
    setFocused(false);
  };
  const handleChange = (e) => {
    if (e.target.value === "") {
      setFocused(false);
    } else {
      setFocused(true);
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

    const listMessage = db
      .collection("users")
      .doc(user.uid)
      .collection("chats")
      .doc(DataOfFriend.idFriend);
    await listMessage.update({
      seen: true,
    });
    
    MessageRef.current.value = "";
  };

  const callButton = () => {
    if (user.uid !== DataOfFriend.idFriend) {
      const win = window.open(`call?id=${DataOfFriend.idFriend}`, "_blank");
      win.focus();
    }
    
  }

  const linkToUser = () => {
    router.push(`/user?id=${DataOfFriend.idFriend}`);
  }

  return (
    <div className="h-[455px] w-[338px] fixed bottom-0 right-2 sm:right-20 rounded-lg bg-white z-10">
          <div className="flex-grow">
            <div className="flex justify-between p-2 items-center shadow-md">
              <div onClick={linkToUser} className="flex justify-center items-center">
                <div className="relative cursor-pointer">
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
                <VideoCameraIcon onClick={callButton} className="h-5 text-blue-500 cursor-pointer" />
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
              <Message img={DataOfFriend.img} user={user} id={DataOfFriend.idFriend}>
              </Message>
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
                <EmojiHappyIcon className="h-7 text-blue-500 absolute bottom-0.5 right-2"/>
                <button hidden onClick={submitMessage} type="submit">
                  Submit
                </button>
              </form>
              <ThumbUpIcon className="h-7 text-blue-500 hidden sm:block" />
              <PaperAirplaneIcon onClick={submitMessage} className="h-7 text-blue-500 cursor-pointer block sm:hidden" />
            </div>
          </div>
        </div>
  )
}

export default MessageUser
