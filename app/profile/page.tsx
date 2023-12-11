"use client";

import Header from "@/components/header";
import SideBar from "@/components/sidebar";
import { useEffect, useState } from "react";
import Image from "next/image";

import { child, get, getDatabase, ref, set } from "firebase/database";
import { getDownloadURL } from "firebase/storage";

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

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReSideBar from "@/components/residebar";
import ReHeader from "@/components/reheader";

const auth = getAuth();
const functions = getFunctions();

const database = getDatabase(firebase_app);
const storage = getStorage(firebase_app);

const cUpdateUsername = httpsCallable(functions, "updateUsername");
const cUpdateEmail = httpsCallable(functions, "updateEmail");
const cChangePassword = httpsCallable(functions, "changePassword");
const cUpdatePhoneNumber = httpsCallable(functions, "updatePhoneNumber");
const cUpdateJobTitle = httpsCallable(functions, "updateJobTitle");
const cUpdateProfilePic = httpsCallable(functions, "updateProfilePic");

const ProfilePage = () => {
  const [resImg, setResImage] = useState("");

  const cropperRef = useRef<ReactCropperElement>(null);
  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    setResImage(cropper.getCroppedCanvas().toDataURL());
  };

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

  auth.onAuthStateChanged(function (user: any) {
    if (user != null) {
      const uid = user.uid;
      setUserID(uid);

      const dbRef = ref(getDatabase());
      get(child(dbRef, `users/${uid}`))
        .then((snapshot: any) => {
          if (snapshot.exists()) {
            setName(snapshot.val().DisplayName);
            setEmail(snapshot.val().Email);
            setJobTitle(snapshot.val().JobTitle);
            setPhone(snapshot.val().PhoneNumber);
            setPicUrl(snapshot.val().PhotoURL);
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

  const [imageData, setImageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const uploadImageURLToDB = (file: any) => {
    setIsLoading(true);
    const pfpImagePath = `profile-pics/${userID}/profile.jpeg`;

    const storageRef = ref_storage(storage, pfpImagePath);
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        getDownloadURL(storageRef)
          .then((url) => {
            cUpdateProfilePic({ profilePicURL: url })
              .then((result) => {
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
    func(data)
      .then((result: any) => {
        toast.success(result.data.message);
        console.log(result.data.message);
      })
      .catch((error: any) => {
        console.log(error);
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

  const handleOldPasswordChange = (e: any) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: any) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: any) => {
    setConfrimPassword(e.target.value);
  };

  const handleSingleModalInputChange = (e: any) => {
    setSingModalInput(e.target.value);
  };

  const handleUpdatePassword = () => {
    if (newPassword != confirmPassword) {
      toast.warning("Passwords are not match");
      return;
    }
    setIsLoading(true);
    cChangePassword({ currentPassword: oldPassword, newPassword })
      .then((result: any) => {
        toast.success(result.data.message);
      })
      .catch((error) => {
        console.log(error);
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
        <div className="fixed lg:left-[320px] lg:w-panel w-[100vw] min-h-[100vh] h-fit bg-gray-4">
          <ReHeader title={"My profile"} index={-1} show={setIsSide} />
          <Header title={"My Profile"} />

          <div className="m-[40px] ml-[52px]">
            <p className="m-[20px] text-gray-10 font-bold">Profile Image</p>

            <div className="flex flex-wrap items-end justify-center xm:justify-start">
              <Image
                src={picURL == "" ? defaultUser : picURL}
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
              <p className="m-[10px] text-gray-10 font-bold w-[90px]">Name: </p>
              <p className="m-[10px] text-white font-bold w-[200px]">{name}</p>
              <button className="w-[20px] h-[20px]" onClick={updateName}>
                <Image src={editIcon} width={20} height={20} alt="Edit Name" />
              </button>
            </div>
            <div className="flex items-center">
              <p className="m-[10px] text-gray-10 font-bold w-[90px]">
                Email:{" "}
              </p>
              <p className="m-[10px] text-white font-bold w-[200px]">{email}</p>
              <button className="w-[20px] h-[20px]" onClick={updateEmail}>
                <Image src={editIcon} width={20} height={20} alt="Edit Email" />
              </button>
            </div>
            <div className="flex items-center">
              <p className="m-[10px] text-gray-10 font-bold w-[90px]">
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
              <p className="m-[10px] text-gray-10 font-bold w-[90px]">
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
              <p className="m-[10px] text-gray-10 font-bold w-[90px]">
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
                  type="button"
                  className="rounded-[24px] text-white bg-gray-5 mx-[6px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 w-full"
                  disabled={isLoading}
                  onClick={() => {
                    setIsShowCropImageModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isLoading}
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

      {isShowSingleModal && (
        <div
          id="modal_single"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[520px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowSingleModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  {singleModalTitle}
                </h3>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowSingleModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="mx-[50px] my-[40px] flex justify-center">
                <input
                  className="bg-gray-3 text-gray-11 placeholder:italic rounded-[33px] px-[30px] py-[16px] focus:border-none focus:outline-none w-full focus:ring-0 border-none"
                  type="text"
                  placeholder={singleModalPlaceholder}
                  value={singleModalInput}
                  onChange={handleSingleModalInputChange}
                />
              </div>
              <div className="flex justify-center items-center p-4 md:p-5">
                <button
                  type="button"
                  className="flex justify-center items-center rounded-[24px] text-white bg-gray-5 px-[90px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6"
                  onClick={updateValue}
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
                  <p>Update</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isShowPasswordModal && (
        <div
          id="modal_password"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[690px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowPasswordModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  Change Password
                </h3>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowPasswordModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="mx-[70px] my-[10px] flex justify-center flex-col">
                <input
                  className="bg-gray-3 text-gray-11 placeholder:italic rounded-[33px] px-[30px] py-[16px] focus:border-none focus:outline-none w-full focus:ring-0 border-none my-[12px]"
                  type="password"
                  placeholder="Current Password..."
                  value={oldPassword}
                  onChange={handleOldPasswordChange}
                />
                <input
                  className="bg-gray-3 text-gray-11 placeholder:italic rounded-[33px] px-[30px] py-[16px] focus:border-none focus:outline-none w-full focus:ring-0 border-none my-[12px]"
                  type="password"
                  placeholder="New Password..."
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                />
                <input
                  className="bg-gray-3 text-gray-11 placeholder:italic rounded-[33px] px-[30px] py-[16px] focus:border-none focus:outline-none w-full focus:ring-0 border-none my-[12px]"
                  type="password"
                  placeholder="Confirm New Password..."
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
              </div>
              <div className="flex justify-center items-center p-4 md:p-5">
                <button
                  type="button"
                  className="flex justify-center items-center rounded-[24px] text-white bg-gray-5 px-[90px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6"
                  onClick={handleUpdatePassword}
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
                  <p>Update</p>
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

export default ProfilePage;
