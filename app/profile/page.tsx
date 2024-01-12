"use client";

import React, { useRef } from "react";
import { useEffect, useState } from "react";

import Image from "next/image";

import editIcon from "../../public/icons/EditIcon.png";
import updateIcon from "../../public/icons/UpdateIcon.png";
import defaultUser from "../../public/icons/User.png";

import firebase_app from "../../firebase";
import { auth, functions, database, storage } from "../../firebase";

import { getDatabase } from "firebase/database";
import { getDownloadURL } from "firebase/storage";
import { httpsCallable } from "firebase/functions";
import { uploadBytes, ref as ref_storage } from "firebase/storage";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useGlobalContext } from "@/contexts/state";

import SideBar from "@/components/sidebars/sidebar";
import ReSideBar from "@/components/sidebars/residebar";
import Header from "@/components/headers/header";
import ReHeader from "@/components/headers/reheader";
import SingleInputModal from "@/components/modals/singleInput";
import PasswordInputModal from "@/components/modals/passwordInput";
import ImageCropModal from "@/components/modals/imageCrop";

const cUpdateUsername = httpsCallable(functions, "updateUsername");
const cUpdateEmail = httpsCallable(functions, "updateEmail");
const cChangePassword = httpsCallable(functions, "changePassword");
const cUpdatePhoneNumber = httpsCallable(functions, "updatePhoneNumber");
const cUpdateJobTitle = httpsCallable(functions, "updateJobTitle");
const cUpdateProfilePic = httpsCallable(functions, "updateProfilePic");

const ProfilePage = () => {
  const [imageData, setImageData] = useState<any>(null);

  const [isShowSingleModal, setIsShowSingleModal] = useState(false);
  const [singleModalTitle, setSingleModalTitle] = useState("");
  const [singleModalPlaceholder, setSingleModalPlaceholder] = useState("");
  const [isShowPasswordModal, setIsShowPasswordModal] = useState(false);
  const [isShowCropImageModal, setIsShowCropImageModal] = useState(false);

  const [userID, setUserID] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [picURL, setPicUrl] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfrimPassword] = useState("");

  const [singleModalInput, setSingModalInput] = useState("");

  const { isMaster, user, profile, inputUserId, updateContext } =
    useGlobalContext();

  useEffect(() => {
    setUserID(user.uid);
    setName(profile.DisplayName);
    setEmail(profile.Email);
    setJobTitle(profile.JobTitle);
    setPhone(profile.PhoneNumber);
    setPicUrl(profile.PhotoURL);
    if (typeof window !== "undefined") {
      localStorage.setItem("picUrl", profile.PhotoURL);
    }
  }, [profile]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<any>(null);

  const uploadImageURLToDB = (file: any) => {
    setIsLoading(true);
    const pfpImagePath = `profile-pics/${userID}/profile.jpeg`;

    const storageRef = ref_storage(storage, pfpImagePath);
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        getDownloadURL(storageRef)
          .then((url) => {
            cUpdateProfilePic({ profilePicURL: url })
              .then((result: any) => {
                updateContext();
                toast.success(result.data.message);
              })
              .catch((error) => {
                console.log(error);
                setIsLoading(false);
              })
              .finally(() => {
                setIsLoading(false);
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

  const updateName = () => {
    setIsShowSingleModal(true);
    setSingleModalTitle("Update Username");
    setSingleModalPlaceholder("Username...");
    setSingModalInput(name);
  };

  const updateEmail = () => {
    setIsShowSingleModal(true);
    setSingleModalTitle("Update Email");
    setSingleModalPlaceholder("Email...");
    setSingModalInput(email);
  };

  const updatePhone = () => {
    setIsShowSingleModal(true);
    setSingleModalTitle("Update Phone number");
    setSingleModalPlaceholder("Phone number...");
    setSingModalInput(phone);
  };

  const updateJobTitle = () => {
    setIsShowSingleModal(true);
    setSingleModalTitle("Update Job Title");
    setSingleModalPlaceholder("Job Title...");
    setSingModalInput(jobTitle);
  };

  const updateValue = () => {
    setIsLoading(true);
    let func: any;
    let data: any;
    switch (singleModalTitle) {
      case "Update Username":
        func = cUpdateUsername;
        data = {
          newUsername: singleModalInput,
        };
        break;
      case "Update Email":
        func = cUpdateEmail;
        data = {
          newEmail: singleModalInput,
        };
        break;
      case "Update Phone number":
        func = cUpdatePhoneNumber;
        data = {
          phoneNumber: singleModalInput,
        };
        break;
      case "Update Job Title":
        func = cUpdateJobTitle;
        data = {
          jobTitle: singleModalInput,
        };
        break;
    }
    if (isMaster) {
      data["inputUserId"] = inputUserId;
    }
    func(data)
      .then((result: any) => {
        updateContext();
        toast.success(result.data.message);
        console.log(result.data.message);
      })
      .catch((error: any) => {
        toast.warning(error.message);
      })
      .finally(() => {
        setIsShowSingleModal(false);
        setIsLoading(false);
      });
  };

  const updatePassword = () => {
    setNewPassword("");
    setOldPassword("");
    setConfrimPassword("");
    setIsShowPasswordModal(true);
  };

  const handleUpdatePassword = () => {
    if (newPassword != confirmPassword) {
      toast.warning("Passwords are not match");
      return;
    }
    setIsLoading(true);
    console.log(isMaster, inputUserId);
    let data: any = { currentPassword: oldPassword, newPassword };
    if (isMaster) {
      data["inputUserId"] = inputUserId;
    }
    cChangePassword(data)
      .then((result: any) => {
        updateContext();
        toast.success(result.data.message);
      })
      .catch((error) => {
        toast.warning(error.message);
      })
      .finally(() => {
        setIsShowPasswordModal(false);
        setIsLoading(false);
      });
  };

  const [isSide, setIsSide] = useState(false);

  return (
    <div className="flex">
      <SideBar index={-1} />
      {isSide && <ReSideBar index={-1} hide={setIsSide} />}
      {!isSide && (
        <div className="absolute lg:left-[320px] lg:w-panel w-[100vw] min-h-[100vh] h-fit bg-gray-4">
          <ReHeader title={"My profile"} index={-1} show={setIsSide} />
          <Header title={"My Profile"} />

          <div className="m-[40px] ml-[52px]">
            <p className="m-[20px] text-gray-10 font-bold">Profile Image</p>

            <div className="flex flex-wrap items-end justify-center xm:justify-start">
              <Image
                src={
                  profile.PhotoURL == "" || profile.PhotoURL == undefined
                    ? defaultUser
                    : profile.PhotoURL
                }
                width={175}
                height={175}
                alt="Profile Image"
                className={
                  "rounded-[23px] mx-[40px] xm:w-[180px] w-[80%] " +
                  (picURL == "" ? "bg-red-primary p-[30px]" : "")
                }
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button
                className="mt-[24px] h-fit bg-gray-5 rounded-[24px] px-[16px] py-[12px] font-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white flex items-center"
                onClick={updateImage}
              >
                <Image src={updateIcon} width={25} height={25} alt="close" />
                <p className="ml-[10px] font-bold">Update</p>
              </button>
            </div>
          </div>

          <hr className="m-[40px] ml-[72px] h-[2px] bg-gray-10 max-w-[1072px] hidden lg:block" />

          <div className="m-[40px] ml-[62px]">
            <div className="flex items-center">
              <p className="m-[10px] text-gray-10 font-bold w-[120px]">Name: </p>
              <p className="m-[10px] text-white font-bold w-[200px]">{name}</p>
              <button className="w-[20px] h-[20px]" onClick={updateName}>
                <Image src={editIcon} width={20} height={20} alt="Edit Name" />
              </button>
            </div>
            <div className="flex items-center">
              <p className="m-[10px] text-gray-10 font-bold w-[120px]">
                Email:{" "}
              </p>
              <p className="m-[10px] text-white font-bold w-[200px]">{email}</p>
              <button className="w-[20px] h-[20px]" onClick={updateEmail}>
                <Image src={editIcon} width={20} height={20} alt="Edit Email" />
              </button>
            </div>
            <div className="flex items-center">
              <p className="m-[10px] text-gray-10 font-bold w-[120px]">
                Phone:{" "}
              </p>
              <p className="m-[10px] text-white font-bold w-[200px]">{phone}</p>
              <button className="w-[20px] h-[20px]" onClick={updatePhone}>
                <Image
                  src={editIcon}
                  width={20}
                  height={20}
                  alt="Edit Phone number"
                />
              </button>
            </div>
            <div className="flex items-center">
              <p className="m-[10px] text-gray-10 font-bold w-[120px]">
                Job Title
              </p>
              <p className="m-[10px] text-white font-bold w-[200px]">
                {jobTitle}
              </p>
              <button className="w-[20px] h-[20px]" onClick={updateJobTitle}>
                <Image
                  src={editIcon}
                  width={20}
                  height={20}
                  alt="Edit Job Title"
                />
              </button>
            </div>
            <div className="flex items-center">
              <p className="m-[10px] text-gray-10 font-bold w-[120px]">
                Password:{" "}
              </p>
              <p className="m-[10px] text-white font-bold w-[200px]">
                ***************{" "}
              </p>
              <button className="w-[20px] h-[20px]" onClick={updatePassword}>
                <Image
                  src={editIcon}
                  width={20}
                  height={20}
                  alt="Edit Password"
                />
              </button>
            </div>
            {isMaster && (
              <div className="mt-[40px]">
                <div className="flex items-center">
                  <p className="m-[10px] text-gray-10 font-bold w-[120px]">
                    User ID:{" "}
                  </p>
                  <p className="m-[10px] text-white font-bold w-[200px]">
                    {inputUserId}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="m-[10px] text-gray-10 font-bold w-[120px]">
                    Company ID:{" "}
                  </p>
                  <p className="m-[10px] text-white font-bold w-[200px]">
                    {profile.CompanyKey}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <ImageCropModal
        title={"Crop Picture"}
        isShow={isShowCropImageModal}
        isLoading={isLoading}
        imageData={imageData}
        uploadImageURLToDB={uploadImageURLToDB}
        hide={() => {
          if (isLoading) return;
          setIsShowCropImageModal(false);
        }}
      />

      <SingleInputModal
        isShow={isShowSingleModal}
        isLoading={isLoading}
        title={singleModalTitle}
        inputPlaceholder={singleModalPlaceholder}
        value={singleModalInput}
        setValue={setSingModalInput}
        updateValue={updateValue}
        hide={() => {
          if (isLoading) return;
          setIsShowSingleModal(false);
        }}
      />

      <PasswordInputModal
        isShow={isShowPasswordModal}
        isLoading={isLoading}
        oldPassword={oldPassword}
        setOldPassword={setOldPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfrimPassword}
        updatePassword={handleUpdatePassword}
        hide={() => {
          if (isLoading) return;
          setIsShowPasswordModal(false);
        }}
      />
      <ToastContainer />
    </div>
  );
};

export default ProfilePage;
