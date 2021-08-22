import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";

function CallNotification({ user }) {
  const [lengthOfNotification, setLengthOfNotification] = useState(0);
  const [realtimeCall] = useCollection(
    db
      .collection("users")
      .doc(user.uid)
      .collection("calls")
      .orderBy("timestamp", "desc")
  );
  useEffect(() => {
    let count = 0;
    if (!realtimeCall) {
      return;
    }
    realtimeCall.docs.map((doc) => {
      if (!doc.data().answer) {
        count++;
      }
    });
    setLengthOfNotification(count);
  }, [realtimeCall]);

  const callButton = () => {
    const win = window.open(`call?id=${user.uid}`, "_blank");
    win.focus();
  }

  return (
    <>
      { realtimeCall && lengthOfNotification !== 0 && (
        <div
          style={{ backgroundColor: "rgba(52, 52, 52, 0.8)" }}
          className="absolute text-center w-full h-screen bg-black text-white top-0 overflow-x-hidden z-20"
        >
          <div className="absolute top-[50%] left-[1rem] sm:left-[45%] text-center">
            <div className="flex justify-center items-center bg-gray-200 p-3 space-x-2 rounded-md">
              <Image
                className=" rounded-full cursor-pointer"
                src={realtimeCall.docs[0].data().image}
                width={40}
                height={40}
                layout="fixed"
              />
              <button onClick={callButton} className="px-4 py-2 bg-blue-500 rounded-lg">
                {realtimeCall.docs[0].data().name} đang gọi bạn...
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CallNotification;
