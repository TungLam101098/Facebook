import { useEffect, useState } from "react";
import Head from "next/head";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { infoUser } from "../redux/features/userSlice";
import { useRouter } from "next/router";
import { auth } from "../firebase";
import emailjs from "emailjs-com";
import { Modal } from "antd";

const Login = () => {
  const [verification, setVerification] = useState(0);
  const router = useRouter();

  const dispatch = useDispatch();

  const emailLoginRef = useRef(null);
  const passwordLoginRef = useRef(null);

  const surnameRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const datedRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const MaleRef = useRef(null);
  const FemaleRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [checkPassword, setCheckPassword] = useState(false);

  useEffect(() => {
    setVerification(Math.floor(10000 + Math.random() * 90000));
  }, []);
  const handleChange = (e) => {
    if (e.target.value.length <= 5) {
      setCheckPassword(true);
    } else {
      setCheckPassword(false);
    }
  };

  const LoginSubmit = async (e) => {
    // e.preventDefault();
    const email = emailLoginRef.current.value;
    const password = passwordLoginRef.current.value;
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      alert("Email bạn không kết nối với tài khoản nào.");
      console.log(err);
    }
  };

  const RegisterSubmit = (e) => {
    e.preventDefault();
    if (
      surnameRef.current.value === "" ||
      nameRef.current.value === "" ||
      emailRef.current.value === "" ||
      passwordRef.current.value === "" ||
      datedRef.current.value === "" ||
      monthRef.current.value === "" ||
      yearRef.current.value === "" ||
      (!MaleRef.current.checked && !FemaleRef.current.checked)
    ) {
      alert("Invalid input");
    } else if (passwordRef.current.value.length <= 5) {
      alert("Mật khẩu ít nhất 6 ký tự");
    } else {
      const birthday =
        datedRef.current.value + monthRef.current.value + yearRef.current.value;
      if (MaleRef.current.checked) {
        dispatch(
          infoUser({
            surname: surnameRef.current.value,
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            birthday: birthday,
            gender: MaleRef.current.value,
            verification: verification,
          })
        );
      }
      if (FemaleRef.current.checked) {
        dispatch(
          infoUser({
            surname: surnameRef.current.value,
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            birthday: birthday,
            gender: FemaleRef.current.value,
            verification: verification,
          })
        );
      }
      emailjs
        .sendForm(
          "service_dcsbm1i",
          "template_zmnuzjk",
          e.target,
          "user_FAeCTZsbyipDdR6bK5EiJ"
        )
        .then(
          (result) => {
            console.log(result.text);
          },
          (error) => {
            console.log(error.text);
          }
        );
      router.push("/confirmEmail");
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
            <div className="bg-white p-5 rounded-xl text-center">
              <input
                className="style-input w-full"
                type="email"
                ref={emailLoginRef}
                placeholder="Email của bạn"
                required
              />
              <input
                className="style-input w-full"
                type="password"
                ref={passwordLoginRef}
                placeholder="Mật khẩu"
                required
              />
              <button
                className="w-full bg-blue-500 text-white px-5 py-5 my-2 box-border outline-none border-none hover:bg-blue-600 rounded-md text-3xl"
                onClick={LoginSubmit}
                type="button"
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
                onClick={() => setVisible(true)}
                className="w-full md:w-full lg:w-6/12 bg-green-400 text-white px-5 py-5 my-2 box-border outline-none border-none hover:bg-green-500 rounded-md text-3xl"
              >
                Tạo tài khoản mới
              </button>
            </div>
            <Modal
              title="Đăng ký"
              centered
              visible={visible}
              footer={null}
              onCancel={() => setVisible(false)}
              width={1000}
            >
              <form onSubmit={RegisterSubmit}>
                <div>
                  <div>
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
                        name="Name"
                        placeholder="Tên"
                        ref={nameRef}
                      />
                      <input
                        type="email"
                        name="email"
                        className="style-input w-full"
                        placeholder="Email"
                        ref={emailRef}
                      />
                      <input
                        type="password"
                        className="style-input w-full"
                        placeholder="Mật khẩu mới"
                        onChange={handleChange}
                        ref={passwordRef}
                      />
                      {checkPassword && (
                        <div className="text-red-400 text-sm">
                          Mật khẩu ít nhất 6 ký tự
                        </div>
                      )}
                      <input
                        name="message"
                        defaultValue={verification}
                        hidden
                      />
                      <span className="flex items-center text-gray-500">
                        Ngày sinh <QuestionMarkCircleIcon className="h-7" />{" "}
                      </span>
                      <select className="style-input w-1/3" ref={datedRef}>
                        <option>Ngày {String(new Date().getDate())}</option>
                        {getOptions(1, 31, "Ngày")}
                      </select>
                      <select className="style-input w-1/3" ref={monthRef}>
                        <option>
                          Tháng {String(new Date().getMonth() + 1)}
                        </option>
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
                        type="submit"
                        className="w-2/5 bg-green-400 text-white px-5 py-5 my-2 box-border outline-none border-none hover:bg-green-500 rounded-md text-3xl"
                      >
                        Đăng Ký
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </Modal>
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
