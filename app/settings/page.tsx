"use client";

import Header from "@/components/header";
import SideBar from "@/components/sidebar";

import Image from "next/image";

import projectIcon from "../../public/icons/ProjectIcon.png";
import modelIcon from "../../public/icons/ModelIcon.png";
import viewIcon from "../../public/icons/ViewIcon.png";
import supportIcon from "../../public/icons/SupportIcon.png";
import teamIcon from "../../public/icons/TeamIcon.png";
import adminIcon from "../../public/icons/AdminIcon.png";
import brandIcon from "../../public/icons/BrandingIcon.png";

import firebase_app from "../../firebase";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const database = getDatabase(firebase_app);

import { getFunctions, httpsCallable } from "firebase/functions";
import { child, get, getDatabase, ref } from "firebase/database";
import { Checkbox } from "flowbite-react";
import { useEffect, useState } from "react";
import ReHeader from "@/components/reheader";
import ReSideBar from "@/components/residebar";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalContext } from "@/contexts/state";

const functions = getFunctions();
const cUpdateSettings = httpsCallable(functions, "updateSettings");

const SettingsPage = () => {
  const [isEdit, setIsEdit] = useState(false);

  const {
    user,
    setUser,
    profile,
    setProfile,
    project,
    setProject,
    company,
    setCompany,
    updateContext,
  } = useGlobalContext();

  const [isLoading, setIsLoading] = useState(false);

  const [option1, setOption1] = useState(
    profile.Settings ? profile.Settings.subscriptionUpdates : true
  );
  const [option2, setOption2] = useState(
    profile.Settings ? profile.Settings.companyTeamUpdates : true
  );
  const [option3, setOption3] = useState(
    profile.Settings ? profile.Settings.projectUpdates : true
  );
  const [option4, setOption4] = useState(
    profile.Settings ? profile.Settings.promotionUpdates : true
  );

  const [newOption1, setNewOption1] = useState(
    profile.Settings ? profile.Settings.subscriptionUpdates : true
  );
  const [newOption2, setNewOption2] = useState(
    profile.Settings ? profile.Settings.companyTeamUpdates : true
  );
  const [newOption3, setNewOption3] = useState(
    profile.Settings ? profile.Settings.projectUpdates : true
  );
  const [newOption4, setNewOption4] = useState(
    profile.Settings ? profile.Settings.promotionUpdates : true
  );

  useEffect(() => {
    setOption1(profile.Settings ? profile.Settings.subscriptionUpdates : true);
    setOption2(profile.Settings ? profile.Settings.companyTeamUpdates : true);
    setOption3(profile.Settings ? profile.Settings.projectUpdates : true);
    setOption4(profile.Settings ? profile.Settings.promotionUpdates : true);

    setNewOption1(
      profile.Settings ? profile.Settings.subscriptionUpdates : true
    );
    setNewOption2(
      profile.Settings ? profile.Settings.companyTeamUpdates : true
    );
    setNewOption3(profile.Settings ? profile.Settings.projectUpdates : true);
    setNewOption4(profile.Settings ? profile.Settings.promotionUpdates : true);
  }, [profile]);

  const updateSettings = () => {
    setIsLoading(true);
    cUpdateSettings({
      subscriptionUpdates: newOption1,
      companyTeamUpdates: newOption2,
      projectUpdates: newOption3,
      promotionUpdates: newOption4,
    })
      .then((result: any) => {
        updateContext();
        toast.success(result.data.message);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const [isSide, setIsSide] = useState(false);

  return (
    <div className="flex min-h-[100vh] w-auto h-full">
      <SideBar index={5} />
      {isSide && <ReSideBar index={5} hide={setIsSide} />}
      {!isSide && (
        <div className="absolute lg:left-[320px] lg:w-panel w-full min-h-[100vh] h-fit bg-gray-4">
          <Header title={"My Settings"} />
          <ReHeader title={"My Settings"} index={5} show={setIsSide} />
          <div className="m-[32px] flex flex-wrap">
            <div className="w-full sm:w-[460px] flex flex-col justify-start items-center mr-[32px]">
              <div className="w-full rounded-[26px] bg-gray-3 flex flex-col">
                <div className="text-white  text-ssmall flex justify-center p-[14px] mb-[10px] border-b-[2px] border-gray-4 rounded-t-[26px] font-bold">
                  Email Settings
                </div>
                <p className="text-2xsmall text-white text-center mb-[20px]">
                  Receive email notifications for the following
                </p>
                <div className="flex flex-col items-start w-full">
                  <div className="flex items-center mx-[20px] my-[10px]">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        value=""
                        className="w-[30px] h-[30px] color-white bg-gray-5 mx-[10px] rounded-[6px]  focus:ring-0 focus:bg-gray-5 focus:border-none focus:outline-none active:bg-gray-5 ring-0"
                        checked={newOption1}
                        onClick={(e: any) => {
                          setNewOption1(e.target.checked);
                        }}
                      />
                      <label className="ms-2 text-sm font-medium text-gray-400 dark:text-gray-500">
                        Updates to your subscription
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center mx-[20px] my-[10px]">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        value=""
                        className="w-[30px] h-[30px] color-white bg-gray-5 mx-[10px] rounded-[6px]  focus:ring-0 focus:bg-gray-5 focus:border-none focus:outline-none active:bg-gray-5 ring-0"
                        checked={newOption2}
                        onClick={(e: any) => {
                          setNewOption2(e.target.checked);
                        }}
                      />
                      <label className="ms-2 text-sm font-medium text-gray-400 dark:text-gray-500">
                        Updates to your company Team
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center mx-[20px] my-[10px]">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        value=""
                        className="w-[30px] h-[30px] color-white bg-gray-5 mx-[10px] rounded-[6px]  focus:ring-0 focus:bg-gray-5 focus:border-none focus:outline-none active:bg-gray-5 ring-0"
                        checked={newOption3}
                        onClick={(e: any) => {
                          setNewOption3(e.target.checked);
                        }}
                      />
                      <label className="ms-2 text-sm font-medium text-gray-400 dark:text-gray-500">
                        Updates to your projects
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center mx-[20px] my-[10px]">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        value=""
                        className="w-[30px] h-[30px] color-white bg-gray-5 mx-[10px] rounded-[6px]  focus:ring-0 focus:bg-gray-5 focus:border-none focus:outline-none active:bg-gray-5 ring-0"
                        checked={newOption4}
                        onClick={(e: any) => {
                          setNewOption4(e.target.checked);
                        }}
                      />
                      <label className="ms-2 text-sm font-medium text-gray-400 dark:text-gray-500">
                        Promotional emails
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    disabled={
                      !(
                        option1 != newOption1 ||
                        option2 != newOption2 ||
                        option3 != newOption3 ||
                        option4 != newOption4
                      )
                    }
                    className={
                      "flex items-center justify-center rounded-[33px] px-[90px] py-[10px] my-[20px] text-white text-medium shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 " +
                      (option1 != newOption1 ||
                      option2 != newOption2 ||
                      option3 != newOption3 ||
                      option4 != newOption4
                        ? "bg-gray-5"
                        : "bg-gray-4")
                    }
                    onClick={() => {
                      updateSettings();
                    }}
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
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default SettingsPage;
