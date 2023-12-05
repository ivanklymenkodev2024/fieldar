"use client";

import Header from "@/components/header";
import SideBar from "@/components/sidebar";

const ActivityPage = () => {
  return (
    <div className="flex">
      <SideBar index={3}/>
      <div className="absolute left-[320px] w-panel h-[100vh] bg-gray-4">
        <Header title={"Company Activity"} />
        <div className="px-[32px] pb-[14px] flex flex-col">
          <div className="max-w-[1024px] flex justify-end items-end">
            <div className="flex flex-row items-center">
              <p className="ml-10 font-small font-light text-gray-10">
                Filter by: 
              </p>
              <select className="bg-gray-3 border-gray-3 border-r-[30px] text-gray-11 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] w-[260px] m-2 mr-5 outline-none ">
                <option>South Hampton L...</option>
                <option>South Hampton L...</option>
                <option>South Hampton L...</option>
              </select>
            </div>
          </div>

          <div className="max-w-[1024px] flex flex-col bg-gray-3 h-actable rounded-[24px]">
            <div className="">
              <div className="flex bg-gray-2 px-[30px] py-[15px] rounded-t-[24px]">
                <p className="text-gray-10 text-small font-semibold mr-2">Project:</p>
                <p className="text-white text-small font-semibold">South Hampton Library</p>
              </div>
              <div className="flex bg-gray-3 px-[30px] py-[15px] justify-between items-center border-gray-4 border-b-[1px]">
                <div className="flex justify-start items-center">
                  <div className="w-[30px] h-[30px] bg-white mr-[17px]"></div>
                  <p className="text-gray-10 text-primary font-semibold mr-[40px]">Kyle Szostek</p>
                  <p className="text-gray-10 text-primary font-semibold mr-1">edited model:</p>
                  <p className="text-red-primary text-primary font-semibold">Corridor D9 </p>
                </div>
                <div>
                <p className="text-gray-10 text-primary font-semibold mr-1">9/15/2023 9:34am</p>
                </div>
              </div>
              <div className="flex bg-gray-3 px-[30px] py-[15px] justify-between items-center border-gray-4 border-b-[1px]">
                <div className="flex justify-start">
                  <div className="w-[30px] h-[30px] bg-white mr-[17px]"></div>
                  <p className="text-gray-10 text-primary font-semibold mr-[40px]">John Jones</p>
                  <p className="text-gray-10 text-primary font-semibold mr-1">created a markup in model:</p>
                  <p className="text-red-primary text-primary font-semibold">Room 123 </p>
                </div>
                <div>
                <p className="text-gray-10 text-primary font-semibold mr-1">9/13/2023 1:15pm</p>
                </div>
              </div>
            </div>
            <div className="">
              <div className="flex bg-gray-2 p-[30px] py-[15px]">
                <p className="text-gray-10 text-small font-semibold mr-2">Project:</p>
                <p className="text-white text-small font-semibold">NASA Headquarters</p>
              </div>
              <div className="flex bg-gray-3 px-[30px] py-[15px] justify-between items-center border-gray-4 border-b-[1px]">
                <div className="flex justify-start items-center">
                  <div className="w-[30px] h-[30px] bg-white mr-[17px]"></div>
                  <p className="text-gray-10 text-primary font-semibold mr-[40px]">Kyle Szostek</p>
                  <p className="text-gray-10 text-primary font-semibold mr-1">created model:</p>
                  <p className="text-red-primary text-primary font-semibold">Launch Pad D17</p>
                </div>
                <div>
                <p className="text-gray-10 text-primary font-semibold mr-1">9/15/2023 9:34am</p>
                </div>
              </div>
              <div className="flex bg-gray-3 px-[30px] py-[15px] justify-between items-center border-gray-4 border-b-[1px]">
                <div className="flex justify-start">
                  <div className="w-[30px] h-[30px] bg-white mr-[17px]"></div>
                  <p className="text-gray-10 text-primary font-semibold mr-[40px]">John Jones</p>
                  <p className="text-gray-10 text-primary font-semibold mr-1">responded to a markup in:</p>
                  <p className="text-red-primary text-primary font-semibold">Control Center 266</p>
                </div>
                <div>
                <p className="text-gray-10 text-primary font-semibold mr-1">9/13/2023 1:15pm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
