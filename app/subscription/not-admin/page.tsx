"use client";

import Header from "@/components/header";
import SideBar from "@/components/sidebar";

import Image from "next/image";

import projectIcon from "../../../public/icons/ProjectIcon.png";
import modelIcon from "../../../public/icons/ModelIcon.png";
import viewIcon from '../../../public/icons/ViewIcon.png';
import supportIcon from '../../../public/icons/SupportIcon.png';
import teamIcon from '../../../public/icons/TeamIcon.png';
import adminIcon from '../../../public/icons/AdminIcon.png';
import brandIcon from '../../../public/icons/BrandingIcon.png';

const SubscriptionPage = () => {
  return (
    <div className="flex">
      <SideBar index={4} />
      <div className="absolute left-[320px] w-panel min-h-[100vh] bg-gray-4">
        <Header title={"My Subscription"} />
        <div className="m-[32px] flex flex-wrap">
          <div className="w-[360px] flex flex-col justify-start items-center mr-[32px]">
            <p className="text-gray-10 font-small mb-[13px]">My Current Plan</p>
            <div className="w-full rounded-[26px] bg-gray-3">
              <div className="text-white  text-ssmall flex justify-center p-[14px] mb-[10px] border-b-[2px] border-gray-6 rounded-t-[26px] font-bold">
                Enterprise
              </div>
              <div className="flex flex-row px-[22px] py-[10px] items-center">
                <div className="w-[32px] h-[32px] mx-[20px]">
                  <Image
                    src={projectIcon}
                    width={32}
                    height={32}
                    alt="project icon"
                  />
                </div>
                <p className="text-white text-primary font-bold">
                  5 Could-Hosted Project
                </p>
              </div>
              <div className="flex flex-row px-[22px] py-[10px]">
                <div className="w-[32px] h-[32px] mx-[20px]">
                  <Image
                    src={modelIcon}
                    width={32}
                    height={32}
                    alt="model icon"
                  />
                </div>
                <p className="text-white text-primary font-bold">Unlimited Models</p>
              </div>
              <div className="flex flex-row px-[22px] py-[10px]">
              <div className="w-[32px] h-[32px] mx-[20px]">
                  <Image
                    src={viewIcon}
                    width={32}
                    height={32}
                    alt="model icon"
                  />
                </div>
                <p className="text-white text-primary font-bold">
                  Free Viewing For Everyone
                </p>
              </div>
              <p className="text-gray-10 text-small text-center font-light mt-[10px]">
                Subscription Managed by
              </p>
              <p className="text-gray-10 text-ssmall text-center font-bold mt-[5px] mb-[25px]">
                [Company Name]
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
