"use client";

import Header from "@/components/header";
import SideBar from "@/components/sidebar";
import { useState } from "react";

import Image from "next/image";

import closeIcon from "../../public/icons/CloseXIcon.png";
import plusIcon from "../../public/icons/PlusIcon.png";
import projectIcon from "../../public/icons/ProjectIcon.png";
import editIcon from "../../public/icons/EditIcon.png";

import promoteToAdmin from "../../public/icons/AdminIcon.png";
import removeFromCompany from "../../public/icons/RemoveMember-Icon.png";

const TeamPage = () => {
  const [isShowInviteModal, setIsShowInviteModal] = useState(false);
  const [isShowUserDetailModal, setIsShowUserDetailModal] = useState(false);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [isShowUserRoleModal, setIsShowUserRoleModal] = useState(false);

  const promoteToAdminFunc = () => {
    setIsShowUserDetailModal(false);
    setIsShowConfirmModal(true);
  };

  const removeUserFromCompany = () => {
    setIsShowUserDetailModal(false);
    setIsShowConfirmModal(true);
  };

  const updateUserRole = () => {
    setIsShowUserDetailModal(false);
    setIsShowUserRoleModal(true);
  };

  const removeFromProject = () => {
    setIsShowUserRoleModal(false);
    setIsShowConfirmModal(true);
  }

  const updateRole = () => {
    setIsShowUserRoleModal(false);
  }

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
              <p className="font-small text-gray-10 col-span-1 font-light">
                Name
              </p>
              <p className="font-small text-gray-10 col-span-1 font-light">
                Email
              </p>
              <p className="font-small text-gray-10 col-span-1 font-light">
                Assigned Projects
              </p>
            </div>
          </div>

          <div className="max-w-[1024px] flex flex-col bg-gray-3 h-ttable p-[22px] py-[6px] rounded-[24px]">
            <div className="w-full grid grid-cols-3 p-[10px] border-b-[1px] border-gray-4">
              <button
                className="text-white col-span-1 font-light w-fit"
                onClick={() => setIsShowUserDetailModal(true)}
              >
                Kyle Szostek
              </button>
              <p className="text-white col-span-1 font-light">
                kyle.szostek@gmail.com
              </p>
              <p className="text-white col-span-1 font-light">2</p>
            </div>
            <div className="w-full grid grid-cols-3 p-[10px] border-b-[1px] border-gray-4">
              <p className="text-white col-span-1 font-light">Morgan Winter</p>
              <p className="text-white col-span-1 font-light">
                morgan@email.com
              </p>
              <p className="text-white col-span-1 font-light">4</p>
            </div>
            <div className="w-full grid grid-cols-3 p-[10px] border-b-[1px] border-gray-4">
              <p className="text-white col-span-1 font-light">Jim Jones</p>
              <p className="text-white col-span-1 font-light">jim@email.com</p>
              <p className="text-white col-span-1 font-light">6</p>
            </div>
          </div>

          <div className="max-w-[1024px] flex justify-end">
            <button
              className="mt-[16px] h-fit bg-red-primary rounded-[24px] px-[16px] py-[12px] font-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white flex items-center"
              onClick={() => setIsShowInviteModal(true)}
            >
              <Image
                src={plusIcon}
                width={20}
                height={20}
                alt="plus"
                className="mr-[10px]"
              />
              <p className="font-light">Invite New Member</p>
            </button>
          </div>
        </div>
      </div>

      {isShowInviteModal && (
        <div
          id="modal_invite_new_member"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[580px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowInviteModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  Invite New Team Member
                </h3>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowInviteModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="mx-[70px] my-[10px] flex justify-center flex-col items-center">
                <p className="text-primary text-gray-10 text-center mx-[30px]">
                  Invite new team members to join your company, and you can
                  assign them to projects.
                </p>
                <div className="mx-[30px] flex justify-start w-full mt-[60px]">
                  <p className="text-primary text-white text-left ml-[20px] font-semibold">
                    Invite via company email
                  </p>
                </div>
                <input
                  className="text-primary bg-gray-3 text-gray-11 placeholder:italic rounded-[33px] px-[30px] py-[14px] focus:border-none focus:outline-none w-full focus:ring-0 border-none my-[12px]"
                  type="email"
                  placeholder="janedoe@email.com"
                />
                <div className="mx-[30px] flex justify-start w-full mt-[20px]">
                  <p className="text-primary text-white text-left ml-[20px] font-semibold">
                    Set Invite Expiration:
                  </p>
                </div>
                <select className="custom-black-select w-full bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-9 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] m-2 mr-5 outline-none focus:ring-0 appearance-none font-semibold ">
                  <option>7 days</option>
                  <option>5 days</option>
                  <option>1 day</option>
                </select>
              </div>
              <div className="flex justify-center items-center p-4 md:p-5 mt-[30px]">
                <button
                  type="button"
                  className="rounded-[24px] text-white bg-red-primary px-[90px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6"
                >
                  Invite to Company
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isShowUserDetailModal && (
        <div
          id="modal_user_detail"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[800px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowUserDetailModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  Kyle Szostek
                </h3>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowUserDetailModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="mx-[50px] my-[10px] flex justify-start  items-center">
                <Image
                  src={projectIcon}
                  width={25}
                  height={25}
                  alt="[project]"
                  className="opacity-50"
                />
                <p className="text-ssmall text-gray-11 font-normal mx-[10px]">
                  Assigned Projects
                </p>
              </div>
              <div className="mx-[30px] my-[10px] flex flex-col items-start bg-gray-3 rounded-[33px] h-[360px]">
                <div className="flex justify-between items-center w-full px-[30px]">
                  <div className="flex justify-between grow">
                    <p className="rounded-t-[33px] my-[20px] text-primary font-normal text-white">
                      South Hampton Library
                    </p>
                    <p className="rounded-t-[33px] mx-[30px] my-[20px] text-primary font-normal text-white">
                      Manager
                    </p>
                  </div>
                  <button onClick={updateUserRole}>
                    <Image
                      src={editIcon}
                      width={25}
                      height={25}
                      alt="edit"
                      className="mx-[30px]"
                    />
                  </button>
                </div>
                <hr className="border-b-[1px] border-gray-7 w-full" />
                <div className="flex justify-between items-center w-full px-[30px]">
                  <div className="flex justify-between grow">
                    <p className="rounded-t-[33px] my-[20px] text-primary font-normal text-white">
                      NASA Headquaters
                    </p>
                    <p className="rounded-t-[33px] mx-[30px] my-[20px] text-primary font-normal text-white">
                      Editor
                    </p>
                  </div>
                  <Image
                    src={editIcon}
                    width={25}
                    height={25}
                    alt="edit"
                    className="mx-[30px]"
                  />
                </div>
                <hr className="border-b-[1px] border-gray-7 w-full" />
              </div>
              <div className="mx-[30px] my-[20px] flex flex-col justify-start items-center bg-gray-3 rounded-[33px] h-[180px]">
                <p className="text-ssmall text-gray-11 text-center my-[30px]">
                  Sensitive Features
                </p>
                <div className="flex justify-around">
                  <button
                    className="mx-[24px] mt-[10px] h-fit bg-gray-5 rounded-[24px] px-[16px] py-[12px] font-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white flex items-center"
                    onClick={promoteToAdminFunc}
                  >
                    <Image
                      src={promoteToAdmin}
                      width={25}
                      height={25}
                      alt="promote to admin"
                    />
                    <p className="ml-[10px] font-bold">Promote To Admin</p>
                  </button>

                  <button
                    className="mx-[24px] mt-[10px] h-fit bg-red-primary rounded-[24px] px-[16px] py-[12px] font-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white flex items-center"
                    onClick={removeUserFromCompany}
                  >
                    <Image
                      src={removeFromCompany}
                      width={25}
                      height={25}
                      alt="remove from company"
                    />
                    <p className="ml-[10px] font-bold">Remove from company</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isShowConfirmModal && (
        <div
          id="modal_confirm"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[490px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowConfirmModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  [Action]
                </h3>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowConfirmModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="my-[30px] flex justify-center items-end">
                <p className="text-small text-white font-semibold">
                  Are you sure you wish to [do this action]?
                </p>
              </div>
              <div className="flex justify-center items-center p-4 md:p-5 mx-[60px]">
                <button
                  type="button"
                  className="rounded-[24px] text-white bg-gray-7-5 mx-[6px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 w-full"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-[24px] text-white bg-red-primary mx-[6px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 w-full"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isShowUserRoleModal && (
        <div
          id="modal_user_role"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[580px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowUserRoleModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  Edit Project Role for Kyle
                </h3>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowUserRoleModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="mx-[50px] my-[10px] flex justify-start items-center">
                <p className="text-primary text-gray-10">Team member:</p>
                <p className="text-primary text-white mx-[10px]">
                  Kyle Szostek
                </p>
              </div>
              <div className="mx-[50px] my-[10px] flex justify-start items-center">
                <p className="text-primary text-gray-10">Assigned Project:</p>
                <p className="text-primary text-white mx-[10px]">
                  South Hampton Library
                </p>
              </div>
              <div className="mx-[50px] my-[10px] flex justify-start items-center">
                <p className="text-primary text-gray-10">
                  Current Member Role:
                </p>
                <p className="text-primary text-white mx-[10px]">Manager</p>
              </div>
              <div className="flex flex-col items-center mt-[50px]">
                <p className="text-gray-10 text-primary font-normal">Change Member Role</p>
                <select className="custom-select bg-gray-5 border-gray-5 focus:border-gray-5 text-white placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] my-[10px] outline-none focus:ring-0 appearance-none font-semibold w-[300px]">
                  <option>Manager</option>
                  <option>Editor</option>
                  <option>Guest</option>
                </select>

                <button className="py-[14px] text-primary text-white bg-red-primary my-[10px] rounded-[33px] w-[300px]" onClick={updateRole}>Update Role</button>
              </div>

              <hr className="border-gray-10 border-b-[1px] my-[30px]" />

              <div className="flex justify-center items-center p-4 md:p-5">
                <button
                  type="button"
                  className="rounded-[24px] text-white bg-gray-8-5 px-[90px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6"
                  onClick={removeFromProject}
                >
                  Remove from Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage;
