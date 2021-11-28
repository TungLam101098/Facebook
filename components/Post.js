import Image from "next/image";
import React, { useRef, useState } from "react";
import { ChatAltIcon, ShareIcon, ThumbUpIcon } from "@heroicons/react/outline";
import { ThumbUpIcon as ThumbUpIconSolid } from "@heroicons/react/solid";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import { useSelector } from "react-redux";
import { selectInfo } from "../redux/features/userSlice";
import firebase from "firebase";
import { useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import ModalElement from "./Modal";

const Post = ({
  id,
  idUser,
  uid,
  name,
  timestamp,
  image,
  postImage,
  message,
  shares,
}) => {
  const infoUser = useSelector(selectInfo);
  const commentRef = useRef(null);
  const [realtimeLike] = useCollection(
    db
      .collection("users")
      .doc(uid)
      .collection("posts")
      .doc(id)
      .collection("likes")
  );
  const [realtimeComments] = useCollection(
    db
      .collection("users")
      .doc(uid)
      .collection("posts")
      .doc(id)
      .collection("comments")
  );

  const [styleOfThum, setStyleOfThum] = useState(false);

  const newLikeRef = db
    .collection("users")
    .doc(uid)
    .collection("posts")
    .doc(id)
    .collection("likes")
    .doc(idUser);

  const addLike = async () => {
    if (!infoUser) return;
    setStyleOfThum(true);
    await newLikeRef.set({
      id: idUser,
      name: infoUser.surname.concat(" ", infoUser.name),
    });

    await db
      .collection("users")
      .doc(uid)
      .collection("listnotification")
      .add({
        id: idUser,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        type: "addLike",
        seen: false,
        name: infoUser.surname.concat(" ", infoUser.name),
        AvatarImage: infoUser.AvatarImage,
        img: postImage || "notImg",
      });
  };
  const unLike = async () => {
    setStyleOfThum(false);
    await db
      .collection("users")
      .doc(uid)
      .collection("posts")
      .doc(id)
      .collection("likes")
      .doc(idUser)
      .delete();
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!commentRef.current.value) return;
    await db
      .collection("users")
      .doc(uid)
      .collection("posts")
      .doc(id)
      .collection("comments")
      .add({
        name: infoUser.surname.concat(" ", infoUser.name),
        AvatarImage: infoUser.AvatarImage,
        message: commentRef.current.value,
      });

    await db
      .collection("users")
      .doc(uid)
      .collection("listnotification")
      .add({
        id: idUser,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        type: "addComment",
        seen: false,
        name: infoUser.surname.concat(" ", infoUser.name),
        AvatarImage: infoUser.AvatarImage,
        img: postImage || "notImg",
      });
    commentRef.current.value = "";
  };

  useEffect(() => {
    if (!realtimeLike) return;
    realtimeLike.docs.map((like) => {
      if (like.id === idUser) {
        setStyleOfThum(true);
      }
    });
  }, [realtimeLike]);
  return (
    <div className="flex flex-col">
      <div className="p-5 bg-white mt-5 rounded-t-2xl shadow-sm">
        <div className="flex items-center space-x-2">
          <Image
            className=" rounded-full cursor-pointer"
            src={image}
            width={40}
            height={40}
            layout="fixed"
          />
          <div>
            <p className="font-medium">{name}</p>
            {timestamp ? (
              <p className="text-xs text-gray-400">
                {new Date(timestamp?.toDate()).toLocaleDateString()}
              </p>
            ) : (
              <p className="text-xs text-gray-400">Loading...</p>
            )}
          </div>
        </div>
        <p className="pt-4">{message}</p>
      </div>
      {postImage && (
        <div className="relative bg-auto bg-white">
          <ModalElement src={postImage} />
            {/* <Image src={postImage} objectFit="cover" layout="fill" /> */}
        </div>
      )}
      {/* Section post detail */}
      <div className="flex justify-between bg-white text-gray-600">
        <div className="flex justify-center space-x-1 cursor-pointer p-2 rounded-none ml-4">
          <ThumbUpIconSolid className="h-5 text-blue-600" />
          {realtimeLike && realtimeLike.docs[0] && (
            <span>{realtimeLike.docs[0].data().name}</span>
          )}
          {realtimeLike && realtimeLike.docs[0] && realtimeLike.docs[1] && (
            <span>
              {", "}{realtimeLike.docs[1].data().name} và{", "}
              {realtimeLike.docs.length - 1} người khác
            </span>
          )}
        </div>
        <div className="flex justify-center space-x-2 cursor-pointer p-2 rounded-none mr-4">
          <span className="hover:underline">
            {realtimeComments && realtimeComments.docs.length} bình luận
          </span>
          {/* <span className="hover:underline">{shares} chia sẻ</span> */}
        </div>
      </div>
      {/* Footer of post */}
      <div style={{ borderTop: '0.5px solid #80808054' }} className="flex justify-between items-center bg-white shadow-md text-gray-600 border-t">
        {!styleOfThum ? (
          <div
            onClick={() => addLike()}
            className="flex items-center space-x-1 hover:bg-gray-100 flex-grow justify-center p-2 rounded-xl cursor-pointer rounded-none rounded-bl-2xl"
          >
            <ThumbUpIcon className="h-4" />
            <p className="text-sx sm:text-base m-0">Thích</p>
          </div>
        ) : (
          <div
            onClick={() => unLike()}
            className="flex items-center text-blue-600 space-x-1 hover:bg-gray-100 flex-grow justify-center p-2 rounded-xl cursor-pointer rounded-none rounded-bl-2xl"
          >
            <ThumbUpIconSolid className="h-4" />
            <p className="text-sx sm:text-base m-0">Thích</p>
          </div>
        )}

        <div className="flex items-center space-x-1 hover:bg-gray-100 flex-grow justify-center p-2 rounded-xl cursor-pointer rounded-none">
          <ChatAltIcon className="h-4" />
          <p className="text-sx sm:text-base m-0">Bình luận</p>
        </div>
        {/* <div className="flex items-center space-x-1 hover:bg-gray-100 flex-grow justify-center p-2 rounded-xl cursor-pointer rounded-none rounded-br-2xl">
          <ShareIcon className="h-4" />
          <p className="text-sx sm:text-base m-0">Chia sẻ</p>
        </div> */}
      </div>
      <div style={{ borderTop: '0.5px solid #80808054' }} className="bg-white rounded-lg border-t relative">
        <div className="p-5 h-auto pb-5 flex-grow overflow-y-auto scrollbar-hide">
          <ul className="mb-16">
            {realtimeComments &&
              realtimeComments.docs.map((comment) => (
                <li key={comment.id}>
                  <div className="flex items-center">
                    <Avatar src={comment.data().AvatarImage} />
                    <div className="pl-5 mt-8">
                      <h4 className="font-bold text-sm">
                        {comment.data().name}
                      </h4>
                      <span>{comment.data().message}</span>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
          <form className="flex items-center absolute w-full bottom-3">
            <Avatar src={infoUser.AvatarImage} />
            <input
              type="text"
              ref={commentRef}
              className="bg-gray-200 w-[50%] sm:w-[85%] border-none focus:outline-none px-3 py-3 rounded-xl ml-5"
              placeholder="Viết bình luận...."
            />
            <button
              className="block sm:hidden bg-gray-200 border-none focus:outline-none px-3 py-3 rounded-xl ml-2"
              type="submit"
              onClick={addComment}
            >
              submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Post;
