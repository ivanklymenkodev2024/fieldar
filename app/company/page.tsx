"use client";

import React, { useRef } from "react";
import { useEffect, useState } from "react";

import Image from "next/image";

import profileImg from "../../public/images/profile.png";
import editIcon from "../../public/icons/EditIcon.png";
import closeIcon from "../../public/icons/CloseXIcon.png";
import updateIcon from "../../public/icons/UpdateIcon.png";
import trashIcon from "../../public/icons/TrashIcon.png";
import companyIcon from "../../public/icons/CompanyIcon.png";

import firebase_app from "../../firebase";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore, onSnapshot } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

import { getStorage, uploadBytes, ref as ref_storage } from "firebase/storage";

const auth = getAuth();
const functions = getFunctions();
const database = getDatabase(firebase_app);
const storage = getStorage(firebase_app);

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useGlobalContext } from "@/contexts/state";

import Header from "@/components/headers/header";
import ReHeader from "@/components/headers/reheader";
import SideBar from "@/components/sidebars/sidebar";
import ReSideBar from "@/components/sidebars/residebar";
import ConfirmModal from "@/components/modals/confirmModal";
import ImageCropModal from "@/components/modals/imageCrop";
import EditCompanyModal from "@/components/modals/editCompany";

const cUpdateCompanyInfo = httpsCallable(functions, "updateCompanyInfo");
const cRemoveCompanyIcon = httpsCallable(functions, "removeCompanyIcon");
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

  // const [resImg, setResImage] = useState("");
  const [userID, setUserID] = useState("");
  const [companyId, setCompanyId] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [isTrial, setIsTrial] = useState(true);

  const { isMaster, inputUserId, user, profile, company, updateContext } =
    useGlobalContext();

  useEffect(() => {
    setCompanyId(profile.CompanyKey);

    setUserID(isMaster ? inputUserId : user.uid);
    setLogoURL(company.CompanyIconURL);
    setCompanyName(company.CompanyName);
    setCompanyRegion(company.CompanyRegions);
    setCompanyBio(company.CompanyDescription);

    if (company.SubscriptionPlan != "Trial") {
      setIsAdmin(
        Object.keys(company.Admins).includes(isMaster ? inputUserId : user.uid)
      );
    } else {
      setIsAdmin(false);
    }

    if (company.SubscriptionPlan == "Trial") {
      setIsTrial(true);
    } else {
      setIsTrial(false);
    }
  });

  const removeImage = () => {
    setIsRemoveImageModal(true);
  };

  const handleRemoveLogo = () => {
    let data:any = {};
    if(isMaster) {
      data['inputUserId'] = inputUserId;
    }
    cRemoveCompanyIcon(data)
      .then((result: any) => {
        updateContext();
        toast.success(result.data.message);
      })
      .catch((error) => {
        toast.warning(error.message);
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
    let data: any = {
      CompanyName: reCompanyName,
      CompanyDescription: reCompanyBio,
      CompanyRegions: reCompanyRegion,
    };
    if (isMaster) {
      data["inputUserId"] = inputUserId;
    }
    cUpdateCompanyInfo(data)
      .then((result: any) => {
        updateContext();
        toast.success(result.data.message);
      })
      .catch((error) => {
        toast.warning(error.message);
        console.log(error);
      })
      .finally(() => {
        setIsEditCompanyModal(false);
        setIsLoading(false);
      });
  };

  const [imageData, setImageData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef: any = useRef(null);

  const uploadImageURLToDB = (file: any) => {
    setIsLoading(true);
    const pfpImagePath = `temp/${companyId}.jpeg`;

    const storageRef = ref_storage(storage, pfpImagePath);
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        getDownloadURL(storageRef)
          .then((url) => {
            cUpdateCompanyIcon()
              .then((result: any) => {
                updateContext();
                toast.success(result.data.message);
                setIsLoading(false);
              })
              .catch((error) => {
                toast.warning(error.message)
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

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file != undefined && file != null) {
      reader.onload = (event: any) => {
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
            <div className="mt-[20px] mx-[30px] rounded-[24px] max-w-[350px] sm:w-[350px] w-[80%] bg-gray-3 text-white font-bold p-[30px]">
              This area is reserved for Enterprise customers. Visit
              Subscriptions for more information about the Enterprise options.
            </div>
          ) : (
            <></>
          )}
        </div>
      )}

      <ConfirmModal
        isShow={isRemoveImageModal}
        isLoading={isLoading}
        title={"Remove Company Logo"}
        content={"Are you sure you wish to remove company logo?"}
        handleCancel={() => {
          setIsRemoveImageModal(false);
        }}
        handleSubmit={handleRemoveLogo}
        hide={() => {
          if (isLoading) return;
          setIsRemoveImageModal(false);
        }}
      />

      <ImageCropModal
        isShow={isShowCropImageModal}
        isLoading={isLoading}
        title={"Crop Picture"}
        uploadImageURLToDB={uploadImageURLToDB}
        imageData={imageData}
        hide={() => {
          if (isLoading) return;
          setIsShowCropImageModal(false);
        }}
      />

      <EditCompanyModal
        isShow={isEditCompanyModal}
        isLoading={isLoading}
        reCompanyBio={reCompanyBio}
        handleReCompanyBioChange={handleReCompanyBioChange}
        handleReCompanyRegionChange={handleReCompanyRegionChange}
        handleReCompanyNameChange={handleReCompanyNameChange}
        reCompanyName={reCompanyName}
        reCompanyRegion={reCompanyRegion}
        handleOnUpdateCompanyDetail={handleOnUpdateCompanyDetail}
        hide={() => {
          if (isLoading) return;
          setIsEditCompanyModal(false);
        }}
      />
      <ToastContainer />
    </div>
  );
};

export default CompanyPage;
