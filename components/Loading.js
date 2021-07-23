import { ThreeBounce } from "better-react-spinkit";
const Loading = ({isLogin}) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        {isLogin && <div>Đang tải ảnh lên, vui lòng đợi trong giây lát!</div>}
        <ThreeBounce size={15} color='blue' />
      </div>
    </div>
  );
};

export default Loading;
