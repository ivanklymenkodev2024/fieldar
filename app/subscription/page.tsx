"use client";

import Header from "@/components/header";
import SideBar from "@/components/sidebar";

import Image from "next/image";

import projectIcon from "../../public/icons/ProjectIcon.png";
import modelIcon from "../../public/icons/ModelIcon.png";
import viewIcon from '../../public/icons/ViewIcon.png';
import supportIcon from '../../public/icons/SupportIcon.png';
import teamIcon from '../../public/icons/TeamIcon.png';
import adminIcon from '../../public/icons/AdminIcon.png';
import brandIcon from '../../public/icons/BrandingIcon.png';

const SubscriptionPage = () => {
  return (
    <div className="flex">
      <SideBar index={4} />
      <div className="absolute left-[320px] w-panel h-fit bg-gray-4">
        <Header title={"My Subscription"} />
        <div className="m-[32px] flex flex-wrap">
          <div className="w-[360px] flex flex-col justify-start items-center mr-[32px]">
            <p className="text-gray-10 font-small mb-[13px]">My Current Plan</p>
            <div className="w-full rounded-[26px] bg-gray-3">
              <div className="text-white  text-ssmall flex justify-center p-[14px] mb-[10px] border-b-[2px] border-gray-6 rounded-t-[26px] font-bold">
                Trial
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
                  1 Could-Hosted Project
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
                <p className="text-white text-primary font-bold">3 Models</p>
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
              <p className="text-gray-10 text-primary text-center font-light mt-[10px]">
                Trial end date
              </p>
              <p className="text-white text-primary text-center font-light">
                01/30/2024
              </p>
              <p className="text-gray-5 text-ssmall text-center font-bold mt-[5px] mb-[25px]">
                $0.00/Month
              </p>
            </div>
          </div>
          <div className="w-[620px] flex flex-col items-center">
            <div className="mb-[36px]"></div>
            <div className="w-full rounded-[26px] bg-gray-3">
              <div className="text-white  text-sbig flex justify-center p-[30px] border-b-[2px] border-gray-6 rounded-t-[26px] font-bold">
                Upgrade to Enterprise
              </div>
              <div className="w-full flex flex-wrap justify-between pt-[10px]">
                <div className="md:w-[40%] w-full m-[10px] flex items-center">
                  <div className="w-[32px] h-[32px] mx-[20px]">
                  <Image
                    src={modelIcon}
                    width={32}
                    height={32}
                    alt="model icon"
                  />
                </div>
                  <p className="text-white text-sxsmall">Unlimited Models</p>
                </div>
                <div className="md:w-[40%] w-full m-[10px] flex items-center">
                  <div className="w-[32px] h-[32px] mx-[20px]">
                  <Image
                    src={supportIcon}
                    width={32}
                    height={32}
                    alt="model icon"
                  />
                </div>
                  <p className="text-white text-sxsmall">
                    Priority Expert Support
                  </p>
                </div>
                <div className="md:w-[40%] w-full m-[10px] flex items-center">
                  <div className="w-[32px] h-[32px] mx-[20px]">
                  <Image
                    src={teamIcon}
                    width={32}
                    height={32}
                    alt="model icon"
                  />
                </div>
                  <p className="text-white text-sxsmall">
                    All Collaboration Tools
                  </p>
                </div>
                <div className="md:w-[40%] w-full m-[10px] flex items-center">
                  <div className="w-[32px] h-[32px] mx-[20px]">
                  <Image
                    src={adminIcon}
                    width={32}
                    height={32}
                    alt="model icon"
                  />
                </div>
                  <p className="text-white text-sxsmall">Admin Accounts</p>
                </div>
                <div className="md:w-[40%] w-full m-[10px] flex items-center">
                  <div className="w-[32px] h-[32px] mx-[20px]">
                  <Image
                    src={brandIcon}
                    width={32}
                    height={32}
                    alt="model icon"
                  />
                </div>
                  <p className="text-white text-sxsmall">
                    Custom Company Branding
                  </p>
                </div>
                <div className="md:w-[40%] w-full m-[10px] flex items-center">
                  <div className="w-[32px] h-[32px] mx-[20px]">
                  <Image
                    src={viewIcon}
                    width={32}
                    height={32}
                    alt="model icon"
                  />
                </div>
                  <p className="text-white text-sxsmall">
                    Free Viewing For Everyone
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center mb-[30px] mt-[50px]">
                <p className="text-center font-light text-sxsmall text-white ml-[55px] m-1">
                  Choose projects to add
                </p>
                <div className="flex items-center justify-center">
                  <p className="text-ssmall m-[12px] text-white">Add</p>
                  <select className="text-white bg-red-primary rounded-[31px] p-[15px] w-[200px] border-r-[20px] focus:border-red-primary font-bold mb-4 ring-0 border-red-primary focus:ring-0">
                    <option>1 Project</option>
                    <option>2 Project</option>
                    <option>3 Project</option>
                    <option>4 Project</option>
                  </select>
                </div>
                <div className="flex justify-center items-end">
                  <p className="text-center text-custom-1 text-2xbig mr-1 mb-0">
                    $199
                  </p>
                  <p className="text-center text-gray-12 text-msmall mb-[12px]">
                    per month
                  </p>
                </div>
                <p className="text-red-primary text-xsmall text-center mt-[-10px]">
                  Billed yearly
                </p>
                <div className="w-[1px] h-[60px]"></div>

                <p className="text-center text-gray-10 font-normal">
                  $2,388 per project
                </p>
                <p className="text-center text-white text-2xsmall font-bold">
                  Total: $2,388 per year
                </p>
                <div className="w-full flex justify-center">
                  <button className="mx-[24px] mt-[24px] h-fit bg-gray-5 rounded-[44px] px-[16px] py-[12px] w-[320px] font-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white">
                    <p className="font-semibold">Upgrade Subscription</p>
                  </button>
                </div>
                <p className="text-center text-gray-10 font-normal text-2xsmall m-1">
                  Add/Remove projects at any time
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
