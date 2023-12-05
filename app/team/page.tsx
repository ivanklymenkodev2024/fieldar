"use client";

import Header from "@/components/header";
import SideBar from "@/components/sidebar";

const TeamPage = () => {
  return (
    <div className="flex">
      <SideBar index={1} />
      <div className="absolute left-[320px] w-panel h-[100vh] bg-gray-4">
        <Header title={"Company Team"} />
        <div className="px-[32px] py-[14px] flex flex-col">
          <div className="max-w-[1024px] flex justify-end">
            <input
              className="bg-gray-3 text-gray-11 placeholder:italic rounded-[26px] font-small px-[23px] py-[14px] w-[400px] m-2 focus:border-none outline-none "
              type="text"
              placeholder="Search Team Members"
            />
          </div>

          <div className="max-w-[1024px] px-[32px] py-[11px]">
            <div className="grid grid-cols-3">
              <p className="font-small text-gray-10 col-span-1 font-light">Name</p>
              <p className="font-small text-gray-10 col-span-1 font-light">Email</p>
              <p className="font-small text-gray-10 col-span-1 font-light">Assigned Projects</p>
            </div>
          </div>

          <div className="max-w-[1024px] flex flex-col bg-gray-3 h-ttable p-[22px] py-[6px] rounded-[24px]">
            <div className="w-full grid grid-cols-3 p-[10px] border-b-[1px] border-gray-4">
              <p className="text-white col-span-1 font-light">Kyle Szostek</p>
              <p className="text-white col-span-1 font-light">kyle.szostek@gmail.com</p>
              <p className="text-white col-span-1 font-light">2</p>
            </div>
            <div className="w-full grid grid-cols-3 p-[10px] border-b-[1px] border-gray-4">
              <p className="text-white col-span-1 font-light">Morgan Winter</p>
              <p className="text-white col-span-1 font-light">morgan@email.com</p>
              <p className="text-white col-span-1 font-light">4</p>
            </div>
            <div className="w-full grid grid-cols-3 p-[10px] border-b-[1px] border-gray-4">
              <p className="text-white col-span-1 font-light">Jim Jones</p>
              <p className="text-white col-span-1 font-light">jim@email.com</p>
              <p className="text-white col-span-1 font-light">6</p>
            </div>
          </div>

          <div className="max-w-[1024px] flex justify-end">
          <button className="mt-[16px] h-fit bg-red-primary rounded-[24px] px-[16px] py-[12px] font-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white"><p className="font-light">Invite New Member</p></button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeamPage;
