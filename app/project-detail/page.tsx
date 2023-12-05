"use client";

import Header from "@/components/header";
import SideBar from "@/components/sidebar";
import Link from "next/link";

import Image from "next/image";

import backIcon from "../../public/icons/DropdownArrowIcon.png";
import editIcon from "../../public/icons/EditIcon.png";
import teamIcon from "../../public/icons/TeamIcon.png";
import plusIcon from "../../public/icons/PlusIcon.png";
import closeIcon from "../../public/icons/CloseXIcon.png";
import alertIcon from "../../public/icons/AlertIcon.png";
import { useState } from "react";

const ProjectDetailPage = () => {
  const [isShowNewProjectModal, setIsShowNewProjectModal] = useState(false);
  const [isShowDeleteProjectModal, setIsShowDeleteProjectModal] =
    useState(false);
  const [isShowEditModelModal, setIsShowEditModelModal] = useState(false);
  const [isShowDeleteModelModal, setIsShowDeleteModelModal] = useState(false);
  const [isShowUserRoleModal, setIsShowUserRoleModal] = useState(false);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [isShowAddTeamMemberModal, setIsShowAddTeamMemberModal] =
    useState(false);

  const updateRole = () => {
    setIsShowUserRoleModal(false);
  };

  const editProject = () => {
    setIsShowNewProjectModal(true);
  };

  const deleteModel = () => {
    setIsShowEditModelModal(false);
    setIsShowDeleteModelModal(true);
  };

  const removeFromProject = () => {
    setIsShowUserRoleModal(false);
    setIsShowConfirmModal(true);
  };

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
            <button
              className="h-fit bg-gray-5 rounded-[24px] px-[16px] py-[12px] text-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white flex items-center"
              onClick={editProject}
            >
              <Image src={editIcon} width={25} height={25} alt="edit" />
              <p className="ml-[10px] text-primary font-normal">Edit Details</p>
            </button>
            <button
              className="text-red-primary text-primary font-normal"
              onClick={() => setIsShowDeleteProjectModal(true)}
            >
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
                <button onClick={() => setIsShowEditModelModal(true)}>
                  <Image src={editIcon} width={22} height={22} alt="edit" />
                </button>
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
                <button onClick={() => setIsShowUserRoleModal(true)}>
                  <Image src={editIcon} width={22} height={22} alt="edit" />
                </button>
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
              <button
                className="bg-red-primary px-[30px] py-[15px] w-fit rounded-[29px] my-[10px] flex items-center"
                onClick={() => setIsShowAddTeamMemberModal(true)}
              >
                <Image
                  src={plusIcon}
                  width={20}
                  height={20}
                  alt="plus"
                  className="mr-[20px]"
                />
                <p className="text-small text-white">Add Team Member</p>
              </button>
            </div>
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
                <input
                  className="w-full bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-9 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] m-2 mr-5 outline-none focus:ring-0 appearance-none font-semibold "
                  placeholder="Enter Project Name..."
                />
              </div>

              <div className="mx-[82px] my-[20px]">
                <div className="mx-[30px] flex justify-start w-full mt-[20px]">
                  <p className="text-primary text-white text-left ml-[20px] font-semibold">
                    Project Name
                  </p>
                </div>
                <input
                  className="w-full bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-9 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] m-2 mr-5 outline-none focus:ring-0 appearance-none font-semibold "
                  placeholder="Enter Project Name..."
                />
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
                <div className="rounded-[28px] bg-gray-5 px-[80px] py-[15px] w-fit text-ssmall text-white font-bold">
                  {" "}
                  Create Project
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isShowDeleteProjectModal && (
        <div
          id="modal_delete_project"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[610px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowDeleteProjectModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-start justify-center p-4 md:p-5 ">
                <div className="w-[50px] h-[50px] bg-red">
                  <Image src={alertIcon} width={50} height={50} alt={"alert"} />
                </div>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowDeleteProjectModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="mx-[32px] flex flex-col justify-center ">
                <div className="flex justify-center w-full">
                  <p className="text-white text-center text-ssmall font-semibold">
                    Confirm Delete project
                  </p>
                </div>
                <p className="text-white text-primary text-center">
                  If you are sure you want to delete this project, please type
                  the project title in the field below. This project will be
                  removed for all team members currently assigned to the
                  project, and all currently active models will become
                  dislocated from their respective QR markers on your jobsite.
                  The models files associated to this project will be erased.
                  Please note that this action is irreversible.
                </p>
                <p className="text-white text-primary text-center my-[10px]">
                  Please note that this action is irreversible.
                </p>

                <div className="text-white text-primary text-center my-[10px] flex justify-center mt-[40px]">
                  <p className="text-gray-10">Project Title:</p>{" "}
                  [someProjectlTitle]
                </div>
                <div className="w-full flex justify-center">
                  <input
                    className="bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-9 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] m-2 mr-5 outline-none focus:ring-0 appearance-none font-semibold "
                    placeholder="Type the project title..."
                  />
                </div>
              </div>

              <div className="w-full flex justify-center my-[30px]">
                <div className="rounded-[28px] bg-red-primary px-[40px] py-[15px] w-fit text-ssmall text-white font-bold">
                  Create Project
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isShowDeleteModelModal && (
        <div
          id="modal_delete_model"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[610px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowDeleteModelModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-start justify-center p-4 md:p-5 ">
                <div className="w-[50px] h-[50px] bg-red">
                  <Image src={alertIcon} width={50} height={50} alt={"alert"} />
                </div>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowDeleteModelModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="mx-[32px] flex flex-col justify-center ">
                <div className="flex justify-center w-full">
                  <p className="text-white text-center text-ssmall font-semibold">
                    Confirm Delete Model
                  </p>
                </div>
                <p className="text-white text-primary text-center">
                  If you are sure you want to delete this model, please type the
                  model title in the field below. Please note that this action
                  is irreversible.
                </p>

                <div className="text-white text-primary text-center my-[10px] flex justify-center mt-[40px]">
                  <p className="text-gray-10">Model Title:</p>{" "}
                  [someProjectlTitle]
                </div>
                <div className="w-full flex justify-center">
                  <input
                    className="bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-9 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] m-2 mr-5 outline-none focus:ring-0 appearance-none font-semibold "
                    placeholder="Type the model title..."
                  />
                </div>
              </div>

              <div className="w-full flex justify-center my-[30px]">
                <div className="rounded-[28px] bg-red-primary px-[40px] py-[15px] w-fit text-ssmall text-white font-bold">
                  Delete Model
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isShowEditModelModal && (
        <div
          id="modal_user_role"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[610px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowEditModelModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  Create New Project
                </h3>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowEditModelModal(false)}
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
                <input
                  className="w-full bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-9 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] m-2 mr-5 outline-none focus:ring-0 appearance-none font-semibold "
                  placeholder="Enter Project Name..."
                />
              </div>

              <div className="mx-[82px] my-[20px]">
                <div className="mx-[30px] flex justify-start w-full mt-[20px]">
                  <p className="text-primary text-white text-left ml-[20px] font-semibold">
                    Project Name
                  </p>
                </div>
                <input
                  className="w-full bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-9 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] m-2 mr-5 outline-none focus:ring-0 appearance-none font-semibold "
                  placeholder="Enter Project Name..."
                />
              </div>

              <div className="w-full flex flex-col justify-center items-center my-[30px]">
                <button
                  className="rounded-[28px] px-[80px] py-[15px] w-fit text-primary text-red-primary font-bold"
                  onClick={deleteModel}
                >
                  Delete Model
                </button>
                <button className="rounded-[28px] bg-gray-5 px-[80px] py-[15px] w-fit text-ssmall text-white font-bold">
                  Create Project
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
                <p className="text-gray-10 text-primary font-normal">
                  Change Member Role
                </p>
                <select className="custom-select bg-gray-5 border-gray-5 focus:border-gray-5 text-white placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] my-[10px] outline-none focus:ring-0 appearance-none font-semibold w-[300px]">
                  <option>Manager</option>
                  <option>Editor</option>
                  <option>Guest</option>
                </select>

                <button
                  className="py-[14px] text-primary text-white bg-red-primary my-[10px] rounded-[33px] w-[300px]"
                  onClick={updateRole}
                >
                  Update Role
                </button>
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

      {isShowAddTeamMemberModal && (
        <div
          id="modal_user_role"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[680px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowAddTeamMemberModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  Add a Team Member to this project
                </h3>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowAddTeamMemberModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="w-full flex justify-center">
                <p className="text-gray-10 text-center max-w-[340px]">
                  Add a company team member to this project, and assign their
                  access role below.
                </p>
              </div>

              <div className="w-full flex justify-around items-center px-[70px] mt-[50px] mb-[10px]">
                <p className="text-ssmall text-gray-10">Company Team Members</p>
                <input
                  className="bg-gray-3 text-gray-11 text-2xsmall placeholder:italic rounded-[26px] font-small px-[23px] py-[10px] focus:border-none outline-none "
                  type="text"
                  placeholder="Search Members"
                />
              </div>

              <div className="bg-gray-3 h-[317px] flex flex-col rounded-[24px] mx-[70px]">
                <div className="grid grid-cols-2 rounded-t-[24px] my-[14px] ">
                  <p className="col-span-1 text-primary text-white font-normal ml-[40px] grow">
                    Kyle Szostek
                  </p>
                  <p className="col-span-1 text-primary text-white font-normal ml-[40px] grow">
                    Kyle@email.com
                  </p>
                </div>
                <hr className="border-b-[1px] border-gray-7" />
                <div className="grid grid-cols-2 my-[14px]">
                  <p className="col-span-1 text-primary text-white font-normal ml-[40px] grow">
                    Morgan Smith
                  </p>
                  <p className="col-span-1 text-primary text-white font-normal ml-[40px] grow">
                    John@email.com
                  </p>
                </div>
                <hr className="border-b-[1px] border-gray-7" />
                <div className="grid grid-cols-2 my-[14px]">
                  <p className="col-span-1 text-primary text-white font-normal ml-[40px] grow">
                    Buzz DaDoggie
                  </p>
                  <p className="col-span-1 text-primary text-white font-normal ml-[40px] grow">
                    Buzz@email.com
                  </p>
                </div>
                <hr className="border-b-[1px] border-gray-7" />
                <div className="grid grid-cols-2 my-[14px]">
                  <p className="col-span-1 text-primary text-white font-normal ml-[40px] grow">
                    Buzz DaDoggie
                  </p>
                  <p className="col-span-1 text-primary text-white font-normal ml-[40px] grow">
                    Buzz@email.com
                  </p>
                </div>
                <hr className="border-b-[1px] border-gray-7" />
              </div>

              <div className="flex flex-col items-center mt-[50px]">
                <p className="text-gray-10 text-primary font-normal">
                  Change Access Role
                </p>
                <select className="custom-select bg-gray-5 border-gray-5 focus:border-gray-5 text-white placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] my-[10px] outline-none focus:ring-0 appearance-none font-semibold w-[400px]">
                  <option>Manager</option>
                  <option>Editor</option>
                  <option>Guest</option>
                </select>
              </div>

              <div className="flex justify-center items-center p-4 md:p-5">
                <button
                  type="button"
                  className="rounded-[24px] text-white bg-red-primary px-[90px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6"
                >
                  Add Team Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
