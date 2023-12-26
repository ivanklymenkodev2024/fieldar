import { ReHeaderProps } from "@/configs";

import logoImage from "../../../public/images/logo.png";
import companyIcon from "../../../public/icons/CompanyIcon.png";
import teamIcon from "../../../public/icons/TeamIcon.png";
import projectIcon from "../../../public/icons/ProjectIcon.png";
import activityIcon from "../../../public/icons/Comment.png";
import subscriptionIcon from "../../../public/icons/SubscriptionIcon.png";
import settingsIcon from "../../../public/icons/SettingsIcon.png";
import hamburgerMenuIcon from "../../../public/icons/HamburgerMenuIcon.png";

import userIcon from "../../../public/icons/User.png";

import Image from "next/image";
import { settings } from "firebase/analytics";

const ReHeader: React.FC<ReHeaderProps> = ({
  title,
  index,
  show,
}: ReHeaderProps) => {
  return (
    <div className="flex-col w-full lg:hidden block">
      <div className="h-[90px] flex items-center justify-between px-[30px] bg-gray-3">
        <Image src={logoImage} width={176} height={46} alt="FieldAR Logo" />
        <button
          className="w-[30px] h-[30px]"
          onClick={() => {
            show(true);
          }}
        >
          <Image width={25} height={25} alt="menu" src={hamburgerMenuIcon} />
        </button>
      </div>
      {index == -1 && (
        <div className="flex items-center justify-start py-[30px] mx-[30px] border-b-[2px] border-gray-10">
          <Image src={userIcon} width={25} height={25} alt="user" />
          <p className="ml-[10px] text-white text-small font-bold">{title}</p>
        </div>
      )}
      {index == 0 && (
        <div className="flex items-center justify-start py-[30px] mx-[30px] border-b-[2px] border-gray-10">
          <Image src={companyIcon} width={25} height={25} alt="company" />
          <p className="ml-[10px] text-white text-small font-bold">{title}</p>
        </div>
      )}
      {index == 1 && (
        <div className="flex items-center justify-start py-[30px] mx-[30px] border-b-[2px] border-gray-10">
          <Image src={teamIcon} width={25} height={25} alt="team" />
          <p className="ml-[10px] text-white text-small font-bold">{title}</p>
        </div>
      )}
      {index == 2 && (
        <div className="flex items-center justify-start py-[30px] mx-[30px] border-b-[2px] border-gray-10">
          <Image src={projectIcon} width={25} height={25} alt="[project]" />
          <p className="ml-[10px] text-white text-small font-bold">{title}</p>
        </div>
      )}
      {index == 3 && (
        <div className="flex items-center justify-start py-[30px] mx-[30px] border-b-[2px] border-gray-10">
          <Image src={activityIcon} width={25} height={25} alt="activity" />
          <p className="ml-[10px] text-white text-small font-bold">{title}</p>
        </div>
      )}
      {index == 4 && (
        <div className="flex items-center justify-start py-[30px] mx-[30px] border-b-[2px] border-gray-10">
          <Image
            src={subscriptionIcon}
            width={25}
            height={25}
            alt="subscription"
          />
          <p className="ml-[10px] text-white text-small font-bold">{title}</p>
        </div>
      )}
      {index == 5 && (
        <div className="flex items-center justify-start py-[30px] mx-[30px] border-b-[2px] border-gray-10">
          <Image src={settingsIcon} width={25} height={25} alt="subscription" />
          <p className="ml-[10px] text-white text-small font-bold">{title}</p>
        </div>
      )}
    </div>
  );
};

export default ReHeader;
