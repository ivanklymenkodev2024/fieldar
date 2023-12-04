"use client";

import Header from "@/components/header";
import SideBar from "@/components/sidebar";

const ProjectPage = () => {
  return (
    <div className="flex">
      <SideBar />
      <div className="absolute left-[320px] w-panel h-[100vh] bg-gray-4">
        <Header title={"Company Projects"} />
        <div className="px-[32px] pb-[14px] flex flex-col">
          <div className="max-w-[1024px] flex justify-end items-end">
            <div className="flex flex-col">
              <p className="ml-10 font-small font-light text-gray-10">
                Filter by region
              </p>
              <select className="bg-gray-3 border-gray-3 border-r-[30px] text-gray-11 placeholder:italic rounded-[26px] font-small px-[23px] py-[14px] w-[260px] m-2 outline-none ">
                <option>NYRO</option>
                <option>SERO</option>
                <option>NERO</option>
              </select>
            </div>
            <div>
              <input
                className="bg-gray-3 text-gray-11 placeholder:italic rounded-[26px] font-small px-[23px] py-[14px] w-[277px] m-2 focus:border-none outline-none "
                type="text"
                placeholder="Search Projects"
              />
            </div>
          </div>

          <div className="max-w-[1024px] px-[32px] py-[11px]">
            <div className="grid grid-cols-8">
              <p className="font-small text-gray-10 col-span-3 font-light">
                Project Name
              </p>
              <p className="font-small text-gray-10 col-span-2 font-light">
                Company Region
              </p>
              <p className="font-small text-gray-10 col-span-2 font-light">
                Project Location
              </p>
              <p className="font-small text-gray-10 col-span-1 font-light">
                Editable
              </p>
            </div>
          </div>

          <div className="max-w-[1024px] flex flex-col bg-gray-3 h-ttable p-[22px] py-[6px] rounded-[24px]">
            <div className="w-full grid grid-cols-8 p-[10px] border-b-[1px] border-gray-4">
              <p className="text-white col-span-3 font-light">
                South Hampton Library
              </p>
              <p className="text-white col-span-2 font-light">NYRO</p>
              <p className="text-white col-span-2 font-light">Buffalo, NY</p>
              <p className="text-white col-span-1 font-light">0</p>
            </div>
            <div className="w-full grid grid-cols-8 p-[10px] border-b-[1px] border-gray-4">
              <p className="text-white col-span-3 font-light">
                NASA Headquarters
              </p>
              <p className="text-white col-span-2 font-light">SERO</p>
              <p className="text-white col-span-2 font-light">Houston, TX</p>
              <p className="text-white col-span-1 font-light">0</p>
            </div>
            <div className="w-full grid grid-cols-8 p-[10px] border-b-[1px] border-gray-4">
              <p className="text-white col-span-3 font-light">666 S Wall St.</p>
              <p className="text-white col-span-2 font-light">NERO</p>
              <p className="text-white col-span-2 font-light">Hell, NY</p>
              <p className="text-white col-span-1 font-light">0</p>
            </div>
          </div>

          <div className="max-w-[1024px] flex justify-end">
            <button className="mt-[16px] h-fit bg-red-primary rounded-[24px] px-[16px] py-[12px] font-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white">
              <p className="font-light">Create New Project</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
