import Image from "next/image";
import React, { useState } from "react";
import { ChatAltIcon, ShareIcon, ThumbUpIcon } from "@heroicons/react/outline";
import { ThumbUpIcon as ThumbUpIconSolid } from "@heroicons/react/solid";

const Post = ({ name, email, timestamp, image, postImage, message, comments, likes, shares }) => {
  const [styleOfThum, setStyleOfThum] = useState(false);
  const addLike = () => {
    setStyleOfThum(!styleOfThum);
  }
  return (
    <div className="flex flex-col">
      <div className="p-5 bg-white mt-5 rounded-t-2xl shadow-sm">
        <div className="flex items-center space-x-2">
          <img className="rounded-full" src={image} width={40} height={40} />
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
        <div className="relative bg-auto h-56 md:h-96 bg-white">
          <Image src={postImage} objectFit="cover" layout="fill" />
        </div>
      )}
      {/* Section post detail */}
      <div className="flex justify-between bg-white text-gray-600">
        <div className="flex justify-center space-x-1 cursor-pointer p-2 rounded-none ml-4">
          <ThumbUpIconSolid className="h-5 text-blue-600" />
          <span>{likes}</span>
        </div>
        <div className="flex justify-center space-x-2 cursor-pointer p-2 rounded-none mr-4">
          <span className="hover:underline">{comments} bình luận</span>
          <span className="hover:underline">{shares} chia sẻ</span>
        </div>
      </div>
      {/* Footer of post */}
      <div className="flex justify-between items-center rounded-b-2xl bg-white shadow-md text-gray-600 border-t">
        {
          !styleOfThum ? (
          <div onClick={() => addLike()} className="flex items-center space-x-1 hover:bg-gray-100 flex-grow justify-center p-2 rounded-xl cursor-pointer rounded-none rounded-bl-2xl">
          <ThumbUpIcon className="h-4" />
          <p className="text-sx sm:text-base">Thích</p>
        </div>
          ) : (
            <div onClick={() => addLike()} className="flex items-center text-blue-600 space-x-1 hover:bg-gray-100 flex-grow justify-center p-2 rounded-xl cursor-pointer rounded-none rounded-bl-2xl">
          <ThumbUpIconSolid className="h-4" />
          <p className="text-sx sm:text-base">Thích</p>
        </div>
          )
        }
        
        <div className="flex items-center space-x-1 hover:bg-gray-100 flex-grow justify-center p-2 rounded-xl cursor-pointer rounded-none">
          <ChatAltIcon className="h-4" />
          <p className="text-sx sm:text-base">Bình luận</p>
        </div>
        <div className="flex items-center space-x-1 hover:bg-gray-100 flex-grow justify-center p-2 rounded-xl cursor-pointer rounded-none rounded-br-2xl">
          <ShareIcon className="h-4" />
          <p className="text-sx sm:text-base">Chia sẻ</p>
        </div>
      </div>
    </div>
  );
};

export default Post;
