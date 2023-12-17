import Image from "next/image";

import logoImage from "../../public/images/logo.png";
import profilePic from "../../public/images/profile.png";
import { SidebarProps } from "@/configs";

import companyIcon from "../../public/icons/CompanyIcon.png";
import teamIcon from "../../public/icons/TeamIcon.png";
import projectIcon from "../../public/icons/ProjectIcon.png";
import activityIcon from "../../public/icons/Comment.png";
import subscriptionIcon from "../../public/icons/SubscriptionIcon.png";
import settingsIcon from "../../public/icons/SettingsIcon.png";
import logoutIcon from "../../public/icons/LogoutIcon.png";
import closeIcon from "../../public/icons/CloseXIcon.png";

import defaultUser from "../../public/icons/User.png";

import firebase_app from "../../config";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, onSnapshot } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

const auth = getAuth();
const functions = getFunctions();

const database = getDatabase(firebase_app);

import Link from "next/link";
import { child, get, getDatabase, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/contexts/state";

const SideBar: React.FC<SidebarProps> = ({ index }: SidebarProps) => {
  const {
    user,
    setUser,
    profile,
    setProfile,
    project,
    setProject,
    company,
    setCompany,
  } = useGlobalContext();
  const [picUrl, setPicUrl] = useState(profile.PhotoURL);

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);

  const handleLogOut = () => {
    setIsLoading(true);
    signOut(auth).then(() => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("profile");
        localStorage.removeItem("company");
      }
      router.push("/login");
    });
  };

  const logOut = () => {
    setIsShowConfirmModal(true);
  };

  useEffect(() => {
    setPicUrl(profile.PhotoURL);
  });

  return (
    <div
      className={
        "left-0 top-0 fixed min-h-[100vh] h-[100vh] w-sidebar bg-gray-2 hidden lg:block border-none" +
        (isShowConfirmModal ? " z-[299]" : "")
      }
    >
      <div className=" w-full flex flex-col justify-center items-center my-[30px]">
        <Image src={logoImage} width={176} height={46} alt="FieldAR Logo" />

        <div className="border-gray-4 border-[8px] rounded-[50%] bg-red-primary">
          {picUrl == "" || picUrl == undefined}
          <Link href="/profile">
            {picUrl == "" || picUrl == undefined ? (
              <Image
                src={picUrl == "" ? defaultUser : picUrl}
                width={100}
                height={100}
                alt="Profile Image"
                className="rounded-[50%] border-[4px] border-gray-3 shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 w-[100px] h-[100px]"
              />
            ) : (
              <Image
                src={picUrl}
                width={100}
                height={100}
                alt="Profile Image"
                className="rounded-[50%] border-[4px] border-gray-3 shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 w-[100px] h-[100px]"
              />
            )}
          </Link>
        </div>
      </div>

      <div className="flex flex-col h-menu justify-between">
        <div className="flex flex-col">
          <Link href="/subscription">
            <div
              className={
                "flex items-center justify-start h-[72px] w-full " +
                (index == 4 ? "bg-gray-4" : "bg-gray-2")
              }
            >
              <Image
                src={subscriptionIcon}
                width={25}
                height={25}
                alt="subscription"
                className="ml-[75px]"
              />
              <p className="ml-[10px] text-white text-small font-bold">
                Subscription
              </p>
            </div>
          </Link>
          <Link href="/company">
            <div
              className={
                "flex items-center justify-start h-[72px] w-full " +
                (index == 0 ? "bg-gray-4" : "bg-gray-2")
              }
            >
              <Image
                src={companyIcon}
                width={25}
                height={25}
                alt="company"
                className="ml-[75px]"
              />
              <p className="ml-[10px] text-white text-small font-bold">
                Company Details
              </p>
            </div>
          </Link>
          <Link href="/team">
            <div
              className={
                "flex items-center justify-start h-[72px] w-full " +
                (index == 1 ? "bg-gray-4" : "bg-gray-2")
              }
            >
              <Image
                src={teamIcon}
                width={25}
                height={25}
                alt="team"
                className="ml-[75px]"
              />
              <p className="ml-[10px] text-white text-small font-bold">Team Management</p>
            </div>
          </Link>
          <Link href="/project">
            <div
              className={
                "flex items-center justify-start h-[72px] w-full " +
                (index == 2 ? "bg-gray-4" : "bg-gray-2")
              }
            >
              <Image
                src={projectIcon}
                width={25}
                height={25}
                alt="[project]"
                className="ml-[75px]"
              />
              <p className="ml-[10px] text-white text-small font-bold">
                Project Management
              </p>
            </div>
          </Link>
          <Link href="/activity">
            <div
              className={
                "flex items-center justify-start h-[72px] w-full " +
                (index == 3 ? "bg-gray-4" : "bg-gray-2")
              }
            >
              <Image
                src={activityIcon}
                width={25}
                height={25}
                alt="activity"
                className="ml-[75px]"
              />
              <p className="ml-[10px] text-white text-small font-bold">
                Activity
              </p>
            </div>
          </Link>
        </div>

        <div className="flex flex-col">
          <Link href="/settings">
            <div
              className={
                "flex items-center justify-start h-[72px] w-full " +
                (index == 5 ? "bg-gray-4" : "bg-gray-2")
              }
            >
              <Image
                src={settingsIcon}
                width={25}
                height={25}
                alt="settings"
                className="ml-[75px]"
              />
              <p className="ml-[10px] text-white text-small font-bold">
                Settings
              </p>
            </div>
          </Link>
          <button onClick={logOut}>
            <div className="flex items-center justify-start bg-gray-2 h-[72px] w-full">
              <Image
                src={logoutIcon}
                width={25}
                height={25}
                alt="logout"
                className="ml-[75px]"
              />
              <p className="ml-[10px] text-white text-small font-bold">
                Log Out
              </p>
            </div>
          </button>
        </div>
      </div>
      {isShowConfirmModal && (
        <div
          id="modal_confirm"
          className="flex overflow-y-auto overflow-x-hidden z-[300] fixed top-0 right-0 left-0 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[490px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowConfirmModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  Log Out
                </h3>
                <button
                  disabled={isLoading}
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowConfirmModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="my-[30px] flex justify-center items-end">
                <p className="text-small text-white font-semibold text-center mx-[30px]">
                  Are you sure you want to log out of your account?
                </p>
              </div>
              <div className="flex justify-center items-center p-4 md:p-5 mx-[60px]">
                <button
                  disabled={isLoading}
                  type="button"
                  className="rounded-[24px] text-white bg-gray-7-5 mx-[6px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 w-full"
                  onClick={() => {
                    setIsShowConfirmModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  disabled={isLoading}
                  type="button"
                  className="flex justify-center items-center rounded-[24px] text-white bg-red-primary mx-[6px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 w-full"
                  onClick={handleLogOut}
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
                  <p>Log Out</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;
