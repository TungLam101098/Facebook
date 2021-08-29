import Image from "next/image";
import ModalElement from "./Modal";
import React from "react";

const StoryCard = ({ name, src, profile }) => {
  return (
    <div>
      <div className="relative">
        <ModalElement
          src={src}
          className="object-cover filter brightness-75 rounded-3xl"
        />
        <p className="absolute opacity-100 bottom-4 w5/6 text-white text-sm font-bold truncate">
          {name}
        </p>
        <div className="absolute opacity-100 rounded-full z-40 top-5 left-[10%] ">
          <Image
            className="rounded-full "
            src={profile}
            width={40}
            height={40}
            layout="fixed"
            objectFit="cover"
          />
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
