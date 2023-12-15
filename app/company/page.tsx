"use client";

import Header from "@/components/header";
import { useEffect, useState } from "react";
import Image from "next/image";

import { child, get, getDatabase, ref, set } from "firebase/database";
import { getDownloadURL } from "firebase/storage";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import firebase_app from "../../config";
import profileImg from "../../public/images/profile.png";

import editIcon from "../../public/icons/EditIcon.png";
import closeIcon from "../../public/icons/CloseXIcon.png";
import updateIcon from "../../public/icons/UpdateIcon.png";
import defaultUser from "../../public/icons/User.png";
import { getAuth } from "firebase/auth";
import { getFirestore, onSnapshot } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

import React, { useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getStorage, uploadBytes, ref as ref_storage } from "firebase/storage";

const auth = getAuth();
const functions = getFunctions();

const database = getDatabase(firebase_app);
const storage = getStorage(firebase_app);

import trashIcon from "../../public/icons/TrashIcon.png";
import companyIcon from "../../public/icons/CompanyIcon.png";
import ReSideBar from "@/components/residebar";
import ReHeader from "@/components/reheader";
import { useGlobalContext } from "@/contexts/state";
import SideBar from "@/components/sidebar";

const cUpdateCompanyInfo = httpsCallable(functions, "updateCompanyInfo");
const cRemoveCompanyLogo = httpsCallable(functions, "removeCompanyIcon");
const cUpdateCompanyIcon = httpsCallable(functions, "updateCompanyIcon");

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

  const [resImg, setResImage] = useState("");
  const [userID, setUserID] = useState("");
  const [companyId, setCompanyId] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [isTrial, setIsTrial] = useState(null);

  const cropperRef = useRef<ReactCropperElement>(null);
  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    setResImage(cropper.getCroppedCanvas().toDataURL());
  };

  const { user, setUser, profile, setProfile, project, setProject, company, setCompany, updateContext } = useGlobalContext();

  useEffect(() => {

    setCompanyId(user.CompanyKey);

    setUserID(user.uid);
    setLogoURL(company.CompanyIconURL);
    setCompanyName(company.CompanyName);
    setCompanyRegion(company.CompanyRegions);
    setCompanyBio(company.CompanyDescription);

    console.log(company);

    if (company.SubscriptionPlan != "Trial") {
      setIsAdmin(Object.keys(company.Admins).includes(user.uid));
      console.log(Object.keys(company.Admins).includes(user.uid));
    } else {
      setIsAdmin(false);
    }

    if (company.SubscriptionPlan == "Trial") {
      setIsTrial(true);
    } else {
      setIsTrial(false);
    }

  })

  const removeImage = () => {
    setIsRemoveImageModal(true);
  };

  const handleRemoveLogo = () => {
    cRemoveCompanyLogo()
      .then((result) => {
        updateContext();
        toast.success(result.data.message);
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
    setIsLoading(true);
    cUpdateCompanyInfo({
      CompanyName: reCompanyName,
      CompanyDescription: reCompanyBio,
      CompanyRegions: reCompanyRegion,
    })
      .then((result) => {
        updateContext();
        toast.success(result.data.message);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsEditCompanyModal(false);
        setIsLoading(false);
      });
  };

  const [imageData, setImageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);

  const uploadImageURLToDB = (file: any) => {
    setIsLoading(true);
    const pfpImagePath = `temp/${companyId}.jpeg`;

    const storageRef = ref_storage(storage, pfpImagePath);
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        getDownloadURL(storageRef)
          .then((url) => {
            cUpdateCompanyIcon()
              .then((result) => {
                updateContext();
                toast.success(result.data.message);
                setIsLoading(false);
              })
              .catch((error) => {
                console.log(error);
                setIsLoading(false);
              })
              .finally(() => {
                setIsShowCropImageModal(false);
              });
          })
          .catch((error) => {
            setIsLoading(false);
          });
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const base64toFile = (base64Data: any, filename: any) => {
    const byteCharacters = atob(base64Data.substring(22));
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const chunk = byteCharacters.slice(offset, offset + 1024);

      const byteNumbers = new Array(chunk.length);
      for (let i = 0; i < chunk.length; i++) {
        byteNumbers[i] = chunk.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: "image/jpeg" });
    const file = new File([blob], filename, {
      type: "image/jpeg",
    });
    return file;
  };

  const handleUpdateImage = () => {
    uploadImageURLToDB(base64toFile(resImg, "profile.png"));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file != undefined && file != null) {
      reader.onload = (event) => {
        setImageData(event.target.result);
        setIsShowCropImageModal(true);
      };

      reader.readAsDataURL(file);
    }
  };

  const updateImage = () => {
    fileInputRef.current.click();
  };

  const [isSide, setIsSide] = useState(false);

  return (
    <div className="flex">
      <SideBar index={0} />
      {isSide && <ReSideBar index={-1} hide={setIsSide} />}
      {!isSide && (
        <div className="absolute lg:left-[320px] lg:w-panel w-[100vw] min-h-[100vh] h-fit bg-gray-4">
          <ReHeader title={"My Company"} index={0} show={setIsSide} />
          <Header title={"My Company"} />

          {isTrial == false ? (
            <>
              <div className="m-[40px] ml-[52px]">
                <p className="m-[20px] text-gray-10 font-bold">Company Logo</p>

                <div className="flex flex-wrap justify-center sm:justify-start items-end">
                  <div
                    className={
                      "ml-[39px] w-[350px] h-[120px] rounded-[23px] text-white flex justify-center items-center" +
                      (logoURL == "" || logoURL == undefined
                        ? " bg-red-primary"
                        : "")
                    }
                  >
                    <Image
                      width={logoURL == "" ? 400 : 120}
                      height={120}
                      src={
                        logoURL == "" || logoURL == undefined
                          ? companyIcon
                          : logoURL
                      }
                      alt={""}
                      className={
                        logoURL == "" || logoURL == undefined
                          ? "w-[120px]"
                          : "w-[350px]" + " h-[120px]"
                      }
                    />
                    {(logoURL == undefined || logoURL == "") && (
                      <p className="text-small font-bold text-white">
                        Company Logo
                      </p>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </div>
                  {isAdmin && (
                    <div className="flex sm:flex-col flex-row justify-between sm:h-[120px] my-[20px] sm:my-0">
                      <button
                        className="ml-[24px] mr-0 h-fit bg-gray-5 rounded-[24px] px-[16px] py-[12px] text-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white flex items-center"
                        onClick={updateImage}
                      >
                        <Image
                          src={updateIcon}
                          width={25}
                          height={25}
                          alt="close"
                        />
                        <p className="ml-[10px] font-bold">Update</p>
                      </button>
                      <button
                        className="ml-[24px] mr-0 h-fit bg-red-primary rounded-[24px] px-[16px] py-[12px] text-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white flex items-center"
                        onClick={removeImage}
                      >
                        <Image
                          src={trashIcon}
                          width={25}
                          height={25}
                          alt="close"
                        />
                        <p className="ml-[10px] font-bold">Remove</p>
                      </button>
                    </div>
                  )}
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
                  <p className="text-gray-10 text-small font-bold">
                    Company Name
                  </p>
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
                  <p className="text-gray-10 text-small font-bold">
                    Company Regions
                  </p>
                  <p className="text-white text-small font-bold ml-[12px]">
                    {companyRegion}
                  </p>
                </div>

                {isAdmin && (
                  <button
                    className="h-fit bg-gray-5 rounded-[24px] px-[16px] py-[12px] text-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white flex items-center"
                    onClick={updateCompanyDetail}
                  >
                    <Image src={editIcon} width={25} height={25} alt="edit" />
                    <p className="ml-[10px] font-bold">Edit Info</p>
                  </button>
                )}
              </div>
            </>
          ) : isTrial == true ? (
            <div className="mt-[20px] mx-[30px] rounded-[24px] max-w-[350px] sm:w-[350px] w-[80%] bg-gray-3 text-white font-bold p-[30px]">This area is reserved for Enterprise customers. Visit Subscriptions for more information about the Enterprise options.</div>
          ): <></>}
        </div>
      )}

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
          id="modal_image"
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
                <Cropper
                  src={imageData}
                  style={{ height: 224, width: 224 }}
                  // Cropper.js options
                  initialAspectRatio={16 / 9}
                  guides={false}
                  crop={onCrop}
                  minCropBoxHeight={100}
                  minCropBoxWidth={100}
                  ref={cropperRef}
                />
                {/* <Image
                  src={profileImg}
                  width={224}
                  height={224}
                  alt="profile image"
                  className="mx-[13px]"
                /> */}
                <Image
                  src={resImg == "" ? profileImg : resImg}
                  width={142}
                  height={142}
                  alt="profile image"
                  className="mx-[13px] w-[142px] max-h-[142px]"
                />
              </div>
              <div className="flex justify-center items-center p-4 md:p-5 mx-[60px]">
                <button
                  disabled={isLoading}
                  type="button"
                  className="rounded-[24px] text-white bg-gray-5 mx-[6px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 w-full"
                  onClick={() => {
                    setIsShowCropImageModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  disabled={isLoading}
                  type="button"
                  className="flex justify-center items-center rounded-[24px] text-white bg-gray-7 mx-[6px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 w-full"
                  onClick={handleUpdateImage}
                >
                  {isLoading && (
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 mr-[10px]"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  )}
                  <p>Save</p>
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
                  disabled={isLoading}
                  type="button"
                  className="rounded-[24px] text-white bg-gray-7-5 mx-[6px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 w-full"
                >
                  Cancel
                </button>
                <button
                  disabled={isLoading}
                  type="button"
                  className="flex justify-center items-center rounded-[24px] text-white bg-red-primary mx-[6px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 w-full"
                  onClick={handleOnUpdateCompanyDetail}
                >
                  {isLoading && (
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 mr-[10px]"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  )}
                  <p>Save</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default CompanyPage;
