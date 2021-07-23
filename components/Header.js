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
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { infoUser } from "../redux/features/userSlice";
import Link from "next/link";
import { Avatar } from "@material-ui/core";
import { useRouter } from "next/router";

function Header({ user }) {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [style, setStyle] = useState(false);
  const [focused, setFocused] = useState(false);
  const dispatch = useDispatch();
  const [usersData, setUsersData] = useState([]);
  const [usersDataSearch, setUsersDataSearch] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const getDataFromFirebase = async () => {
      const citiesRef = db.collection("users");
      const snapshot = await citiesRef.get();
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

  const searchUser = (id) => {
    if (!id) return;
    router.push(`/user?id=${id}`);
  };

  if (!userData) return null;
  return (
    <div className="sticky top-0 z-50 bg-white flex items-center p-2 lg:px-5 shadow-md relative">
      {/* Left */}
      <div className={` ${focused ? "hidden" : "flex"} items-center cursor-pointer`}>
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
          src={userData?.AvatarImage}
          width={40}
          height={40}
          layout="fixed"
        />
        <p className="hidden sm:inline-flex whitespace-nowrap font-semibold pr-3">
          {userData?.name}
        </p>
        <ViewGridIcon className="hidden xl:inline-flex p-2 h-10 w-10 bg-gray-200 rounded-full text-gray-70 cursor-pointer hover:bg-gray-300" />
        <ChatIcon className="hidden xl:inline-flex p-2 h-10 w-10 bg-gray-200 rounded-full text-gray-70 cursor-pointer hover:bg-gray-300" />
        <BellIcon className="hidden xl:inline-flex p-2 h-10 w-10 bg-gray-200 rounded-full text-gray-70 cursor-pointer hover:bg-gray-300" />
        <ChevronDownIcon
          onClick={() => {
            setStyle(!style);
          }}
          className="hidden xl:inline-flex p-2 h-10 w-10 bg-gray-200 rounded-full text-gray-70 cursor-pointer hover:bg-gray-300"
        />
        {!style ? (
          ""
        ) : (
          <div className="rounded-md bg-white w-96 shadow-md p-6 absolute right-0 top-full">
            <div className="flex items-center hover:bg-gray-300 cursor-pointer p-2 mb-4 rounded-md">
              <Image
                className="rounded-full cursor-pointer"
                width={50}
                height={50}
                src={userData?.AvatarImage}
              />
              <Link href="/">
                <div className="ml-4">
                  <h4 className="text-xl font-bold">
                    {userData.surname} {userData?.name}
                  </h4>
                  <span>Xem trang cá nhân của bạn</span>
                </div>
              </Link>
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
      </div>
    </div>
  );
}

export default Header;
