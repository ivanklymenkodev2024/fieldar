"use client";

import "../globals.css";

import Header from "@/components/header";
import SideBar from "@/components/sidebar";

import Image from "next/image";

import commentIcon from "../../public/icons/Comment.png";
import editIcon from "../../public/icons/EditIcon.png";
import dropUpIcon from "../../public/icons/DropupArrowIcon.png";
import dropDownIcon from "../../public/icons/DropdownArrowIcon.png";

import { child, get, getDatabase, ref } from "firebase/database";

import firebase_app from "../../config";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const database = getDatabase(firebase_app);

import { getFunctions, httpsCallable } from "firebase/functions";
import { useState } from "react";
import ReHeader from "@/components/reheader";
import ReSideBar from "@/components/residebar";

const functions = getFunctions();

const ActivityPage = () => {
  const [company, setCompany] = useState({});
  const [activityFilter, setActivityFilter] = useState("");

  const getCompany = (companyKey: string) => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `companies/${companyKey}`))
      .then((snapshot: any) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          setCompany(snapshot.val());

          if (activityFilter == "") {
            setActivityFilter(
              snapshot.val().ProjectDirectory[
                Object.keys(snapshot.val().ProjectDirectory)[0]
              ].ProjectTitle
            );
          }
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
      <SideBar index={3} />
      {isSide && <ReSideBar index={2} hide={setIsSide} />}
      {!isSide && (
        <div className="lg:left-[320px] lg:w-panel w-full min-h-[100vh] h-fit bg-gray-4">
          <Header title={"Company Activity"} />
          <ReHeader title={"Company Activity"} index={3} show={setIsSide} />
          <div className="px-[32px] pb-[14px] flex flex-col">
            <div className="max-w-[1024px] flex justify-center sm:justify-end items-end">
              <div className="flex flex-row items-center">
                <p className="ml-10 font-small font-light text-gray-10">
                  Filter by:
                </p>
                <select
                  className="custom-select bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-11 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] w-[260px] m-2 mr-5 outline-none focus:ring-0 appearance-none "
                  value={activityFilter}
                  onChange={(e) => {
                    setActivityFilter(e.target.value);
                  }}
                >
                  {company == null ||
                  company == undefined ||
                  company.ProjectDirectory == null ||
                  company.ProjectDirectory == undefined ? (
                    <></>
                  ) : (
                    Object.keys(company.ProjectDirectory).map((key, id) => {
                      return (
                        <option
                          value={company.ProjectDirectory[key].ProjectTitle}
                          key={id}
                        >
                          {company.ProjectDirectory[key].ProjectTitle}
                        </option>
                      );
                    })
                  )}
                  {/* <option>South Hampton L...</option>
                <option>South Hampton L...</option>
                <option>South Hampton L...</option> */}
                </select>
              </div>
            </div>

            <div className="max-w-[1024px] flex flex-col bg-gray-3 rounded-[24px]">
              {company["Activity"] != null &&
                company["Activity"] != undefined &&
                Object.keys(company["Activity"]).map((key, id) => {
                  if (
                    company["ProjectDirectory"][key].ProjectTitle !=
                    activityFilter
                  ) {
                    return <></>;
                  }
                  return (
                    <div className="" key={id}>
                      <div
                        className={
                          "flex bg-gray-2 px-[30px] py-[15px] justify-between " +
                          (id == 0 ? "rounded-t-[24px]" : "")
                        }
                      >
                        <div className="flex">
                          <p className="text-gray-10 text-small font-semibold mr-2">
                            Project:
                          </p>
                          <p className="text-white text-small font-semibold">
                            {company["ProjectDirectory"][key].ProjectTitle}
                          </p>
                        </div>
                        <button>
                          <Image
                            src={dropUpIcon}
                            width={25}
                            height={25}
                            alt="arrow"
                            className="relative right-0"
                          />
                        </button>
                      </div>
                      {Object.keys(company.Activity[key]).map((aKey, id) => {
                        return (
                          <div
                            className="flex bg-gray-3 px-[30px] py-[15px] justify-between items-center border-gray-4 border-b-[1px]"
                            key={id}
                          >
                            <div className="flex justify-start items-center">
                              <div className="w-[30px] h-[30px] mr-[17px] flex justify-center items-center">
                                <Image
                                  src={
                                    company.Activity[key][aKey].ActivityType ==
                                    "edited model details"
                                      ? editIcon
                                      : commentIcon
                                  }
                                  width={22}
                                  height={20}
                                  alt="commnet"
                                  className="opacity-60"
                                />
                              </div>
                              <div className="flex flex-col md:flex-row">
                                <p className="text-gray-10 md:text-primary text-xsmall font-semibold mr-[40px]">
                                  {company.Activity[key][aKey].AuthorName}
                                </p>
                                <div className="flex flex-wrap">
                                  <p className="text-gray-10 md:text-primary text-xsmall font-semibold mr-1">
                                    {company.Activity[key][aKey].ActivityType}:
                                  </p>
                                  <p className="text-red-primary md:text-primary text-xsmall font-semibold">
                                    {company.Activity[key][aKey].ModelTitle}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-10 md:text-primary text-xsmall font-semibold mr-1">
                                {company.Activity[key][aKey].CreatedDateTime}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityPage;
