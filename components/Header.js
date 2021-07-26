import Image from "next/image";
import {
  BellIcon,
  ChatIcon,
  ChevronDownIcon,
  HomeIcon,
  UserGroupIcon,
  ViewGridIcon,
} from "@heroicons/react/solid";
import {
  FlagIcon,
  PlayIcon,
  SearchIcon,
  ShoppingCartIcon,
  LogoutIcon,
} from "@heroicons/react/outline";
import HeaderIcon from "./HeaderIcon";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { infoUser } from "../redux/features/userSlice";
import Link from "next/link";
import { Avatar } from "@material-ui/core";
import { useRouter } from "next/router";
import firebase from "firebase";
import TimeAgo from "timeago-react";
import { useCollection } from "react-firebase-hooks/firestore";

function Header({ user }) {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [style, setStyle] = useState(false);
  const [styleOfNotification, setStyleOfNotification] = useState(false);
  const [focused, setFocused] = useState(false);
  const dispatch = useDispatch();
  const [usersData, setUsersData] = useState([]);
  const [usersDataSearch, setUsersDataSearch] = useState([]);
  const [query, setQuery] = useState("");
  const [lengthOfNotification, setlengthOfNotification] = useState(0);

  const [realtimeNotification] = useCollection(
    db
      .collection("users")
      .doc(user.uid)
      .collection("listnotification")
      .orderBy("timestamp", "desc")
  );

  useEffect(() => {
    let count = 0;
    if (!realtimeNotification) {
      return;
    }
    realtimeNotification.docs.map((doc) => {
      if (!doc.data().seen) {
        count++;
      }
    });
    setlengthOfNotification(count);
  }, [realtimeNotification]);

  useEffect(() => {
    const getDataFromFirebase = async () => {
      const userDataRef = db.collection("users");
      const snapshot = await userDataRef.get();
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }

      snapshot.forEach((doc) => {
        setUsersData((prevState) => [
          ...prevState,
          {
            id: doc.id,
            fullName: doc.data().surname.concat(" ", doc.data().name),
            image: doc.data().AvatarImage,
          },
        ]);
        setUsersDataSearch((prevState) => [
          ...prevState,
          {
            id: doc.id,
            fullName: doc.data().surname.concat(" ", doc.data().name),
            image: doc.data().AvatarImage,
          },
        ]);
      });
    };
    getDataFromFirebase();
  }, []);

  const onFocus = () => {
    setFocused(true);
  };
  const onBlur = () => {
    setFocused(false);
  };

  const signOut = () => {
    auth.signOut();
    dispatch(
      infoUser({
        AvatarImage: null,
      })
    );
  };
  useEffect(() => {
    const getData = async () => {
      const userRef = db.collection("users").doc(user.uid);
      const doc = await userRef.get();
      if (!doc.exists) {
        console.log("No such document!");
      } else {
        setUserData(doc.data());
        dispatch(
          infoUser({
            surname: doc.data().surname,
            name: doc.data().name,
            email: doc.data().email,
            birthday: doc.data().birthday,
            gender: doc.data().gender,
            AvatarImage: doc.data().AvatarImage,
          })
        );
      }
    };
    getData();
  }, [user]);

  useEffect(() => {
    const makeFriendYourSelf = async () => {
      const userRef = db
        .collection("users")
        .doc(user.uid)
        .collection("listfriends")
        .doc(user.uid);
      const doc = await userRef.get();
      if (!doc.exists) {
        await userRef.set({
          id: user.uid,
        });
      }
    };
    makeFriendYourSelf();
  }, []);

  const handleChange = (e) => {
    const userDataInput = e.target.value.toLowerCase();
    setQuery(userDataInput);
    filterList();
  };

  const filterList = () => {
    const searchUsers = usersData.filter(function (user) {
      return user.fullName.toLowerCase().indexOf(query) != -1;
    });
    setUsersDataSearch(searchUsers);
  };

  const addFriend = async (id, idOfNotification) => {
    const listSendFriendsOfUserRef = db
      .collection("users")
      .doc(user.uid)
      .collection("listfriends")
      .doc(id);
    const snapShotListFriend = await listSendFriendsOfUserRef.get();
    if (!snapShotListFriend.exists) {
      await listSendFriendsOfUserRef.set({
        id: id,
      });
    }
    const listSendFriendsRef = db
      .collection("users")
      .doc(id)
      .collection("listfriends")
      .doc(user.uid);
    const snapShot = await listSendFriendsRef.get();
    if (!snapShot.exists) {
      await listSendFriendsRef.set({
        id: user.uid,
      });
    }

    const listNoticationsRef = db
      .collection("users")
      .doc(user.uid)
      .collection("listnotification")
      .doc(idOfNotification);
    await listNoticationsRef.update({
      seen: true,
    });

    await db
      .collection("users")
      .doc(id)
      .collection("listnotification")
      .add({
        id: user.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        type: "addFriendsComplete",
        seen: false,
        name: userData.surname.concat(" ", userData.name),
        AvatarImage: userData.AvatarImage,
      });

    await db
      .collection("users")
      .doc(id)
      .collection("listsendfriends")
      .doc(user.uid)
      .delete();

    await db
      .collection("users")
      .doc(user.uid)
      .collection("listapprovalwaittingfriends")
      .doc(id)
      .delete();
  };

  const unFriend = async (id, idOfNotification) => {
    const listNoticationsRef = db
      .collection("users")
      .doc(user.uid)
      .collection("listnotification")
      .doc(idOfNotification);
    await listNoticationsRef.update({
      seen: true,
    });
    await db
      .collection("users")
      .doc(id)
      .collection("listsendfriends")
      .doc(user.uid)
      .delete();
    await db
      .collection("users")
      .doc(user.uid)
      .collection("listapprovalwaittingfriends")
      .doc(id)
      .delete();
  };

  const readNotification = async (id, idOfNotification) => {
    const listNoticationsRef = db
      .collection("users")
      .doc(user.uid)
      .collection("listnotification")
      .doc(idOfNotification);
    await listNoticationsRef.update({
      seen: true,
    });
  };

  const searchUser = (id) => {
    if (!id) return;
    router.push(`/user?id=${id}`);
  };

  if (!userData) return null;
  return (
    <div className="sticky top-0 z-50 bg-white flex items-center p-2 lg:px-5 shadow-md relative">
      {/* Left */}
      <div
        className={` ${
          focused ? "hidden" : "flex"
        } items-center cursor-pointer`}
      >
        <Link href="/">
          <Image
            src="https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-facebook-2019-circle-512.png"
            width={40}
            height={40}
            layout="fixed"
          />
        </Link>
      </div>
      <div className="flex ml-2 items-center rounded-full bg-gray-100 p-2">
        <SearchIcon className="h-6 text-gray-600" />
        <input
          className="hidden md:inline-flex ml-2 items-center bg-transparent outline-none placeholder-gray-500 flex-shrink"
          type="text"
          value={query}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(e) => handleChange(e)}
          placeholder="Search Facebook"
        />
      </div>
      {focused && (
        <div className="absolute w-1/5 top-full left-0 bg-white p-5">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-lg">Tìm kiếm gần đây</h4>
            <span className="text-blue-500 hover:bg-gray-200 cursor-pointer">
              Chỉnh sửa
            </span>
          </div>
          <ul>
            {usersDataSearch.map((user) => (
              <li onMouseDown={() => searchUser(user.id)} key={user.id}>
                <div className="flex justify-between items-center hover:bg-gray-200 cursor-pointer my-2 rounded-md">
                  <div className="flex gap-x-2 items-center">
                    <Avatar src={user.image} className="h-4" />
                    <h4 className="text-md">{user.fullName}</h4>
                  </div>
                  <span className="text-gray-400 hover:bg-gray-400 hover:rounded-full">
                    X
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Center */}
      <div className="flex justify-center flex-grow">
        <div className="flex space-x-6 md:space-x-2">
          <HeaderIcon active Icon={HomeIcon} />
          <HeaderIcon Icon={FlagIcon} />
          <HeaderIcon Icon={PlayIcon} />
          <HeaderIcon Icon={ShoppingCartIcon} />
          <HeaderIcon Icon={UserGroupIcon} />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center sm:space-x-2 justify-end relative">
        {/* Profile pic */}

        <Image
          className="rounded-full cursor-pointer"
          onClick={() => searchUser(user.uid)}
          src={userData?.AvatarImage}
          width={40}
          height={40}
          layout="fixed"
        />
        <p
          onClick={() => searchUser(user.uid)}
          className="hidden sm:inline-flex whitespace-nowrap font-semibold cursor-pointer pr-3"
        >
          {userData?.name}
        </p>
        <ViewGridIcon className="hidden xl:inline-flex p-2 h-10 w-10 bg-gray-200 rounded-full text-gray-70 cursor-pointer hover:bg-gray-300" />
        <ChatIcon className="hidden xl:inline-flex p-2 h-10 w-10 bg-gray-200 rounded-full text-gray-70 cursor-pointer hover:bg-gray-300" />
        <BellIcon
          onClick={() => {
            setStyle(false);
            setStyleOfNotification(!styleOfNotification);
          }}
          className="hidden xl:inline-flex p-2 h-10 w-10 bg-gray-200 rounded-full text-gray-70 cursor-pointer hover:bg-gray-300"
        />
        {lengthOfNotification !== 0 && (
          <div className="w-5 h-5 bg-red-500 flex justify-center rounded-full text-white items-center absolute right-[15%] top-[-10%]">
            <span>{lengthOfNotification}</span>
          </div>
        )}

        <ChevronDownIcon
          onClick={() => {
            setStyleOfNotification(false);
            setStyle(!style);
          }}
          className="hidden xl:inline-flex p-2 h-10 w-10 bg-gray-200 rounded-full text-gray-70 cursor-pointer hover:bg-gray-300"
        />
        {style && (
          <div className="rounded-md bg-white w-96 shadow-md p-6 absolute right-0 top-full">
            <div
              onClick={() => searchUser(user.uid)}
              className="flex items-center hover:bg-gray-300 cursor-pointer p-2 mb-4 rounded-md"
            >
              <Image
                className="rounded-full cursor-pointer"
                width={50}
                height={50}
                src={userData?.AvatarImage}
              />
              <div className="ml-4">
                <h4 className="text-xl font-bold">
                  {userData.surname} {userData?.name}
                </h4>
                <span>Xem trang cá nhân của bạn</span>
              </div>
            </div>
            <hr />
            <div
              onClick={() => signOut()}
              className="p-2 flex items-center hover:bg-gray-300 cursor-pointer mt-4 rounded-md"
            >
              <LogoutIcon className="h-10 rounded-full bg-gray-200 p-2" />
              <span className="ml-5">Đăng xuất</span>
            </div>
          </div>
        )}
        {styleOfNotification && realtimeNotification && (
          <div className="rounded-md bg-white w-96 shadow-md p-6 absolute right-0 top-full flex-grow h-80 overflow-y-auto scrollbar-hide">
            <ul>
              {realtimeNotification.docs.map((notification) => (
                <li key={notification.id}>
                  <div className="flex items-center cursor-pointer p-2 mb-4 rounded-md">
                    <Image
                      className="rounded-full cursor-pointer"
                      width={50}
                      height={50}
                      src={notification.data()?.AvatarImage}
                    />
                    <div className="ml-4">
                      {notification.data()?.type === "addFriends" && (
                        <h4 className="text-base">
                          <span className="font-bold">
                            {notification.data()?.name}
                          </span>{" "}
                          đã gửi lời mời kết bạn
                        </h4>
                      )}
                      {notification.data()?.type === "addLike" && (
                        <div
                          onClick={() => {
                            readNotification(
                              notification.data()?.id,
                              notification.id
                            );
                          }}
                        >
                          <h4 className="text-base">
                            <span className="font-bold">
                              {notification.data()?.name}
                            </span>{" "}
                            đã thích bài viết của bạn
                          </h4>
                          {notification.data()?.img !== "notImg" && (
                            <Image
                              className="cursor-pointer"
                              width={50}
                              height={50}
                              src={notification.data()?.img}
                            />
                          )}
                        </div>
                      )}
                      {notification.data()?.type === "addComment" && (
                        <div
                          onClick={() => {
                            readNotification(
                              notification.data()?.id,
                              notification.id
                            );
                          }}
                        >
                          <h4 className="text-base">
                            <span className="font-bold">
                              {notification.data()?.name}
                            </span>{" "}
                            đã bình luận bài viết của bạn
                          </h4>
                          {notification.data()?.img !== "notImg" && (
                            <Image
                              className="cursor-pointer"
                              width={50}
                              height={50}
                              src={notification.data()?.img}
                            />
                          )}
                        </div>
                      )}
                      {notification.data()?.type === "posts" && (
                        <div
                          onClick={() => {
                            readNotification(
                              notification.data()?.id,
                              notification.id
                            );
                          }}
                        >
                          <h4 className="text-base">
                            <span className="font-bold">
                              {notification.data()?.name}
                            </span>{" "}
                            đã thêm một bài viết
                          </h4>
                        </div>
                      )}
                      {notification.data()?.type === "addFriendsComplete" && (
                        <div
                          onClick={() => {
                            readNotification(
                              notification.data()?.id,
                              notification.id
                            );
                          }}
                        >
                          <h4 className="text-base">
                            <span className="font-bold">
                              {notification.data()?.name}
                            </span>{" "}
                            đã chấp nhận lời mời kết bạn
                          </h4>
                        </div>
                      )}

                      <span className="text-blue-500">
                        <TimeAgo
                          datetime={notification
                            .data()
                            ?.timestamp.toDate()
                            .getTime()}
                        />
                      </span>
                      {!notification.data()?.seen &&
                        notification.data()?.type === "addFriends" && (
                          <div className="flex">
                            <button
                              onClick={() =>
                                addFriend(
                                  notification.data()?.id,
                                  notification.id
                                )
                              }
                              className="p-2 px-5 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                            >
                              Chấp nhận
                            </button>
                            <button
                              onClick={() =>
                                unFriend(
                                  notification.data()?.id,
                                  notification.id
                                )
                              }
                              className="p-2 px-5 py-2 rounded-md bg-gray-400 text-white hover:bg-gray-500 ml-3"
                            >
                              Từ chối
                            </button>
                          </div>
                        )}
                    </div>
                    {!notification.data()?.seen && (
                      <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
