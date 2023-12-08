"use client";

import Header from "@/components/header";
import SideBar from "@/components/sidebar";

import Image from "next/image";

import profileImg from "../../public/images/profile.png";

import editIcon from "../../public/icons/EditIcon.png";
import closeIcon from "../../public/icons/CloseXIcon.png";
import updateIcon from "../../public/icons/UpdateIcon.png";
import trashIcon from "../../public/icons/TrashIcon.png";
import companyIcon from "../../public/icons/CompanyIcon.png";
import { useState } from "react";
import { child, get, getDatabase, ref } from "firebase/database";
import { getAuth } from "firebase/auth";

import firebase_app from "../../config";

const auth = getAuth();
const database = getDatabase(firebase_app);

import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const cUpdateCompanyInfo = httpsCallable(functions, "updateCompanyInfo");
const cRemoveCompanyLogo = httpsCallable(functions, "removeCompanyIcon");

const CompanyPage = () => {
  const [isShowCropImageModal, setIsShowCropImageModal] = useState(false);
  const [isRemoveImageModal, setIsRemoveImageModal] = useState(false);
  const [isEditCompanyModal, setIsEditCompanyModal] = useState(false);

  const [logoURL, setLogoURL] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyBio, setCompanyBio] = useState("");
  const [companyRegion, setCompanyRegion] = useState("");

  const [reCompanyName, setReCompanyName] = useState("");
  const [reCompanyBio, setReCompanyBio] = useState("");
  const [reCompanyRegion, setReCompanyRegion] = useState("");

  const getCompany = async (companyKey: string) => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `companies/${companyKey}`))
      .then((snapshot: any) => {
        if (snapshot.exists()) {
          setLogoURL(snapshot.val().CompanyIconURL);
          setCompanyName(snapshot.val().CompanyName);
          setCompanyRegion(snapshot.val().CompanyRegions);
          setCompanyBio(snapshot.val().CompanyDescription);
        } else {
          console.log("No data available");
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  auth.onAuthStateChanged(function (user: any) {
    if (user != null) {
      const uid = user.uid;

      const dbRef = ref(getDatabase());
      get(child(dbRef, `users/${uid}`))
        .then((snapshot: any) => {
          if (snapshot.exists()) {
            getCompany(snapshot.val().CompanyKey);
          } else {
            console.log("No data available");
          }
        })
        .catch((error: any) => {
          console.error(error);
        });
    } else {
      console.log(null);
    }
  });

  const updateImage = () => {
    setIsShowCropImageModal(true);
  };

  const removeImage = () => {
    setIsRemoveImageModal(true);
  };

  const handleRemoveLogo = () => {
    cRemoveCompanyLogo()
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsRemoveImageModal(false);
      });
  };

  const updateCompanyDetail = () => {
    setReCompanyName(companyName);
    setReCompanyBio(companyBio);
    setReCompanyRegion(companyRegion);
    setIsEditCompanyModal(true);
  };

  const handleReCompanyBioChange = (e: any) => {
    setReCompanyBio(e.target.value);
  };

  const handleReCompanyNameChange = (e: any) => {
    setReCompanyName(e.target.value);
  };

  const handleReCompanyRegionChange = (e: any) => {
    setReCompanyRegion(e.target.value);
  };

  const handleOnUpdateCompanyDetail = () => {
    cUpdateCompanyInfo({
      CompanyName: reCompanyName,
      CompanyDescription: reCompanyBio,
      CompanyRegions: reCompanyRegion,
    })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsEditCompanyModal(false);
      });
  };

  return (
    <div className="flex">
      <SideBar index={0} />
      <div className="absolute left-[320px] w-panel h-[100vh] bg-gray-4">
        <Header title={"My Profile"} />

        <div className="m-[40px] ml-[52px]">
          <p className="m-[20px] text-gray-10 font-bold">Company Logo</p>

          <div className="flex flex-wrap items-end">
            <div className="ml-[40px] w-[350px] h-[120px] rounded-[23px] text-white flex justify-center items-center">
              <Image
                width={120}
                height={120}
                src={
                  logoURL == "" || logoURL == undefined ? companyIcon : logoURL
                }
                alt={""}
                className="w-[120px] h-[120px]"
              />
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
              {companyName}
            </p>
          </div>
          <div className="my-[25px]">
            <p className="text-gray-10 text-small font-bold">
              Company Bio / Tag-Line
            </p>
            <p className="text-white text-small font-bold ml-[12px] max-w-[850px]">
              {companyBio}
            </p>
          </div>
          <div className="my-[25px]">
            <p className="text-gray-10 text-small font-bold">Company Regions</p>
            <p className="text-white text-small font-bold ml-[12px]">
              {companyRegion}
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
                  Remove Company Logo
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
                  Are you sure you wish to remove company logo?
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
                  onClick={handleRemoveLogo}
                >
                  Remove
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
                    value={reCompanyName}
                    onChange={handleReCompanyNameChange}
                  />
                </div>

                <div className="w-full my-[10px]">
                  <p className="ml-[25px] my-[10px] text-primary text-white font-semibold">
                    Company Bio/Tagline
                  </p>
                  <textarea
                    className="bg-gray-3 px-[25px] py-[14px] w-full rounded-[17px] text-gray-10-5 ring-0 focus:outline-none focus:border-none focus:ring-0 border-0"
                    rows={4}
                    value={reCompanyBio}
                    onChange={handleReCompanyBioChange}
                  />
                </div>

                <div className="w-full my-[10px]">
                  <p className="ml-[25px] my-[10px] text-primary text-white font-semibold">
                    Company Regions
                  </p>
                  <textarea
                    className="bg-gray-3 px-[25px] py-[14px] w-full rounded-[17px] text-gray-10-5 ring-0 focus:outline-none focus:border-none focus:ring-0 border-0"
                    rows={3}
                    value={reCompanyRegion}
                    onChange={handleReCompanyRegionChange}
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
                  onClick={handleOnUpdateCompanyDetail}
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
