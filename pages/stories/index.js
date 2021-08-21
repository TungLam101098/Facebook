import { XCircleIcon, PhotographIcon } from "@heroicons/react/solid";
import { Avatar } from "@material-ui/core";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectInfo } from "../../redux/features/userSlice";
import Image from "next/image";
import { db, storage } from "../../firebase";
import firebase from "firebase";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";

function Stories({ uid }) {
  const infoUser = useSelector(selectInfo);
  const [realtimeUser] = useCollection(db.collection("users"));
  const [isAddImg, setIsAddImg] = useState(false);
  const [imageStory, setImageStory] = useState(null);
  const router = useRouter();
  const addImageToStories = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readEvent) => {
      setImageStory(readEvent.target.result);
      setIsAddImg(true);
    };
  };
  const addStory = async () => {
    if (imageStory) {
      await db
        .collection("users")
        .doc(uid)
        .collection("stories")
        .add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          name: infoUser.surname.concat(" ", infoUser.name),
          AvatarImage: infoUser.AvatarImage,
        })
        .then((doc) => {
          // funky upload stuff for image
          const uploadTask = storage
            .ref(`stories/${doc.id}`)
            .putString(imageStory, "data_url");

          uploadTask.on(
            "state_change",
            null,
            (error) => console.log(error),
            () => {
              // when the upload completed
              storage
                .ref("stories")
                .child(doc.id)
                .getDownloadURL()
                .then((url) => {
                  db.collection("users")
                    .doc(uid)
                    .collection("stories")
                    .doc(doc.id)
                    .set(
                      {
                        imageStory: url,
                      },
                      { merge: true }
                    );
                });
              router.push("/");
            }
          );
        });
    }
  };
  return (
    <div className="block sm:flex">
      {realtimeUser &&
        realtimeUser.docs.map(
          (dataUser) =>
            dataUser.id === uid && (
              <div style={{ flex: 0.3 }} className="h-auto sm:h-screen w-full relative">
                <Link href="/">
                  <div className="p-3 cursor-pointer">
                    <XCircleIcon className="h-14 text-gray-400" />
                  </div>
                </Link>

                <hr className="text-gray-300" />
                <div className="pt-5 p-5">
                  <div className="flex-grow">
                    <h4 className="font-bold text-2xl">Tin của bạn</h4>
                    <div className="flex space-x-4  items-center pt-4">
                      <Avatar src={dataUser.data().AvatarImage} />
                      <span className="text-lg">
                        {dataUser.data().surname.concat(" ", dataUser.data().name)}
                      </span>
                    </div>
                  </div>
                </div>
                <hr className="text-gray-300" />
                {isAddImg && (
                  <div>
                    <button
                      onClick={() => addStory()}
                      className="p-2 px-4 py-2 border-none bg-blue-500 text-white rounded-md absolute bottom-2 right-2 "
                    >
                      Chia sẻ lên tin
                    </button>
                  </div>
                )}
              </div>
            )
        )}

      <div
        style={{ flex: 0.7 }}
        className=" bg-gray-200 h-screen w-full flex justify-center items-center relative "
      >
        {!isAddImg && (
          <label className="w-60 sm:w-2/6 h-96 sm:h-4/6 bg-blue-500 flex justify-center items-center cursor-pointer rounded-xl">
            <input
              type="file"
              onChange={addImageToStories}
              style={{ display: "none" }}
            />
            <div className="">
              <div className="flex-grow">
                <div className="p-4 bg-white rounded-full mb-3">
                  <PhotographIcon className="h-14 " />
                </div>
                <span className="text-white font-bold">Tạo tin ảnh</span>
              </div>
            </div>
          </label>
        )}
        {isAddImg && (
          <div className="w-11/12 h-5/6 bg-white block sm:absolute sm:bottom-10 sm:right-12 rounded-xl">
            <div className="p-3">
              <h4 className="font-bold">Xem trước</h4>
            </div>

            <div className="flex h-5/6 justify-center bg-black items-center ">
              <div
                className="relative h-96 w-60 cursor-pointer overflow-x p-3
    transition duration-200 transform ease-in hover:scale-105 hover:animate-pulse
    "
              >
                <Image
                  className="object-cover filter brightness-75 rounded-3xl"
                  src={imageStory}
                  layout="fill"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Stories;

export async function getServerSideProps(context) {
  const uid = context.query.id;
  // Can get Data here
  return {
    props: {
      uid: uid,
    },
  };
}
