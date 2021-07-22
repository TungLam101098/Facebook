// import { useSession } from "next-auth/client";
import Image from "next/image";
import { EmojiHappyIcon } from "@heroicons/react/outline";
import { CameraIcon, VideoCameraIcon } from "@heroicons/react/solid";
import { useRef, useState } from "react";
import { db, storage } from "../firebase";
import firebase from "firebase";
import { useSelector } from "react-redux";
import { selectInfo } from '../redux/features/userSlice';

const InputBox = () => {
  // const [session] = useSession();
  const infoUser = useSelector(selectInfo);
  const inputRef = useRef(null);
  const filepickerRef = useRef(null);
  const [imageToPost, setImageToPost] = useState(null);

  const sendPost = (e) => {
    e.preventDefault();
    if (!inputRef.current.value) return;
    db.collection("posts").add({
      message: inputRef.current.value,
      // name: session.user.name,
      // email: session.user.email,
      // image: session.user.image,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    }).then(doc => {
      if (imageToPost) {
        // funky upload stuff for image
        const uploadTask = storage.ref(`posts/${doc.id}`).putString(imageToPost, 'data_url')
        removeImage();

        uploadTask.on(
          "state_change",
          null,
          (error) => console.log(error),
          () => {
            // when the upload completed
            storage.ref('posts').child(doc.id).getDownloadURL().then(url => {
              db.collection('posts').doc(doc.id).set({
                postImage: url
              }, {merge: true })
            })
          }
        )
      }
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
  if(!infoUser.AvatarImage) return null;

  return (
    <div className="bg-white p-2 rounded-2xl shadow-md text-gray-500 font-medium mt-6">
      <div className="flex space-x-4 p-4 items-center">
        <Image
          className="rounded-full"
          src={infoUser.AvatarImage}
          width={40}
          height={40}
          layout="fixed"
        />
        <form className="flex flex-1">
          <input
            className="rounded-full h-12 bg-gray-100 flex-grow px-5 focus:outline-none"
            type="text"
            ref={inputRef}
            placeholder={` ${infoUser.name} ơi, bạn đang nghĩ gì thế?`}
          />
          <button hidden type="submit" onClick={sendPost}>
            Submit
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
          <p className="text-xs sm:text-sm xl:text-base">Video trực tiếp</p>
        </div>
        <div
          onClick={() => filepickerRef.current.click()}
          className="flex items-center space-x-1 hover:bg-gray-100 flex-grow justify-center p-2 rounded-xl cursor-pointer"
        >
          <CameraIcon className="h-7 text-green-400" />
          <p className="text-xs sm:text-sm xl:text-base">Ảnh/Video</p>
          <input
            ref={filepickerRef}
            onChange={addImageToPost}
            type="file"
            hidden
          />
        </div>
        <div className="flex items-center space-x-1 hover:bg-gray-100 flex-grow justify-center p-2 rounded-xl cursor-pointer">
          <EmojiHappyIcon className="h-7 text-yellow-300" />
          <p className="text-xs sm:text-sm xl:text-base">Cảm xúc/Hoạt động</p>
        </div>
      </div>
    </div>
  );
};

export default InputBox;
