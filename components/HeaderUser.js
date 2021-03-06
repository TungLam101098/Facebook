import { CameraIcon } from "@heroicons/react/solid";
import { UserAddIcon } from "@heroicons/react/solid";
import { ChatIcon } from "@heroicons/react/solid";
import { MenuAlt4Icon } from "@heroicons/react/solid";
import { PlusCircleIcon } from "@heroicons/react/solid";
import { UsersIcon } from "@heroicons/react/solid";
import { UserRemoveIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../firebase";
import firebase from "firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { Avatar } from "@material-ui/core";
import MessageUser from "./MessageUser";
import ModalElement from "./Modal";

import { Image } from "antd";

function HeaderUser({ userData, id }) {
  const [user] = useAuthState(auth);
  const [itIsMe, setItIsMe] = useState(false);
  const [sended, setSended] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [dataUser, setDataUser] = useState(null);
  const [styleOfBackgroundImage, setStyleOfBackgroundImage] = useState(false);
  const [BackgroundImage, setBackgroundImage] = useState(null);
  const [realtimeDataUser] = useCollection(db.collection("users"));
  const [styleOfChat, setStyleOfChat] = useState(false);
  const [DataOfFriend, setDataOfFriend] = useState(null);
  const [styleOfIconChat, setStyleOfIconChat] = useState(false);

  useEffect(() => {
    if (!user) {
      return false;
    }
    if (user.uid === id) {
      setItIsMe(true);
    } else {
      setItIsMe(false);
    }
    const getData = async () => {
      const listSendedFriendsRef = db
        .collection("users")
        .doc(user.uid)
        .collection("listsendfriends")
        .doc(id);
      const doc = await listSendedFriendsRef.get();
      if (!doc.exists) {
        setSended(false);
      } else {
        setSended(true);
      }

      const listFriendsRef = db
        .collection("users")
        .doc(user.uid)
        .collection("listfriends")
        .doc(id);
      const docListFriend = await listFriendsRef.get();
      if (!docListFriend.exists) {
        setIsFriend(false);
      } else {
        setIsFriend(true);
      }
    };
    getData();
  }, [id]);
  useEffect(() => {
    const getDataOfUser = async () => {
      if (!user) {
        return false;
      }
      const getDataOfUserRef = db.collection("users").doc(user.uid);
      const docUser = await getDataOfUserRef.get();
      if (!docUser.exists) {
        console.log("no data");
      } else {
        setDataUser(docUser.data());
      }
    };
    getDataOfUser();
  }, [user]);

  const addFriends = async () => {
    if (user.uid === id) {
      return false;
    } else {
      setSended(true);
      const listSendFriendsRef = db
        .collection("users")
        .doc(user.uid)
        .collection("listsendfriends")
        .doc(id);
      const snapShot = await listSendFriendsRef.get();
      if (!snapShot.exists) {
        await listSendFriendsRef.set({
          id: id,
        });
      }
      await db
        .collection("users")
        .doc(id)
        .collection("listnotification")
        .add({
          id: user.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          type: "addFriends",
          seen: false,
          name: dataUser.surname.concat(" ", dataUser.name),
          AvatarImage: dataUser.AvatarImage,
        });

      const listapprovalwaittingfriendsRef = db
        .collection("users")
        .doc(id)
        .collection("listapprovalwaittingfriends")
        .doc(user.uid);
      const snapShotwaitting = await listapprovalwaittingfriendsRef.get();
      if (!snapShotwaitting.exists) {
        await listapprovalwaittingfriendsRef.set({
          id: user.uid,
        });
      }
    }
  };

  const addBackgroundImage = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readEvent) => {
      setBackgroundImage(readEvent.target.result);
      setStyleOfBackgroundImage(true);
    };
  };

  const cancelBackgroundImage = () => {
    setBackgroundImage(null);
    setStyleOfBackgroundImage(false);
  };

  const completeBackgroundImage = () => {
    if (BackgroundImage) {
      const uploadTask = storage
        .ref(`backgrounds/${user.uid}`)
        .putString(BackgroundImage, "data_url");
      uploadTask.on(
        "state_change",
        (snapshot) => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING:
              console.log("Upload is running");
              break;
          }
        },
        (error) => console.log(error),
        () => {
          storage
            .ref("backgrounds")
            .child(user.uid)
            .getDownloadURL()
            .then((url) => {
              db.collection("users").doc(user.uid).set(
                {
                  BackgroundImage: url,
                },
                { merge: true }
              );
            });
        }
      );
      setStyleOfBackgroundImage(false);
    }
  };

  const deleteFriend = async () => {
    setSended(false);
    await db
      .collection("users")
      .doc(user.uid)
      .collection("listsendfriends")
      .doc(id)
      .delete();
    await db
      .collection("users")
      .doc(id)
      .collection("listapprovalwaittingfriends")
      .doc(user.uid)
      .delete();
  };

  const addChat = async () => {
    setDataOfFriend({
      idFriend: id,
      img: userData.AvatarImage,
      fullName: userData.surname.concat(" ", userData.name),
      status: userData.status
    });
    setStyleOfChat(true);

    const listChatUserRef = db
      .collection("users")
      .doc(user.uid)
      .collection("chats")
      .doc(id);
    const snapShotListFriend = await listChatUserRef.get();
    if (!snapShotListFriend.exists) {
      await listChatUserRef.set({
        id: id,
      });
    }

    const listChatRef = db
      .collection("users")
      .doc(id)
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

  if (!user || !userData) {
    return null;
  }

  return (
    <div>
      <div className="">
        <div className="flex justify-center items-center bg-gray-200">
          <div className="w-full sm:w-5/6 relative">
            <div className="relative">
              {realtimeDataUser &&
                realtimeDataUser.docs.map(
                  (userDataInDoc) =>
                    userDataInDoc.id === id &&
                    !styleOfBackgroundImage &&
                    userDataInDoc.data().BackgroundImage && (
                      <img
                        key={userDataInDoc.id}
                        className="w-full h-44 sm:h-96 object-cover rounded-lg"
                        src={userDataInDoc.data().BackgroundImage}
                      />
                    )
                )}
              {realtimeDataUser &&
                realtimeDataUser.docs.map(
                  (userDataInDoc) =>
                    userDataInDoc.id === id &&
                    !styleOfBackgroundImage &&
                    !userDataInDoc.data().BackgroundImage && (
                      <div
                        key={userDataInDoc.id}
                        className="w-full h-44 sm:h-96 bg-gray-500 object-cover rounded-lg"
                      ></div>
                    )
                )}
              {styleOfBackgroundImage && (
                <img
                  className="w-full h-44 sm:h-96 object-cover rounded-lg"
                  src={BackgroundImage}
                />
              )}

              {!styleOfBackgroundImage ? (
                itIsMe && (
                  <label className="flex justify-center items-center absolute bottom-5 right-[-20px] sm:right-5 cursor-pointer">
                    <input
                      onChange={addBackgroundImage}
                      type="file"
                      style={{ display: "none" }}
                    />
                    <div className="flex rounded-lg border-none bg-gray-200 px-3 py-2 transform scale-50 sm:scale-100">
                      <CameraIcon className="h-6" /> Ch???nh s???a ???nh b??a
                    </div>
                  </label>
                )
              ) : (
                <div
                  style={{ backgroundColor: "rgba(52, 52, 52, 0.8)" }}
                  className="flex bg-black justify-between p-5  w-full h-20 absolute top-0 text-white"
                >
                  <span>???nh b??a c???a b???n hi???n th??? c??ng khai</span>
                  <div className="space-x-4">
                    <button
                      onClick={cancelBackgroundImage}
                      className="px-4 py-2 bg-gray-400 rounded-lg"
                    >
                      Hu???
                    </button>
                    <button
                      onClick={completeBackgroundImage}
                      className="px-4 py-2 bg-blue-500 rounded-lg"
                    >
                      L??u thay ?????i
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div style={{ transform: 'translate(-50%, 0)' }} className="flex justify-center absolute top-32 left-[50%] sm:left-[50%] sm:top-80">
              <div className="relative">
              <Image src={userData.AvatarImage} width="9rem" height="9rem" className="rounded-full object-cover cursor-pointer border-solid border-white border-4" />
               
                <CameraIcon className="h-9 rounded-full bg-gray-300 p-1 absolute right-4 top-3/4 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-14 bg-white flex justify-center items-center">
          <div className="w-full sm:w-4/6 text-center  p-10">
            <h2 className="pb-5 text-4xl font-bold">
              {userData.surname} {userData.name}
            </h2>
            <hr className="text-gray-500" />
            <div className="flex justify-between mt-4">
              <ul className="hidden sm:flex px-3 w-2/3 justify-between">
                <li
                  style={{ borderBottom: "1px solid blue" }}
                  className="font-bold text-gray-500 hover:bg-gray-300 rounded-md cursor-pointer p-3 "
                >
                  B??i vi???t
                </li>
                <li className="font-bold text-gray-500 hover:bg-gray-300 rounded-md cursor-pointer p-3 ">
                  Gi???i thi???u
                </li>
                <li className="font-bold text-gray-500 hover:bg-gray-300 rounded-md cursor-pointer p-3 ">
                  B???n b??
                </li>
                <li className="font-bold text-gray-500 hover:bg-gray-300 rounded-md cursor-pointer p-3 ">
                  ???nh
                </li>
                <li className="font-bold text-gray-500 hover:bg-gray-300 rounded-md cursor-pointer p-3 ">
                  Video
                </li>
              </ul>
              <ul className=" block sm:flex  w-full sm:w-1/3  justify-between">
                <li className="font-bold bg-blue-500  rounded-md cursor-pointer p-3 text-white mb-2 sm:mb-0 ">
                  {!sended && !itIsMe && !isFriend && (
                    <button
                      onClick={() => addFriends()}
                      className="flex items-center text-center w-full cursor-pointer border-0 cursor-pointer"
                    >
                      <UserAddIcon className="h-4 pr-2" /> Th??m b???n b??
                    </button>
                  )}
                  {sended && (
                    <button
                      onClick={() => deleteFriend()}
                      className="flex items-center cursor-pointer border-0 cursor-pointer"
                    >
                      <UserRemoveIcon className="h-4 pr-2" /> Hu??? l???i m???i
                    </button>
                  )}
                  {itIsMe && !sended && (
                    <button className="flex items-center cursor-pointer border-0 ">
                      <PlusCircleIcon className="h-4 pr-2" /> Th??m v??o tin
                    </button>
                  )}
                  {isFriend && !itIsMe && (
                    <button className="flex items-center cursor-pointer border-0">
                      <UsersIcon className="h-4 pr-2" /> B???n b??
                    </button>
                  )}
                </li>
                {isFriend && !itIsMe && (
                  <li className="font-bold bg-gray-300 hover:bg-gray-400 rounded-md cursor-pointer p-3 ">
                    <button
                      onClick={() => addChat()}
                      className="flex items-center w-full cursor-pointer border-0 "
                    >
                      <ChatIcon className="h-4 pr-2" /> Nh???n tin
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-gray-200 ">
          <div className="flex justify-center">
            <div className="w-full sm:w-4/6 bg-white flex justify-between items-center p-10 rounded-md">
              <h4 className="font-bold text-4xl">B??i vi???t</h4>
              <span className="bg-gray-200 hover:bg-gray-300 rounded-md p-3 flex items-center">
                <MenuAlt4Icon className="h-4 pr-2" /> B??? l???c
              </span>
            </div>
          </div>
        </div>
      </div>
      {styleOfChat && (
        <MessageUser
          DataOfFriend={DataOfFriend}
          turnOffChat={turnOffChat}
          closeChat={closeChat}
          user={user}
        />
      )}
      {styleOfIconChat && (
        <div
          onClick={() => turnOnChat()}
          className="fixed bottom-7 right-6 sm:right-6 z-10 cursor-pointer"
        >
          <Avatar src={DataOfFriend.img} />
        </div>
      )}
    </div>
  );
}

export default HeaderUser;
