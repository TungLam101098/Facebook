import { CameraIcon } from "@heroicons/react/solid";
import { UserAddIcon } from "@heroicons/react/solid";
import { ChatIcon } from "@heroicons/react/solid";
import { MenuAlt4Icon } from "@heroicons/react/solid";
import { PlusCircleIcon } from "@heroicons/react/solid";
import { UsersIcon } from "@heroicons/react/solid";
import { UserRemoveIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import firebase from "firebase";

function HeaderUser({ userData, id }) {
  const [user] = useAuthState(auth);
  const [itIsMe, setItIsMe] = useState(false);
  const [sended, setSended] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [dataUser, setDataUser] = useState(null);
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
        .collection("listnotification").add({
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

  if (!user || !userData) {
    return null;
  }

  return (
    <div>
      <div className="">
        <div className="flex justify-center items-center bg-gray-200">
          <div className="w-full sm:w-4/6 relative">
            <img
              className="w-full h-44 sm:h-96 object-cover rounded-lg"
              src="https://scontent-hkg4-1.xx.fbcdn.net/v/t1.6435-9/101801932_297967541362716_3387244181536636928_n.jpg?_nc_cat=102&ccb=1-3&_nc_sid=e3f864&_nc_ohc=bWXeBRk0d40AX_0tyAg&_nc_ht=scontent-hkg4-1.xx&oh=5dc0dc27ea96e21cc92d8658b5043a58&oe=61208F1B"
            />
            <div className="flex justify-center absolute top-32 left-[30%] sm:left-[42%] sm:top-80">
              <div className="relative">
                <img
                  className="rounded-full object-cover cursor-pointer w-36 h-36 border-solid border-white border-4"
                  src={userData.AvatarImage}
                  layout="fixed"
                />
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
                  Bài viết
                </li>
                <li className="font-bold text-gray-500 hover:bg-gray-300 rounded-md cursor-pointer p-3 ">
                  Giới thiệu
                </li>
                <li className="font-bold text-gray-500 hover:bg-gray-300 rounded-md cursor-pointer p-3 ">
                  Bạn bè
                </li>
                <li className="font-bold text-gray-500 hover:bg-gray-300 rounded-md cursor-pointer p-3 ">
                  Ảnh
                </li>
                <li className="font-bold text-gray-500 hover:bg-gray-300 rounded-md cursor-pointer p-3 ">
                  Video
                </li>
              </ul>
              <ul className="flex  w-1/3 justify-between">
                <li className="font-bold bg-blue-500 hover:bg-blue-600 rounded-md cursor-pointer p-3 text-white">
                  {!sended && !itIsMe && !isFriend && (
                    <button
                      onClick={() => addFriends()}
                      className="flex items-center"
                    >
                      <UserAddIcon className="h-4 pr-2" /> Thêm bạn bè
                    </button>
                  )}
                  {sended && (
                    <button
                      onClick={() => deleteFriend()}
                      className="flex items-center"
                    >
                      <UserRemoveIcon className="h-4 pr-2" /> Huỷ lời mời
                    </button>
                  )}
                  {itIsMe && !sended && (
                    <button className="flex items-center">
                      <PlusCircleIcon className="h-4 pr-2" /> Thêm vào tin
                    </button>
                  )}
                  {isFriend && (
                    <button className="flex items-center">
                      <UsersIcon className="h-4 pr-2" /> Bạn bè
                    </button>
                  )}
                </li>
                <li className="font-bold bg-gray-300 hover:bg-gray-400 rounded-md cursor-pointer p-3 ">
                  <button className="flex items-center">
                    <ChatIcon className="h-4 pr-2" /> Nhắn tin
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-gray-200 ">
          <div className="flex justify-center">
            <div className="w-full sm:w-4/6 bg-white flex justify-between items-center p-10 rounded-md">
              <h4 className="font-bold text-4xl">Bài viết</h4>
              <span className="bg-gray-200 hover:bg-gray-300 rounded-md p-3 flex items-center">
                <MenuAlt4Icon className="h-4 pr-2" /> Bộ lọc
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderUser;