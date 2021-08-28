// import { useSession } from "next-auth/client";
import Image from "next/image";
import { EmojiHappyIcon } from "@heroicons/react/outline";
import { CameraIcon, VideoCameraIcon, PaperAirplaneIcon } from "@heroicons/react/solid";
import { useRef, useState } from "react";
import { db, storage } from "../firebase";
import firebase from "firebase";
import { useSelector } from "react-redux";
import { selectInfo } from "../redux/features/userSlice";
import { useCollection } from "react-firebase-hooks/firestore";

const InputBox = ({ user }) => {
  const infoUser = useSelector(selectInfo);
  const inputRef = useRef(null);
  const filepickerRef = useRef(null);
  const [imageToPost, setImageToPost] = useState(null);
  const [realtimeFriends] = useCollection(
    db.collection("users").doc(user.uid).collection("listfriends")
  );

  const sendPost = (e) => {
    e.preventDefault();
    if (!infoUser) return;
    if (!inputRef.current.value) return;
    db.collection("users")
      .doc(user.uid)
      .collection("posts")
      .add({
        message: inputRef.current.value,
        name: infoUser.surname.concat(" ", infoUser.name),
        image: infoUser.AvatarImage,
        shares: 0,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((doc) => {
        if (imageToPost) {
          // funky upload stuff for image
          const uploadTask = storage
            .ref(`posts/${doc.id}`)
            .putString(imageToPost, "data_url");
          removeImage();

          uploadTask.on(
            "state_change",
            null,
            (error) => console.log(error),
            () => {
              // when the upload completed
              storage
                .ref("posts")
                .child(doc.id)
                .getDownloadURL()
                .then((url) => {
                  db.collection("users").doc(user.uid).collection('posts').doc(doc.id).set(
                    {
                      postImage: url,
                    },
                    { merge: true }
                  );
                });
            }
          );
        }
      });
    
    if(!realtimeFriends) return;

    realtimeFriends.docs.map(friend => {
      db.collection("users")
      .doc(friend.id)
      .collection("listnotification")
      .add({
        AvatarImage: infoUser.AvatarImage,
        name: infoUser.surname.concat(" ", infoUser.name),
        id: user.uid,
        seen: false,
        type: "posts",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
    })

    inputRef.current.value = "";
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readEvent) => {
      setImageToPost(readEvent.target.result);
    };
  };

  const removeImage = () => {
    setImageToPost(null);
  };
  if (!infoUser.AvatarImage) return null;

  return (
    <div className="bg-white p-2 rounded-2xl shadow-md text-gray-500 font-medium mt-6">
      <div className="flex space-x-4 p-4 items-center">
        <Image
          className="rounded-full hidden sm:block"
          src={infoUser.AvatarImage}
          width={40}
          height={40}
          layout="fixed"
        />
        <form className="flex flex-1">
          <input
            className="rounded-full h-12 bg-gray-100 flex-grow px-5 w-full sm:w-auto focus:outline-none border-0"
            type="text"
            ref={inputRef}
            placeholder={` ${infoUser.name} ơi, bạn đang nghĩ gì thế?`}
          />
          <button className="block sm:hidden text-blue-500" type="submit" onClick={sendPost}>
            <PaperAirplaneIcon className="h-8" /> 
          </button>
        </form>
        {imageToPost && (
          <div
            onClick={removeImage}
            className="flex flex-col filter hover:brightness-110 transition duration-150 transform hover:scale-105 cursor-pointer"
          >
            <img className="h-10 object-contain" src={imageToPost} alt="" />
            <p className="text-xs text-red-500 text-center">Xoá</p>
          </div>
        )}
      </div>
      <div className="flex justify-evenly p-3 border-t">
        <div className="flex items-center space-x-1 hover:bg-gray-100 flex-grow justify-center p-2 rounded-xl cursor-pointer">
          <VideoCameraIcon className="h-7 text-red-500" />
          <p className="text-xs sm:text-sm xl:text-base m-0">Video trực tiếp</p>
        </div>
        <div
          onClick={() => filepickerRef.current.click()}
          className="flex items-center space-x-1 hover:bg-gray-100 flex-grow justify-center p-2 rounded-xl cursor-pointer"
        >
          <CameraIcon className="h-7 text-green-400" />
          <p className="text-xs sm:text-sm xl:text-base m-0">Ảnh/Video</p>
          <input
            ref={filepickerRef}
            onChange={addImageToPost}
            type="file"
            hidden
          />
        </div>
        <div className="flex items-center space-x-1 hover:bg-gray-100 flex-grow justify-center p-2 rounded-xl cursor-pointer">
          <EmojiHappyIcon className="h-7 text-yellow-300" />
          <p className="text-xs sm:text-sm xl:text-base m-0">Cảm xúc/Hoạt động</p>
        </div>
      </div>
    </div>
  );
};

export default InputBox;
