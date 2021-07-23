import { CameraIcon } from "@heroicons/react/solid";
import { UserAddIcon } from "@heroicons/react/solid";
import { ChatIcon } from "@heroicons/react/solid";

function HeaderUser() {
  return (
    <div>
      <div className="">
        <div className="flex justify-center items-center bg-gray-200">
          <div className="w-full sm:w-4/6 relative">
            <img
              className="w-full h-44 sm:h-96 object-cover rounded-lg"
              src="https://scontent-hkg4-1.xx.fbcdn.net/v/t1.6435-9/101801932_297967541362716_3387244181536636928_n.jpg?_nc_cat=102&ccb=1-3&_nc_sid=e3f864&_nc_ohc=bWXeBRk0d40AX_0tyAg&_nc_ht=scontent-hkg4-1.xx&oh=5dc0dc27ea96e21cc92d8658b5043a58&oe=61208F1B"
            />
            <div className="flex justify-center absolute top-32 left-[30%] sm:left-[42%] sm:top-80">
              <div className="relative">
                <img
                  className="rounded-full cursor-pointer w-36 h-36 border-solid border-white border-4"
                  src="https://scontent-hkg4-1.xx.fbcdn.net/v/t1.6435-1/c0.50.200.200a/p200x200/84504031_239808157178655_5499423649335083008_n.jpg?_nc_cat=107&ccb=1-3&_nc_sid=7206a8&_nc_ohc=SIeJOjPlrUsAX8HrWXU&_nc_ht=scontent-hkg4-1.xx&oh=2e892890c86521fa078b2f698067273d&oe=61216A3B"
                  layout="fixed"
                />
                <CameraIcon className="h-9 rounded-full bg-gray-300 p-1 absolute right-4 top-3/4 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-14 bg-white flex justify-center items-center">
          <div className="w-full sm:w-4/6 text-center  p-10">
            <h2 className="pb-5 text-4xl font-bold">Nguyễn Lâm</h2>
            <hr className="text-gray-500" />
            <div className="flex justify-between mt-4">
              <ul className="flex px-3 w-2/3 justify-between">
                <li style={{ borderBottom: "1px solid blue" }} className="font-bold text-gray-500 hover:bg-gray-300 rounded-md cursor-pointer p-3 ">Bài viết</li>
                <li className="font-bold text-gray-500 hover:bg-gray-300 rounded-md cursor-pointer p-3 ">Giới thiệu</li>
                <li className="font-bold text-gray-500 hover:bg-gray-300 rounded-md cursor-pointer p-3 ">Bạn bè</li>
                <li className="font-bold text-gray-500 hover:bg-gray-300 rounded-md cursor-pointer p-3 ">Ảnh</li>
                <li className="font-bold text-gray-500 hover:bg-gray-300 rounded-md cursor-pointer p-3 ">Video</li>
              </ul>
              <ul className="flex  w-1/3 justify-between">
                <li className="font-bold bg-blue-500 hover:bg-blue-600 rounded-md cursor-pointer p-3 text-white">
                  <button className="flex items-center"><UserAddIcon className="h-4 pr-2" /> Thêm bạn bè</button>
                </li>
                <li className="font-bold bg-gray-300 hover:bg-gray-400 rounded-md cursor-pointer p-3 ">
                  <button className="flex items-center"><ChatIcon className="h-4 pr-2" />  Nhắn tin</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-gray-200 h-44"></div>
      </div>
    </div>
  );
}

export default HeaderUser;
