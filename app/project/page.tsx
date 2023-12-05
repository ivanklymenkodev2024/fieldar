"use client";

import Header from "@/components/header";
import SideBar from "@/components/sidebar";
import Link from "next/link";
import { useState } from "react";

import Image from "next/image";

import plusIcon from "../../public/icons/PlusIcon.png";
import closeIcon from "../../public/icons/CloseXIcon.png";

const ProjectPage = () => {
  const [isShowNewProjectModal, setIsShowNewProjectModal] = useState(false);

  const createNewProject = () => {
    setIsShowNewProjectModal(true);
  };

  return (
    <div className="flex">
      <SideBar index={2} />
      <div className="absolute left-[320px] w-panel h-[100vh] bg-gray-4">
        <Header title={"Company Projects"} />
        <div className="px-[32px] pb-[14px] flex flex-col">
          <div className="max-w-[1024px] flex justify-end items-end">
            <div className="flex flex-col">
              <p className="ml-10 font-small font-light text-gray-10">
                Filter by region
              </p>
              <select className="custom-select bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-11 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] w-[260px] m-2 mr-5 outline-none focus:ring-0 appearance-none ">
                <option>NYRO</option>
                <option>SERO</option>
                <option>NERO</option>
              </select>
            </div>
            <div>
              <input
                className="bg-gray-3 text-gray-11 placeholder:italic rounded-[26px] font-small px-[23px] py-[14px] w-[277px] m-2 focus:border-none outline-none ring-0 border-0"
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
                <Link href={"/project-detail"}>South Hampton Library</Link>
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
            <button
              className="mt-[16px] h-fit bg-red-primary rounded-[24px] px-[16px] py-[12px] font-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white flex items-center"
              onClick={() => setIsShowNewProjectModal(true)}
            >
              <Image
                src={plusIcon}
                width={20}
                height={20}
                alt="plus"
                className="mr-[10px]"
              />
              <p className="font-light">Create New Project</p>
            </button>
          </div>
        </div>
      </div>

      {isShowNewProjectModal && (
        <div
          id="modal_user_role"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[610px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowNewProjectModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  Create New Project
                </h3>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowNewProjectModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="mx-[82px] my-[20px]">
                <div className="mx-[30px] flex justify-start w-full mt-[20px]">
                  <p className="text-primary text-white text-left ml-[20px] font-semibold">
                    Project Name
                  </p>
                </div>
                <input className="w-full bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-9 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] m-2 mr-5 outline-none focus:ring-0 appearance-none font-semibold " placeholder="Enter Project Name..."/>
              </div>

              <div className="mx-[82px] my-[20px]">
                <div className="mx-[30px] flex justify-start w-full mt-[20px]">
                  <p className="text-primary text-white text-left ml-[20px] font-semibold">
                    Project Name
                  </p>
                </div>
                <input className="w-full bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-9 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] m-2 mr-5 outline-none focus:ring-0 appearance-none font-semibold " placeholder="Enter Project Name..."/>
              </div>

              <div className="mx-[82px] my-[20px]">
                <div className="mx-[30px] flex justify-start w-full mt-[20px]">
                  <p className="text-primary text-white text-left ml-[20px] font-semibold">
                    Company Region
                  </p>
                </div>
                <select className="custom-black-select w-full bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-9 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] m-2 mr-5 outline-none focus:ring-0 appearance-none font-semibold ">
                  <option>ALL</option>
                  <option>A</option>
                  <option>B</option>
                </select>
              </div>
              <div className="w-full flex justify-center my-[30px]">
                <div className="rounded-[28px] bg-gray-5 px-[80px] py-[15px] w-fit text-ssmall text-white font-bold"> Create Project</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
