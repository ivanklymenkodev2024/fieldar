import Image from "next/image";

import logoImage from "../../public/images/logo.png";
import profilePic from "../../public/images/profile.png";
import { SidebarProps } from "flowbite-react";

import companyIcon from "../../public/icons/CompanyIcon.png";
import teamIcon from "../../public/icons/TeamIcon.png";
import projectIcon from "../../public/icons/ProjectIcon.png";
import activityIcon from "../../public/icons/Comment.png";
import subscriptionIcon from "../../public/icons/SubscriptionIcon.png";
import settingsIcon from "../../public/icons/SettingsIcon.png";
import logoutIcon from "../../public/icons/LogoutIcon.png";

const SideBar: React.FC<SidebarProps> = ({ index }: SidebarProps) => {
  return (
    <div className="fixed left-0 top-0 h-[100vh] w-sidebar bg-gray-2">
      <div className=" w-full flex flex-col justify-center items-center my-[30px]">
        <Image src={logoImage} width={176} height={46} alt="FieldAR Logo" />
        <div className="border-gray-4 border-[8px] rounded-[50%]">
          <Image
            src={profilePic}
            width={100}
            height={100}
            alt="Profile Image"
            className="rounded-[50%] border-[4px] border-gray-3 shadow-md drop-shadow-0 drop-shadow-y-3 blur-6"
          />
        </div>
      </div>

      <div className="flex flex-col h-menu justify-between">
        <div className="flex flex-col">
          <div className={"flex items-center justify-start h-[72px] w-full " + (index == 0 ? "bg-gray-4": "bg-gray-2")}>
            <Image
              src={companyIcon}
              width={25}
              height={25}
              alt="company"
              className="ml-[75px]"
            />
            <p className="ml-[10px] text-white text-small font-bold">
              Company Details
            </p>
          </div>
          <div className={"flex items-center justify-start h-[72px] w-full " + (index == 1 ? "bg-gray-4": "bg-gray-2")}>
            <Image
              src={teamIcon}
              width={25}
              height={25}
              alt="team"
              className="ml-[75px]"
            />
            <p className="ml-[10px] text-white text-small font-bold">Team</p>
          </div>
          <div className={"flex items-center justify-start h-[72px] w-full " + (index == 2 ? "bg-gray-4": "bg-gray-2")}>
            <Image
              src={projectIcon}
              width={25}
              height={25}
              alt="[project]"
              className="ml-[75px]"
            />
            <p className="ml-[10px] text-white text-small font-bold">Project</p>
          </div>
          <div className={"flex items-center justify-start h-[72px] w-full " + (index == 3 ? "bg-gray-4": "bg-gray-2")}>
            <Image
              src={activityIcon}
              width={25}
              height={25}
              alt="activity"
              className="ml-[75px]"
            />
            <p className="ml-[10px] text-white text-small font-bold">
              Activity
            </p>
          </div>
          <div className={"flex items-center justify-start h-[72px] w-full " + (index == 4 ? "bg-gray-4": "bg-gray-2")}>
            <Image
              src={subscriptionIcon}
              width={25}
              height={25}
              alt="subscription"
              className="ml-[75px]"
            />
            <p className="ml-[10px] text-white text-small font-bold">
              Subscription
            </p>
          </div>
        </div>

        <div className="flex flex-col">
        <div className={"flex items-center justify-start h-[72px] w-full " + (index == 5 ? "bg-gray-4": "bg-gray-2")}>
            <Image
              src={settingsIcon}
              width={25}
              height={25}
              alt="settings"
              className="ml-[75px]"
            />
            <p className="ml-[10px] text-white text-small font-bold">
              Settings
            </p>
          </div>
          <div className="flex items-center justify-start bg-gray-2 h-[72px] w-full">
            <Image
              src={logoutIcon}
              width={25}
              height={25}
              alt="logout"
              className="ml-[75px]"
            />
            <p className="ml-[10px] text-white text-small font-bold">Log Out</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
