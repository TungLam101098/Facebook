import Image from "next/image";

const StoryCard = ({ name, src, profile }) => {
  return (
    <div className="relative h-56 w-32 cursor-pointer overflow-x p-3
    transition duration-200 transform ease-in hover:scale-105 hover:animate-pulse
    ">
      <Image
        className="absolute opacity-100 rounded-full z-50 top-10"
        src={profile}
        width={40}
        height={40}
        layout="fixed"
        objectFit="cover"
      />
      <Image
        className="object-cover filter brightness-75 rounded-3xl"
        src={src}
        layout="fill"
      />
      <p className="absolute opacity-100 bottom-4 w5/6 text-white text-sm font-bold truncate">{name}</p>
    </div>
  );
};

export default StoryCard;
