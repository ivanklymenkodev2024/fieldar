"use client";

import Header from "@/components/headers/header";
import SideBar from "@/components/sidebars/sidebar";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Image from "next/image";

import plusIcon from "../../public/icons/PlusIcon.png";
import closeIcon from "../../public/icons/CloseXIcon.png";

import { child, get, getDatabase, ref } from "firebase/database";

import firebase_app from "../../firebase";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const database = getDatabase(firebase_app);

import { getFunctions, httpsCallable } from "firebase/functions";
import ReSideBar from "@/components/sidebars/residebar";
import ReHeader from "@/components/headers/reheader";
import { useGlobalContext } from "@/contexts/state";
import { useRouter } from "next/navigation";

const functions = getFunctions();
const cCreateProject = httpsCallable(functions, "createProject");

const ProjectPage = () => {
  const router = useRouter();
  const [isShowNewProjectModal, setIsShowNewProjectModal] = useState(false);

  const [regionFilter, setRegionFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectLocation, setNewProjectLocation] = useState("");
  const [newProjectRegion, setNewProjectRegion] = useState("");

  const [adminProject, setAdminProject] = useState([]);

  const [isAdmin, setIsAdmin] = useState(false);
  const [userID, setUserID] = useState("");

  const {
    user,
    setUser,
    profile,
    setProfile,
    project,
    setProject,
    company,
    setCompany,
    updateContext
  } = useGlobalContext();

  useEffect(() => {
    setUserID(user.uid);

    if (regionFilter == "") {
      setRegionFilter(company.CompanyRegions.split(",")[0].trim());
    }
    if (company.SubscriptionPlan != "Trial") {
      setIsAdmin(Object.keys(company.Admins).includes(user.uid));
      console.log(Object.keys(company.Admins).includes(user.uid));
    } else {
      setIsAdmin(false);
    }

    if (profile["CreatedProjects"] == undefined) {
      setAdminProject([]);
    } else {
      setAdminProject(Object.keys(profile["CreatedProjects"]));
    }
  }, [profile, company]);

  const createNewProject = () => {
    setNewProjectName("");
    setNewProjectLocation("");
    setNewProjectRegion(company.CompanyRegions.split(",")[0]);
    setIsShowNewProjectModal(true);
  };

  const handleCreateNewProject = () => {
    setIsLoading(true);
    cCreateProject({
      ProjectTitle: newProjectName,
      ProjectLocation: newProjectLocation,
      CompanyRegion: newProjectRegion,
      AllowMarkups: true,
    })
      .then((result:any) => {
        updateContext();
        toast.success(result.data.message);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsShowNewProjectModal(false);
        setIsLoading(false);
      });
  };

  const [isSide, setIsSide] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex min-h-[100vh] h-fit">
      <SideBar index={2} />
      {isSide && <ReSideBar index={2} hide={setIsSide} />}
      {!isSide && (
        <div className="absolute lg:left-[320px] lg:w-panel w-full min-h-[100vh] h-fit bg-gray-4">
          <Header title={"Project Management"} />
          <ReHeader title={"Project Management"} index={2} show={setIsSide} />
          <div className="px-[32px] pb-[14px] flex flex-col mt-[20px]">
            <div className="max-w-[1024px] flex justify-around md:justify-end items-end">
              <div className="flex flex-col w-[40%] md:w-auto">
                <p className="md:ml-10 ml-0 font-small font-light text-gray-10">
                  Filter by region
                </p>
                <select
                  className="custom-select bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-11 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] md:w-[260px] m-2 mr-5 outline-none focus:ring-0 appearance-none w-[100%]"
                  value={regionFilter}
                  onChange={(e) => {
                    setRegionFilter(e.target.value);
                  }}
                >
                  {company.CompanyRegions == null ||
                  company.CompanyRegions == undefined ? (
                    <></>
                  ) : (
                    company.CompanyRegions.split(",").map(
                      (item: any, id: any) => {
                        return (
                          <option key={id} value={item.trim()}>
                            {item.trim()}
                          </option>
                        );
                      }
                    )
                  )}
                </select>
              </div>
              <div className="w-[40%] md:w-auto">
                <input
                  className="bg-gray-3 text-gray-11 placeholder:italic rounded-[26px] font-small px-[23px] py-[14px] md:w-[277px] m-2 focus:border-none outline-none focus:ring-0 border-0 w-[100%]"
                  type="text"
                  placeholder="Search Projects"
                  value={nameFilter}
                  onChange={(e) => {
                    setNameFilter(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="max-w-[1024px] px-[32px] py-[11px]">
              <div className="grid grid-cols-5 md:grid-cols-7 lg:grid-cols-8">
                <p className="font-small text-gray-10 col-span-3 font-light">
                  Project Name
                </p>
                <p className="font-small text-gray-10 col-span-2 font-light hidden md:block">
                  Company Region
                </p>
                <p className="font-small text-gray-10 col-span-2 font-light">
                  Project Location
                </p>
                <p className="font-small text-gray-10 col-span-1 font-light hidden lg:block">
                  Editable
                </p>
              </div>
            </div>

            <div
              className={
                "max-w-[1024px] flex flex-col bg-gray-3 h-ttable rounded-[24px]" +
                (company.ProjectDirectory == undefined ||
                Object.keys(company.ProjectDirectory).length == 0
                  ? " justify-center items-center"
                  : "")
              }
            >
              {company.ProjectDirectory != null &&
                company.ProjectDirectory != undefined &&
                Object.keys(company.ProjectDirectory).map((key:any, id:any) => {
                  if (
                    regionFilter != "All" &&
                    company.ProjectDirectory[key].CompanyRegion !=
                      regionFilter
                  ) {
                    return <></>;
                  } else if (
                    !company.ProjectDirectory[
                      key
                    ].ProjectTitle.toLowerCase().includes(
                      nameFilter.toLowerCase()
                    )
                  ) {
                    return <></>;
                  }
                  return (
                    <div
                      className={
                        "grid grid-cols-5 md:grid-cols-7 lg:grid-cols-8 p-[10px] border-b-[1px] border-gray-4 hover:bg-gray-7 px-[22px]" +
                        (id == 0 ? " rounded-t-[24px]" : "")
                      }
                      key={id}
                    >
                      <div className="text-white col-span-3 font-light flex items-center">
                        <div
                          className={
                            "rounded-[100%] w-[10px] h-[10px] lg:hidden mr-[10px] " +
                            ((isAdmin == true || adminProject.includes(key) || (company.Team[userID] != undefined && company.Team[userID].MemberProjects[key] != undefined && company.Team[userID].MemberProjects[key].AccessRole == 'Manager'))
                              ? "bg-cyan-600"
                              : "bg-gray-4")
                          }
                        ></div>
                        <button onClick={() => {
                          if((isAdmin == true || adminProject.includes(key) || (company.Team[userID] != undefined && company.Team[userID].MemberProjects[key] != undefined && company.Team[userID].MemberProjects[key].AccessRole == 'Manager'))) {
                            router.push('/project/' + key);
                          }
                        }}>
                          {company.ProjectDirectory[key].ProjectTitle}
                        </button>
                      </div>
                      <p className="text-white col-span-2 font-light hidden md:block">
                        {company.ProjectDirectory[key].CompanyRegion}
                      </p>
                      <p className="text-white col-span-2 font-light">
                        {company.ProjectDirectory[key].ProjectLocation}
                      </p>
                      <div className="text-white col-span-1 font-light hidden lg:flex items-center">
                        <div
                          className={
                            "rounded-[100%] w-[10px] h-[10px] " +
                            ((isAdmin == true || adminProject.includes(key) || (company.Team[userID] != undefined && company.Team[userID].MemberProjects[key] != undefined && company.Team[userID].MemberProjects[key].AccessRole == 'Manager'))
                              ? "bg-cyan-600"
                              : "bg-gray-4")
                          }
                        ></div>
                      </div>
                    </div>
                  );
                })}
              {company.ProjectDirectory == undefined ||
              Object.keys(company.ProjectDirectory).length == 0 ? (
                <p className="text-gray-10">No projects created yet</p>
              ) : (
                <></>
              )}
            </div>

            {isAdmin && (
              <div className="max-w-[1024px] flex sm:justify-end justify-center">
                <button
                  className="mt-[16px] h-fit bg-red-primary rounded-[24px] px-[16px] py-[12px] font-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white flex items-center"
                  onClick={createNewProject}
                >
                  <Image
                    src={plusIcon}
                    width={20}
                    height={20}
                    alt="plus"
                    className="mr-[10px]"
                  />
                  <p className="font-light">Create New Project</p>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isShowNewProjectModal && (
        <div
          id="modal_user_role"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[610px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-full h-[100vh] left-0 top-0"
              onClick={() => setIsShowNewProjectModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  Create New Project
                </h3>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowNewProjectModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="mx-[82px] my-[20px]">
                <div className="mx-[30px] flex justify-start w-full mt-[20px]">
                  <p className="text-primary text-white text-left ml-[20px] font-semibold">
                    Project Name
                  </p>
                </div>
                <input
                  className="w-full bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-9 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] m-2 mr-5 outline-none focus:ring-0 appearance-none font-semibold "
                  placeholder="Enter Project Name..."
                  value={newProjectName}
                  onChange={(e) => {
                    setNewProjectName(e.target.value);
                  }}
                />
              </div>

              <div className="mx-[82px] my-[20px]">
                <div className="mx-[30px] flex justify-start w-full mt-[20px]">
                  <p className="text-primary text-white text-left ml-[20px] font-semibold">
                    Project Location
                  </p>
                </div>
                <input
                  className="w-full bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-9 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] m-2 mr-5 outline-none focus:ring-0 appearance-none font-semibold "
                  placeholder="Enter Project Location..."
                  value={newProjectLocation}
                  onChange={(e) => {
                    setNewProjectLocation(e.target.value);
                  }}
                />
              </div>

              <div className="mx-[82px] my-[20px]">
                <div className="mx-[30px] flex justify-start w-full mt-[20px]">
                  <p className="text-primary text-white text-left ml-[20px] font-semibold">
                    Company Region
                  </p>
                </div>
                <select
                  className="custom-black-select w-full bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-9 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] m-2 mr-5 outline-none focus:ring-0 appearance-none font-semibold "
                  value={newProjectRegion}
                  onChange={(e) => {
                    setNewProjectRegion(e.target.value);
                  }}
                >
                  {company.CompanyRegions == null ||
                  company.CompanyRegions == undefined ? (
                    <></>
                  ) : (
                    company.CompanyRegions.split(",").map(
                      (item: any, id: any) => {
                        return (
                          <option key={id} value={item}>
                            {item}
                          </option>
                        );
                      }
                    )
                  )}
                </select>
              </div>
              <div className="w-full flex justify-center my-[30px]">
                <button
                  className="flex justify-center items-center rounded-[28px] bg-gray-5 px-[80px] py-[15px] w-fit text-ssmall text-white font-bold"
                  onClick={handleCreateNewProject}
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
                  <p>Create Project</p>
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

export default ProjectPage;
