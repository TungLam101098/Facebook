import { ThreeBounce } from "better-react-spinkit";
const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <ThreeBounce size={15} color='blue' />
      </div>
    </div>
  );
};

export default Loading;
