import { ChevronDownIcon } from "@heroicons/react/outline";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectInfo } from "../../redux/features/userSlice";
import { useRouter } from "next/router";
import Link from "next/link";
import CompletedRegister from "../../components/CompletedRegister";

function ConfirmEmail() {
  const infoUser = useSelector(selectInfo);
  const inputRef = useRef(null);
  const router = useRouter();
  const [checkEmail, setCheckEmail] = useState(false);

  const Continue = () => {
    try {
      if (!infoUser.verification) {
        alert("Đăng ký lỗi, vui lòng thử lại");
        router.push("/");
      }
      if (infoUser.verification === parseInt(inputRef.current.value)) {
        setCheckEmail(true);
        console.log("oke");
      } else {
        alert("Sai mã xác nhận");
      }
    } catch (error) {
      alert("Đăng ký lỗi, vui lòng thử lại");
      router.push("/");
    }
  };

  return (
    <>
      {!checkEmail ? (
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
            <div className="w-4/5 sm:w-1/2 bg-white shadow-md relative mb-4 mt-4 p-7 pb-20 rounded-xl">
              <h4 className="text-xl font-bold pb-4">
                Nhập mã từ email của bạn
              </h4>
              <hr />
              <span className="text-gray-400">
                Hãy cho chúng tôi biết email này thuộc về bạn. Hãy nhập mã trong
                email được gửi đến{" "}
                <span className="font-bold text-gray-700">
                  {infoUser?.email}
                </span>
              </span>
              <br />
              <div className="relative">
                <span className="absolute left-4 top-6 text-gray-500">
                  FB -
                </span>
                <input
                  className="w-1/2 lg:w-2/12 mt-4 pl-12 py-2 box-border rounded-md outline-none border border-solid border-gray-300 focus:border-blue-600 "
                  type="text"
                  maxLength="5"
                  ref={inputRef}
                />
              </div>
              <br />
              <a href="#" className="text-blue-500 hover:underline">
                Gửi lại email
              </a>
              <hr />
              <button
                onClick={() => Continue()}
                className="mt-6 px-6 rounded-md py-3 border-none bg-blue-500 text-white absolute right-5 hover:bg-blue-600 "
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      ) : (
        <CompletedRegister />
      )}
    </>
  );
}

export default ConfirmEmail;
