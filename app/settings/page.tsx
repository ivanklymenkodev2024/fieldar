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

import firebase_app from "../../config";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const database = getDatabase(firebase_app);

import { getFunctions, httpsCallable } from "firebase/functions";
import { child, get, getDatabase, ref } from "firebase/database";
import { Checkbox } from "flowbite-react";
import { useState } from "react";
import ReHeader from "@/components/reheader";
import ReSideBar from "@/components/residebar";

const functions = getFunctions();
const cUpdateSettings = httpsCallable(functions, "updateSettings");

const SettingsPage = () => {
  const [isEdit, setIsEdit] = useState(false);

  const [option1, setOption1] = useState(false);
  const [option2, setOption2] = useState(false);
  const [option3, setOption3] = useState(false);
  const [option4, setOption4] = useState(false);

  const [newOption1, setNewOption1] = useState(false);
  const [newOption2, setNewOption2] = useState(false);
  const [newOption3, setNewOption3] = useState(false);
  const [newOption4, setNewOption4] = useState(false);

  const updateSettings = () => {
    cUpdateSettings({
      subscriptionUpdates: newOption1,
      companyTeamUpdates: newOption2,
      projectUpdates: newOption3,
      promotionUpdates: newOption4,
    })
      .then((result) => {
        setOption1(option1);
        setOption2(option2);
        setOption3(option3);
        setOption4(option4);
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  const getCompany = (companyKey: string) => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `companies/${companyKey}`))
      .then((snapshot: any) => {
        if (snapshot.exists()) {
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

  const [isSide, setIsSide] = useState(false);

  return (
    <div className="flex min-h-[100vh] w-auto h-full">
      <SideBar index={5} />
      {isSide && <ReSideBar index={5} hide={setIsSide} />}
      {!isSide && (
        <div className="lg:left-[320px] lg:w-panel w-full min-h-[100vh] h-fit bg-gray-4">
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
                        checked={isEdit ? newOption1 : option1}
                        onClick={(e) => {
                          if (!isEdit) return;
                          setNewOption1(!newOption1);
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
                        checked={isEdit ? newOption2 : option2}
                        onClick={(e) => {
                          if (!isEdit) return;
                          setNewOption2(!newOption2);
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
                        checked={isEdit ? newOption3 : option3}
                        onClick={(e) => {
                          if (!isEdit) return;
                          setNewOption3(!newOption3);
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
                        checked={isEdit ? newOption4 : option4}
                        onClick={(e) => {
                          if (!isEdit) return;
                          setNewOption4(!newOption4);
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
                    className="bg-gray-5 rounded-[33px] px-[90px] py-[10px] my-[20px] text-white text-medium shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 "
                    onClick={() => {
                      setIsEdit(!isEdit);
                      if (isEdit == false) {
                        updateSettings();
                      } else {
                        setNewOption1(option1);
                        setNewOption2(option2);
                        setNewOption3(option3);
                        setNewOption4(option4);
                      }
                    }}
                  >
                    {isEdit == false ? "Edit" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
