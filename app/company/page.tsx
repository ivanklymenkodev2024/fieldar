"use client";

import Header from "@/components/header";
import SideBar from "@/components/sidebar";

import Image from "next/image";

import profileImg from "../../public/images/profile.png";

import editIcon from "../../public/icons/EditIcon.png";
import closeIcon from "../../public/icons/CloseXIcon.png";
import updateIcon from "../../public/icons/UpdateIcon.png";
import trashIcon from "../../public/icons/TrashIcon.png";
import { useState } from "react";

const CompanyPage = () => {
  const [isShowCropImageModal, setIsShowCropImageModal] = useState(false);
  const [isRemoveImageModal, setIsRemoveImageModal] = useState(false);
  const [isEditCompanyModal, setIsEditCompanyModal] = useState(false);

  const updateImage = () => {
    setIsShowCropImageModal(true);
  };

  const removeImage = () => {
    setIsRemoveImageModal(true);
  };

  const updateCompanyDetail = () => {
    setIsEditCompanyModal(true);
  };

  return (
    <div className="flex">
      <SideBar index={0} />
      <div className="absolute left-[320px] w-panel h-[100vh] bg-gray-4">
        <Header title={"My Profile"} />

        <div className="m-[40px] ml-[52px]">
          <p className="m-[20px] text-gray-10 font-bold">Company Logo</p>

          <div className="flex flex-wrap items-end">
            <div className="ml-[40px] w-[350px] h-[120px] rounded-[23px] bg-red-primary text-white flex justify-center items-center">
              Company logo
            </div>
            <div className="flex flex-col justify-between h-[120px]">
              <button
                className="mx-[24px] h-fit bg-gray-5 rounded-[24px] px-[16px] py-[12px] text-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white flex items-center"
                onClick={updateImage}
              >
                <Image src={updateIcon} width={25} height={25} alt="close" />
                <p className="ml-[10px] font-bold">Update</p>
              </button>
              <button
                className="mx-[24px] h-fit bg-red-primary rounded-[24px] px-[16px] py-[12px] text-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white flex items-center"
                onClick={removeImage}
              >
                <Image src={trashIcon} width={25} height={25} alt="close" />
                <p className="ml-[10px] font-bold">Remove</p>
              </button>
            </div>
          </div>
          <div className="ml-[40px] mt-[5px]">
            <p className="text-2xsmall font-bold text-gray-10">
              Recommended size: 500x150px
            </p>
            <p className="text-2xsmall font-bold text-gray-10">
              Required format: .jpg, .jpeg
            </p>
          </div>
        </div>

        <hr className="m-[40px] ml-[72px] h-[2px] bg-gray-10 max-w-[1072px]" />

        <div className="m-[40px] ml-[62px]">
          <div className="my-[25px]">
            <p className="text-gray-10 text-small font-bold">Company Name</p>
            <p className="text-white text-small font-bold ml-[12px]">
              Simulation Lab, LLC.
            </p>
          </div>
          <div className="my-[25px]">
            <p className="text-gray-10 text-small font-bold">
              Company Bio / Tag-Line
            </p>
            <p className="text-white text-small font-bold ml-[12px] max-w-[850px]">
              Simulation Lab is a company in Brooklyn, NY that specializes in
              AR/VR app development, and there's more to be said but this is
              just some default placeholder text so yeah..
            </p>
          </div>
          <div className="my-[25px]">
            <p className="text-gray-10 text-small font-bold">Company Regions</p>
            <p className="text-white text-small font-bold ml-[12px]">
              NYRO, NERO, SERO, WRO, NWRO
            </p>
          </div>

          <button
            className="h-fit bg-gray-5 rounded-[24px] px-[16px] py-[12px] text-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white flex items-center"
            onClick={updateCompanyDetail}
          >
            <Image src={editIcon} width={25} height={25} alt="edit" />
            <p className="ml-[10px] font-bold">Edit Info</p>
          </button>
        </div>
      </div>

      {isRemoveImageModal && (
        <div
          id="modal_remove_image"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[490px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsRemoveImageModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  [Action]
                </h3>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsRemoveImageModal(false)}
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
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isShowCropImageModal && (
        <div
          id="modal_crop_image"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[490px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowCropImageModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  Crop Picture
                </h3>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowCropImageModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="mx-[50px] my-[30px] flex justify-center items-end">
                <Image
                  src={profileImg}
                  width={224}
                  height={224}
                  alt="profile image"
                  className="mx-[13px]"
                />
                <Image
                  src={profileImg}
                  width={142}
                  height={142}
                  alt="profile image"
                  className="mx-[13px]"
                />
              </div>
              <div className="flex justify-center items-center p-4 md:p-5 mx-[60px]">
                <button
                  type="button"
                  className="rounded-[24px] text-white bg-gray-5 mx-[6px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 w-full"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-[24px] text-white bg-gray-7 mx-[6px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 w-full"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditCompanyModal && (
        <div
          id="modal_edit_company"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[620px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsEditCompanyModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  Edit Company Details
                </h3>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsEditCompanyModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="mx-[70px] my-[30px] flex flex-col justify-center">
                <div className="w-full my-[10px]">
                  <p className="ml-[25px] my-[10px] text-primary text-white font-semibold">
                    Company Name
                  </p>
                  <input
                    className="bg-gray-3 px-[25px] py-[14px] w-full rounded-[33px] text-gray-10-5 ring-0 focus:outline-none focus:border-none"
                    value={"Simulation Lab, LLC"}
                  />
                </div>

                <div className="w-full my-[10px]">
                  <p className="ml-[25px] my-[10px] text-primary text-white font-semibold">
                    Company Bio/Tagline
                  </p>
                  <textarea
                    className="bg-gray-3 px-[25px] py-[14px] w-full rounded-[17px] text-gray-10-5 ring-0 focus:outline-none focus:border-none focus:ring-0 border-0"
                    rows={4}
                    value={
                      "Simulation Lab is a company in Brooklyn, NY that specializes in AR/VR app development, and there's more to be said but this is just some default placeholder text so yeah.."
                    }
                  />
                </div>

                <div className="w-full my-[10px]">
                  <p className="ml-[25px] my-[10px] text-primary text-white font-semibold">
                    Company Regions
                  </p>
                  <textarea
                    className="bg-gray-3 px-[25px] py-[14px] w-full rounded-[17px] text-gray-10-5 ring-0 focus:outline-none focus:border-none focus:ring-0 border-0"
                    rows={3}
                    value={"NYRO, NERO, SERO, WRO, NWRO"}
                  />
                </div>
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
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyPage;
