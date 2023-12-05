"use client";

import Header from "@/components/header";
import SideBar from "@/components/sidebar";
import Link from "next/link";

import Image from "next/image";

import backIcon from "../../public/icons/DropdownArrowIcon.png";
import editIcon from "../../public/icons/EditIcon.png";
import teamIcon from "../../public/icons/TeamIcon.png";
import plusIcon from '../../public/icons/PlusIcon.png';

const ProjectDetailPage = () => {
  return (
    <div className="flex">
      <SideBar index={2} />
      <div className="absolute left-[320px] w-panel min-h-[100vh] bg-gray-4">
        <Header title={"Project Details"} />
        <div className="px-[32px] py-[10px] flex flex-col">
          <Link
            href={"/project"}
            className="text-small px-[20px] py-[10px] flex items-center bg-gray-2 w-fit rounded-[29px]"
          >
            <Image
              src={backIcon}
              width={16}
              height={19}
              alt="back"
              className="mr-[10px]"
            />{" "}
            <p className="text-small font-semibold text-white">Back</p>
          </Link>
        </div>
        <div className="mx-[32px] my-[10px] bg-gray-2 rounded-[28px] max-w-[840px] flex justify-between">
          <div className="px-[20px] py-[10px]">
            <div className="flex my-2">
              <p className="text-ssmall font-normal text-gray-10">Project: </p>
              <p className="ml-[10px] text-ssmall font-bold text-white">
                South Hampton Library
              </p>
            </div>
            <div className="flex my-2">
              <p className="text-ssmall font-normal text-gray-10">Location: </p>
              <p className="ml-[10px] text-ssmall font-bold text-white">
                Buffalo, NY
              </p>
            </div>
          </div>
          <div className="px-[20px] py-[10px] flex flex-col justify-around items-center">
            <button className="h-fit bg-gray-5 rounded-[24px] px-[16px] py-[12px] text-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white flex items-center">
              <Image src={editIcon} width={25} height={25} alt="edit" />
              <p className="ml-[10px] text-primary font-normal">Edit Details</p>
            </button>
            <button className="text-red-primary text-primary font-normal">
              Delete Project
            </button>
          </div>
        </div>
        <div className="px-[32px] py-[10px] flex flex-wrap">
          <div className="flex flex-col mr-[20px]">
            <p className="text-small text-gray-10 mx-[30px] my-[10px]">
              Models
            </p>
            <div className="w-[450px] bg-gray-3 h-[500px] rounded-[24px] ">
              <div className="rounded-t-[24px] flex justify-between items-center mx-[30px] my-[15px]">
                <div className="flex justify-start items-center">
                  <div className="w-[54px] h-[54px] bg-white rounded-[13px] mr-[18px]"></div>
                  <p className="text-primary text-white font-normal">
                    Room 123
                  </p>
                </div>
                <Image src={editIcon} width={22} height={22} alt="edit" />
              </div>
              <hr className="w-full border-[1px] border-gray-7" />

              <div className="flex justify-between items-center mx-[30px] my-[15px]">
                <div className="flex justify-start items-center">
                  <div className="w-[54px] h-[54px] bg-white rounded-[13px] mr-[18px]"></div>
                  <p className="text-primary text-white font-normal">
                    Corridor 34f
                  </p>
                </div>
                <Image src={editIcon} width={22} height={22} alt="edit" />
              </div>
              <hr className="w-full border-[1px] border-gray-7" />
            </div>
          </div>

          <div className="flex flex-col mr-[20px]">
            <div className="flex items-center justify-start mx-[15px]">
              <Image
                src={teamIcon}
                width={25}
                height={25}
                alt={"team"}
                className="opacity-30"
              />
              <p className="text-small text-gray-10 mx-[15px] my-[10px]">
                Project Team Members
              </p>
            </div>
            <div className="w-[520px] bg-gray-3 h-[500px] rounded-[24px] ">
              <div className="rounded-t-[24px] flex justify-between items-center mx-[30px] my-[15px]">
                <div className="flex justify-between items-center grow mr-[40px]">
                  <p className="text-primary text-white font-normal">
                    Kyle Szostek
                  </p>
                  <p className="text-primary text-white font-normal">Manager</p>
                </div>
                <Image src={editIcon} width={22} height={22} alt="edit" />
              </div>
              <hr className="w-full border-[1px] border-gray-7" />

              <div className="flex justify-between items-center mx-[30px] my-[15px]">
                <div className="flex justify-between items-center grow mr-[40px]">
                  <p className="text-primary text-white font-normal">
                    Jim Jones
                  </p>
                  <p className="text-primary text-white font-normal">Manager</p>
                </div>
                <Image src={editIcon} width={22} height={22} alt="edit" />
              </div>
              <hr className="w-full border-[1px] border-gray-7" />

              <div className="flex justify-between items-center mx-[30px] my-[15px]">
                <div className="flex justify-between items-center grow mr-[40px]">
                  <p className="text-primary text-white font-normal">
                    Lex Fridman
                  </p>
                  <p className="text-primary text-white font-normal">Editor</p>
                </div>
                <Image src={editIcon} width={22} height={22} alt="edit" />
              </div>
              <hr className="w-full border-[1px] border-gray-7" />
            </div>
            <div className="w-full flex justify-end">
              <button className="bg-red-primary px-[30px] py-[15px] w-fit rounded-[29px] my-[10px] flex items-center">
                <Image src={plusIcon} width={20} height={20} alt="plus" className="mr-[20px]"/>
                <p className="text-small text-white">Add Team Member</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
