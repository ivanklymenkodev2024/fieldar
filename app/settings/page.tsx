"use client";

import Header from "@/components/header";
import SideBar from "@/components/sidebar";

import Image from "next/image";

import projectIcon from "../../public/icons/ProjectIcon.png";
import modelIcon from "../../public/icons/ModelIcon.png";
import viewIcon from "../../public/icons/ViewIcon.png";
import supportIcon from "../../public/icons/SupportIcon.png";
import teamIcon from "../../public/icons/TeamIcon.png";
import adminIcon from "../../public/icons/AdminIcon.png";
import brandIcon from "../../public/icons/BrandingIcon.png";

const SettingsPage = () => {
  return (
    <div className="flex">
      <SideBar index={5} />
      <div className="absolute left-[320px] w-panel min-h-[100vh] bg-gray-4">
        <Header title={"My Settings"} />
        <div className="m-[32px] flex flex-wrap">
          <div className="w-[460px] flex flex-col justify-start items-center mr-[32px]">
            <p className="text-gray-10 font-small mb-[13px]">My Current Plan</p>
            <div className="w-full rounded-[26px] bg-gray-3 flex flex-col">
              <div className="text-white  text-ssmall flex justify-center p-[14px] mb-[10px] border-b-[2px] border-gray-4 rounded-t-[26px] font-bold">
                Email Settings
              </div>
              <p className="text-2xsmall text-white text-center mb-[20px]">
                Receive email notifications for the following
              </p>
              <div className="flex flex-col items-start w-full">
                <div className="flex items-center mx-[20px] my-[10px]">
                  <div className="w-[30px] h-[30px] bg-gray-5 mx-[10px] rounded-[6px]"></div>
                  <p className="text-2xsmall text-white font-normal">
                    Updates to your subscription
                  </p>
                </div>
                <div className="flex items-center mx-[20px] my-[10px]">
                  <div className="w-[30px] h-[30px] bg-gray-5 mx-[10px] rounded-[6px]"></div>
                  <p className="text-2xsmall text-white font-normal">
                    Updates to your subscription
                  </p>
                </div>
                <div className="flex items-center mx-[20px] my-[10px]">
                  <div className="w-[30px] h-[30px] bg-gray-5 mx-[10px] rounded-[6px]"></div>
                  <p className="text-2xsmall text-white font-normal">
                    Updates to your subscription
                  </p>
                </div>
                <div className="flex items-center mx-[20px] my-[10px]">
                  <div className="w-[30px] h-[30px] bg-gray-5 mx-[10px] rounded-[6px]"></div>
                  <p className="text-2xsmall text-white font-normal">
                    Updates to your subscription
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  className="bg-gray-5 rounded-[33px] px-[90px] py-[10px] my-[20px] text-white text-medium shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 "
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
