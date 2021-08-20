import { SearchIcon } from '@heroicons/react/outline';
import { DotsHorizontalIcon, VideoCameraIcon } from '@heroicons/react/solid';
import Contact from './Contact';
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from '../firebase';

const Widgets = ({ user }) => {
  const [realtimeFriends] = useCollection(
    db.collection("users").doc(user.uid).collection("listfriends")
  );
  return (
    <div className="hidden lg:flex flex-col w-60 p-2 mt-5">
      <div className="hidden sm:flex justify-between items-center text-gray-500 mb-5">
        <h2 className="text-xl">Người liên hệ</h2>
        <div className="flex space-x-2">
          <VideoCameraIcon className="h-6" />
          <SearchIcon className="h-6" />
          <DotsHorizontalIcon className="h-6" />
        </div>
      </div>
      <div className="sm:h-screen pb-40 flex-grow overflow-y-auto scrollbar-hide ">
      {realtimeFriends && realtimeFriends.docs.map((friend) => (
        <Contact key={friend.id} id={friend.id} user={user} />
      ))}
      </div>
      
    </div>
  )
}

export default Widgets
