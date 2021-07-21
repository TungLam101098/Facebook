import Head from "next/head";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { useRef } from "react";

const Login = () => {
  const surnameRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const datedRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const MaleRef = useRef(null);
  const FemaleRef = useRef(null);

  const LoginSubmit = (e) => {
    e.preventDefault();
    console.log("Login");
  };

  const RegisterSubmit = () => {
    if (
      surnameRef.current.value === "" ||
      nameRef.current.value === "" ||
      emailRef.current.value === "" ||
      passwordRef.current.value === "" ||
      datedRef.current.value === "" ||
      monthRef.current.value === "" ||
      (!MaleRef.current.checked  &&
      !FemaleRef.current.checked  )
    ) {
      alert("Invalid input");
    } else {
      
    }
  };

  const getOptions = (start, end, title) => {
    const options = [];

    for (let i = start; i <= end; i++) {
      options.push(
        <option key={i}>
          {title} {i}
        </option>
      );
    }

    return options;
  };
  const thisYear = new Date().getFullYear();
  return (
    <div>
      <Head>
        <title>Login</title>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"
          integrity="sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ=="
          crossorigin="anonymous"
        />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
      </Head>
      <div className="flex justify-center items-center h-screen bg-[#f0f2f5]">
        <div className="w-4/5 block md:grid grid-cols-2 gap-x-10">
          <div className="">
            <img
              height={106}
              width={300}
              src="https://www.facebook.com/rsrc.php/y8/r/dF5SId3UHWd.svg"
              alt=""
            />
            <h4 className="text-5xl">
              Facebook giúp bạn kết nối và chia sẻ với mọi người trong cuộc sống
              của bạn
            </h4>
          </div>
          <div>
            <form className="bg-white p-5 rounded-xl text-center">
              <input
                className="style-input w-full"
                type="email"
                placeholder="Email của bạn"
                required
              />
              <input
                className="style-input w-full"
                type="password"
                placeholder="Mật khẩu"
                required
              />
              <button
                className="w-full bg-blue-500 text-white px-5 py-5 my-2 box-border outline-none border-none hover:bg-blue-600 rounded-md text-3xl"
                onClick={LoginSubmit}
                type="submit"
              >
                Đăng nhập
              </button>
              <a
                href="#"
                className=" text-xl text-blue-400 cursor-pointer hover:underline pb-4"
              >
                Quên mật khẩu
              </a>
              <hr />
              <button
                type="button"
                className="w-full lg:w-6/12 bg-green-400 text-white px-5 py-5 my-2 box-border outline-none border-none hover:bg-green-500 rounded-md text-3xl"
                data-toggle="modal"
                data-target="#exampleModalCenter"
              >
                Tạo tài khoản mới
              </button>
            </form>
            <div
              className="modal fade"
              id="exampleModalCenter"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalCenterTitle"
              aria-hidden="true"
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h3
                      className="modal-title text-6xl font-bold pb-4"
                      id="exampleModalLongTitle"
                    >
                      Đăng ký
                    </h3>
                    <span>Nhanh chóng và dễ dàng</span>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <input
                      type="text"
                      className="style-input w-6/12"
                      placeholder="Họ"
                      ref={surnameRef}
                    />
                    <input
                      type="text"
                      className="style-input w-6/12"
                      placeholder="Tên"
                      ref={nameRef}
                    />
                    <input
                      type="email"
                      className="style-input w-full"
                      placeholder="Email"
                      ref={emailRef}
                    />
                    <input
                      type="password"
                      className="style-input w-full"
                      placeholder="Mật khẩu mới"
                      ref={passwordRef}
                    />
                    <span className="flex items-center text-gray-500">
                      Ngày sinh <QuestionMarkCircleIcon className="h-7" />{" "}
                    </span>
                    <select className="style-input w-1/3" ref={datedRef}>
                      <option>Ngày {String(new Date().getDate())}</option>
                      {getOptions(1, 31, "Ngày")}
                    </select>
                    <select className="style-input w-1/3" ref={monthRef}>
                      <option>Tháng {String(new Date().getMonth() + 1)}</option>
                      {getOptions(1, 12, "Tháng")}
                    </select>
                    <select className="style-input w-1/3" ref={yearRef}>
                      <option>Năm {String(new Date().getFullYear())}</option>
                      {getOptions(thisYear - 50, thisYear, "Năm")}
                    </select>
                    <span className="flex items-center text-gray-500">
                      Giới tính <QuestionMarkCircleIcon className="h-7" />{" "}
                    </span>
                    <div className="flex">
                      <div className="w-6/12 rounded-md border-solid border-2 border-gray-300 h-20 text-3xl flex justify-between px-5 py-5">
                        <span>Nam</span>
                        <input
                          className="scale-150"
                          type="radio"
                          name="gender"
                          value="1"
                          ref={MaleRef}
                        />
                      </div>
                      <div className="w-6/12 rounded-md border-solid border-2 border-gray-300 h-20 text-3xl flex justify-between px-5 py-5">
                        <span>Nữ</span>
                        <input
                          className="scale-150"
                          type="radio"
                          name="gender"
                          value="0"
                          ref={FemaleRef}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer text-center">
                    <button
                      type="button"
                      onClick={RegisterSubmit}
                      className="w-2/5 bg-green-400 text-white px-5 py-5 my-2 box-border outline-none border-none hover:bg-green-500 rounded-md text-3xl"
                    >
                      Đăng Ký
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <span>
              <span>Tạo trang</span>dành cho người nổi tiếng, nhãn hiệu hoặc
              doanh nghiệp.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
