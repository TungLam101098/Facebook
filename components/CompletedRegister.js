import { ChevronDownIcon } from "@heroicons/react/outline";
import { Avatar } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { auth, db, firestore, storage } from "../firebase";
import { selectInfo } from "../redux/features/userSlice";
import firebase from "firebase";
import Link from "next/link";
import { useRouter } from "next/router";

function CompletedRegister() {
  const [imageAvatar, setImageAvatar] = useState(null);
  const infoUser = useSelector(selectInfo);
  const router = useRouter();
  const [number, setNumber] = useState(0);

  const CompleteRegister = async () => {
    if (!infoUser) {
      alert('Đăng ký lỗi!');
      router.push("/");
    } else if (imageAvatar) {
      const { user } = await auth.createUserWithEmailAndPassword(
        infoUser.email,
        infoUser.password
      );
      const userRef = firestore.doc(`users/${user.uid}`);
      const snapShot = await userRef.get();
      if (!snapShot.exists) {
        try {
          await userRef
            .set({
              email: infoUser.email,
              name: infoUser.name,
              surname: infoUser.surname,
              gender: infoUser.gender,
              birthday: infoUser.birthday,
              status: true,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
              const uploadTask = storage
                .ref(`users/${user.uid}`)
                .putString(imageAvatar, "data_url");
              uploadTask.on(
                "state_change",
                (snapshot) => {
                  var progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log("Upload is " + progress + "% done");
                  setNumber(progress);
                  switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED:
                      console.log("Upload is paused");
                      break;
                    case firebase.storage.TaskState.RUNNING:
                      console.log("Upload is running");
                      break;
                  }
                },
                (error) => console.log(error),
                () => {
                  storage
                    .ref("users")
                    .child(user.uid)
                    .getDownloadURL()
                    .then((url) => {
                      db.collection("users").doc(user.uid).set(
                        {
                          AvatarImage: url,
                        },
                        { merge: true }
                      );
                    });
                  router.push("/");
                }
              );
            });
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      alert("Vui lòng chọn ảnh avatar");
    }
  };
  const addImageToAvatar = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readEvent) => {
      setImageAvatar(readEvent.target.result);
    };
  };
  return (
    <div className="bg-[#e9ebee] h-screen">
      <div className="w-full bg-white flex justify-between p-5">
        <Link href="/">
          <img
            src="https://www.facebook.com/rsrc.php/v3/yR/r/TFJeuthJFsO.png"
            width={40}
            height={40}
            className="cursor-pointer"
            alt="logo"
          />
        </Link>

        <ChevronDownIcon className="h-4 cursor-pointer" />
      </div>
      <div className="flex justify-center items-center ">
        <div className="w-4/5 sm:w-1/2 bg-white shadow-md relative mt-4 p-7 pb-20 rounded-xl">
          <h4 className="text-xl font-bold pb-4">
            Chào mừng bạn đến với facebook Lam
          </h4>
          <hr />
          <div className="flex justify-between mt-10">
            <div>
              <h5 className="font-bold text-lg">
                Tải lên ảnh đại diện của bạn
              </h5>
              <span>
                Thêm ảnh đại diện để bạn bè có thể dể dàng tìm thấy bạn
              </span>
              <br />
              <br />
              <label className="mt-10 px-6 rounded-md py-3 border-none bg-blue-500 text-white hover:bg-blue-600 ">
                <span>Thêm ảnh </span>
                <input
                  type="file"
                  onChange={addImageToAvatar}
                  style={{ display: "none" }}
                />
              </label>
            </div>
            {!imageAvatar ? (
              <Avatar style={{ height: "100px", width: "100px" }} />
            ) : (
              <Avatar
                src={imageAvatar}
                style={{ height: "100px", width: "100px" }}
              />
            )}
          </div>
          <div className="text-center">
            <button
              onClick={() => CompleteRegister()}
              className="mt-10 px-6 rounded-md py-3 border-none bg-green-400 text-white hover:bg-green-500 flex flex-1"
            >
              Hoàn Thành {number !== 0 && Math.round(number * 100) / 100}{" "}
              {number !== 0 && <p>%</p>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompletedRegister;
