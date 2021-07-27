import {
  ChevronDownIcon,
  ShoppingBagIcon,
  UserGroupIcon
} from '@heroicons/react/outline';
import {
  CalendarIcon,
  DesktopComputerIcon,
  UsersIcon
} from "@heroicons/react/solid";
import SidebarRow from './SidebarRow';
import { useSelector } from "react-redux";
import { selectInfo } from '../redux/features/userSlice';

const Sidebar = () => {
  // const [user, loading] = useAuthState(auth);
  const infoUser = useSelector(selectInfo);
  if(!infoUser.AvatarImage) return null;
  return (
    <div className="p-2 mt-2 sm:mt-5 max-w-[600px] xl:min-w-[300px]">
      <SidebarRow src={infoUser.AvatarImage} title={infoUser.name} />
      <SidebarRow Icon={UsersIcon} title="Bạn bè" />
      <SidebarRow Icon={UserGroupIcon} title="Nhóm" />
      <SidebarRow Icon={ShoppingBagIcon} title="Marketplace" />
      <SidebarRow Icon={DesktopComputerIcon} title="Watch" />
      <SidebarRow Icon={CalendarIcon} title="Sự kiện" />
      <SidebarRow Icon={ChevronDownIcon} title="See More" />
    </div>
  )
}

export default Sidebar
