"use client";

import Header from "@/components/headers/header";
import SideBar from "@/components/sidebars/sidebar";
import Link from "next/link";

import Image from "next/image";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import backIcon from "../../../public/icons/DropdownArrowIcon.png";
import editIcon from "../../../public/icons/EditIcon.png";
import teamIcon from "../../../public/icons/TeamIcon.png";
import plusIcon from "../../../public/icons/PlusIcon.png";
import closeIcon from "../../../public/icons/CloseXIcon.png";
import alertIcon from "../../../public/icons/AlertIcon.png";
import modelIcon from "../../../public/icons/ModelIcon.png";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import firebase_app from "../../../firebase";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const database = getDatabase(firebase_app);

import { getFunctions, httpsCallable } from "firebase/functions";
import { child, get, getDatabase, ref } from "firebase/database";
import ReSideBar from "@/components/sidebars/residebar";
import ReHeader from "@/components/headers/reheader";
import { useGlobalContext } from "@/contexts/state";

const functions = getFunctions();
const cEditModelDetails = httpsCallable(functions, "editModelDetails");
const cDeleteModelAndFiles = httpsCallable(functions, "deleteModelAndFiles");
const cUpdateProjectInfo = httpsCallable(functions, "updateProjectInfo");
const cdeleteProject = httpsCallable(functions, "deleteProject");
const cAssignProjectToMember = httpsCallable(
  functions,
  "assignProjectToMember"
);
const cChangeProjectAccessRole = httpsCallable(
  functions,
  "changeProjectAccessRole"
);
const cUnassignProjectFromMember = httpsCallable(
  functions,
  "unassignProjectFromMember"
);

const ProjectDetailPage = ({ params }: any) => {
  const router = useRouter();
  const [projectId, setProjectId] = useState("");

  const [members, setMembers] = useState<any>({});
  const [filterString, setFilterString] = useState("");

  const [selectedNewMember, setSelectedNewMember] = useState("");

  const [isShowEditProjectModal, setIsShowEditProjectModal] = useState(false);
  const [isShowDeleteProjectModal, setIsShowDeleteProjectModal] =
    useState(false);
  const [isShowEditModelModal, setIsShowEditModelModal] = useState(false);
  const [isShowDeleteModelModal, setIsShowDeleteModelModal] = useState(false);
  const [isShowUserRoleModal, setIsShowUserRoleModal] = useState(false);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [isShowAddTeamMemberModal, setIsShowAddTeamMemberModal] =
    useState(false);

  const [allowAnyoneToScan, setAllowAnyoneToScan] = useState(false);
  const [allowedDomains, setAllowedDomains] = useState("");

  const [project, setProject] = useState<any>({});

  const [selectedModel, setSelectedModel] = useState("");
  const [newModelName, setNewModelName] = useState("");
  const [newModelLocation, setNewModelLocation] = useState("");

  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectLocation, setNewProjectLocation] = useState("");

  const [selectedTeamMember, setSelectedTeamMember] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");

  const [deleteModelTitle, setDeleteModelTitle] = useState("");

  const [newCompanyRegion, setNewCompanyRegion] = useState("");

  const [userID, setUserID] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getProject = (pid: any) => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `projects/${pid}`))
      .then((snapshot: any) => {
        if (snapshot.exists()) {
          setProject(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  const {
    user,
    setUser,
    profile,
    setProfile,
    company,
    setCompany,
    updateContext,
  } = useGlobalContext();

  useEffect(() => {
    setProjectId(params.id);
    setUserID(user.uid);
    getProject(params.id);
    setMembers(company.Team);
    if (company.SubscriptionPlan != "Trial") {
      setIsAdmin(Object.keys(company.Admins).includes(user.uid));
      console.log(Object.keys(company.Admins).includes(user.uid));
    } else {
      setIsAdmin(false);
    }
  }, [profile, company]);

  const handleRemoveUserFromProject = () => {
    setIsLoading(true);
    cUnassignProjectFromMember({
      selectedProjectId: projectId,
      selectedMemberId: selectedTeamMember,
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
        setSelectedTeamMember("");
        setIsShowConfirmModal(false);
      });
  };

  const handleUpdateProject = () => {
    if(allowAnyoneToScan == false && allowedDomains == "") {
      toast.warning('Please input allowed domains');
      return;
    }
    setIsLoading(true);
    cUpdateProjectInfo({
      ProjectTitle: newProjectName,
      ProjectLocation: newProjectLocation,
      CompanyRegion: newCompanyRegion,
      ProjectKey: projectId,
      AllowAnyoneToScan: allowAnyoneToScan,
      WhiteListedEmailDomains: allowedDomains
    })
      .then((result) => {
        updateContext();
        toast.success(result.data.message);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
        setIsShowEditProjectModal(false);
      });
  };

  const handleUpdateModel = () => {
    setIsLoading(true);
    cEditModelDetails({
      ProjectKey: projectId,
      ModelKey: selectedModel,
      ModelTitle: newModelName,
      ModelLocation: newModelLocation,
    })
      .then((result) => {
        updateContext();
        toast.success(result.data.message);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
        setIsShowEditModelModal(false);
      });
  };

  const handleDeleteModel = () => {
    setIsLoading(true);
    cDeleteModelAndFiles({
      projectKey: projectId,
      currentModelId: selectedModel,
      fileType: project.Models[selectedModel].FileType,
    })
      .then((result) => {
        updateContext();
        toast.success(result.data.message);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
        setIsShowDeleteModelModal(false);
      });
  };

  const handleDeleteProject = () => {
    setIsLoading(true);
    cdeleteProject({
      projectId: projectId,
    })
      .then((result) => {
        updateContext();
        toast.success(result.data.message);
        router.push("/project");
      })
      .catch((error) => {
        console.log(error);
        setIsShowDeleteProjectModal(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleInviteNewMember = () => {
    setIsLoading(true);
    cAssignProjectToMember({
      userId: selectedNewMember,
      accessRole: newMemberRole,
      projectKey: projectId,
    })
      .then((result) => {
        updateContext();
        toast.success(result.data.message);
      })
      .catch((error) => {
        if (error.code == "functions/already-exists") {
          toast.warning("User is already assigned to project");
        }
      })
      .finally(() => {
        setIsLoading(false);
        setIsShowAddTeamMemberModal(false);
      });
  };

  const updateRole = () => {
    setIsLoading(true);
    cChangeProjectAccessRole({
      projectKey: projectId,
      selectedMemberId: selectedTeamMember,
      selectedAccessRole: newMemberRole,
    })
      .then((result) => {
        updateContext();
        toast.success(result.data.message);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
        setIsShowUserRoleModal(false);
      });
  };

  const editProject = () => {
    setNewProjectName(project.ProjectTitle);
    setNewProjectLocation(project.ProjectLocation);
    setNewCompanyRegion(project.CompanyRegion);
    setAllowAnyoneToScan(project.AllowAnyoneToScan);
    setAllowedDomains(project.WhitelistedEmailDomains);
    setIsShowEditProjectModal(true);
  };

  const deleteModel = () => {
    setIsShowEditModelModal(false);
    setIsShowDeleteModelModal(true);
  };

  const removeFromProject = () => {
    setIsShowUserRoleModal(false);
    setIsShowConfirmModal(true);
  };

  const [isSide, setIsSide] = useState(false);

  return (
    <div className="flex min-h-[100vh] w-auto h-full">
      <SideBar index={2} />
      {isSide && <ReSideBar index={2} hide={setIsSide} />}
      {!isSide && (
        <div className="absolute lg:left-[320px] lg:w-panel w-full min-h-[100vh] h-fit bg-gray-4">
          <Header title={"Project Details"} />
          <ReHeader title={"Project Details"} index={2} show={setIsSide} />
          <div className="px-[32px] py-[10px] flex flex-col">
            <Link
              href={"/project"}
              className="text-small px-[20px] py-[10px] flex items-center bg-gray-2 w-fit rounded-[29px]"
            >
              <Image
                src={backIcon}
                width={16}
                height={19}
                alt="back"
                className="mr-[10px] transform rotate-90"
              />{" "}
              <p className="text-small font-semibold text-white">Back</p>
            </Link>
          </div>
          <div className="mx-[32px] my-[10px] bg-gray-2 rounded-[28px] max-w-[840px] flex justify-between">
            <div className="px-[20px] py-[10px]">
              <div className="flex my-2">
                <p className="text-ssmall font-normal text-gray-10">
                  Project:{" "}
                </p>
                <p className="ml-[10px] text-ssmall font-bold text-white">
                  {project.ProjectTitle}
                </p>
              </div>
              <div className="flex my-2">
                <p className="text-ssmall font-normal text-gray-10">
                  Location:{" "}
                </p>
                <p className="ml-[10px] text-ssmall font-bold text-white">
                  {project.ProjectLocation}
                </p>
              </div>
            </div>
            {(isAdmin ||
              (project.TeamMembers != undefined &&
                project.TeamMembers[userID] != undefined &&
                project.TeamMembers[userID].AccessRole == "Manager")) && (
              <div className="px-[20px] py-[10px] flex flex-col justify-around items-center">
                <button
                  disabled={isLoading}
                  className="h-fit bg-gray-5 rounded-[24px] px-[16px] py-[12px] text-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white flex items-center"
                  onClick={editProject}
                >
                  <Image src={editIcon} width={25} height={25} alt="edit" />
                  <p className="ml-[10px] text-primary font-normal">
                    Edit Details
                  </p>
                </button>
                <button
                  disabled={isLoading}
                  className="text-red-primary text-primary font-normal"
                  onClick={() => {
                    setIsShowDeleteProjectModal(true);
                  }}
                >
                  Delete Project
                </button>
              </div>
            )}
          </div>
          <div className="px-[32px] py-[10px] flex flex-wrap md:flex-row flex-col">
            <div className="flex flex-col ml-[10px] mx-[30px]">
              <div className="flex items-center">
                <Image
                  src={modelIcon}
                  width={32}
                  height={32}
                  alt="model icon"
                  className="opacity-30"
                />
                <p className="text-small text-gray-10 mx-[10px] my-[10px]">
                  Models
                </p>
              </div>
              <div className="w-[100%] md:w-[450px] bg-gray-3 h-[500px] rounded-[24px] ">
                {project.Models != null &&
                  project.Models != undefined &&
                  Object.keys(project.Models).map((key, id) => {
                    return (
                      <>
                        <div
                          className={
                            (id == 0 ? "rounded-t-[24px]" : "") +
                            " flex justify-between items-center mx-[30px] my-[15px]"
                          }
                        >
                          <div className="flex justify-start items-center">
                            <div className="w-[54px] h-[54px] bg-white rounded-[13px] mr-[18px]"></div>
                            <p className="text-primary text-white font-normal">
                              {project.Models[key].ModelTitle}
                            </p>
                          </div>
                          {(isAdmin ||
                            (project.TeamMembers != undefined &&
                              project.TeamMembers[userID] != undefined &&
                              project.TeamMembers[userID].AccessRole ==
                                "Manager")) && (
                            <button
                              disabled={isLoading}
                              onClick={() => {
                                setSelectedModel(key);
                                setNewModelName(project.Models[key].ModelTitle);
                                setNewModelLocation(
                                  project.Models[key].ModelLocation
                                );
                                setIsShowEditModelModal(true);
                              }}
                            >
                              <Image
                                src={editIcon}
                                width={22}
                                height={22}
                                alt="edit"
                              />
                            </button>
                          )}
                        </div>
                        <hr className="w-full border-[1px] border-gray-7" />
                      </>
                    );
                  })}

                {/* <div className="flex justify-between items-center mx-[30px] my-[15px]">
                <div className="flex justify-start items-center">
                  <div className="w-[54px] h-[54px] bg-white rounded-[13px] mr-[18px]"></div>
                  <p className="text-primary text-white font-normal">
                    Corridor 34f
                  </p>
                </div>
                <Image src={editIcon} width={22} height={22} alt="edit" />
              </div>
              <hr className="w-full border-[1px] border-gray-7" /> */}
              </div>
            </div>

            <div className="flex flex-col mr-[20px] w-full md:w-auto">
              <div className="flex items-center justify-start mx-[15px]">
                <Image
                  src={teamIcon}
                  width={25}
                  height={25}
                  alt={"team"}
                  className="opacity-30"
                />
                <p className="text-small text-gray-10 mx-[15px] my-[10px]">
                  Project Team Members
                </p>
              </div>
              <div className="w-full md:w-[520px] bg-gray-3 h-[500px] rounded-[24px] ">
                {project.TeamMembers != undefined &&
                  project.TeamMembers != null &&
                  Object.keys(project.TeamMembers)
                    .sort((m1, m2) => {
                      let role1 = project.TeamMembers[m1].AccessRole;
                      let role2 = project.TeamMembers[m2].AccessRole;
                      if (role1 == "Manager") {
                        return false;
                      } else if (role1 == "Editor") {
                        if (role2 != "Manager") {
                          return false;
                        }
                      } else if (role1 == "Viewer") {
                        if (role2 == "Viewer") {
                          return false;
                        }
                      }
                      return true;
                    })
                    .reverse()
                    .map((key) => {
                      return (
                        <>
                          <div className="rounded-t-[24px] flex justify-between items-center mx-[30px] my-[15px]">
                            <div className="flex justify-between items-center grow mr-[40px]">
                              <p className="text-primary text-white font-normal">
                                {project.TeamMembers[key].MemberName}
                              </p>
                              <p className="text-primary text-white font-normal">
                                {project.TeamMembers[key].AccessRole}
                              </p>
                            </div>
                            {(isAdmin ||
                              (project.TeamMembers != undefined &&
                                project.TeamMembers[userID] != undefined &&
                                project.TeamMembers[userID].AccessRole ==
                                  "Manager")) && (
                              <button
                                disabled={isLoading}
                                onClick={() => {
                                  setSelectedTeamMember(key);
                                  setNewMemberRole(
                                    project.TeamMembers[key].AccessRole
                                  );
                                  setIsShowUserRoleModal(true);
                                }}
                              >
                                <Image
                                  src={editIcon}
                                  width={22}
                                  height={22}
                                  alt="edit"
                                />
                              </button>
                            )}
                          </div>
                          <hr className="w-full border-[1px] border-gray-7" />
                        </>
                      );
                    })}
              </div>
              {(isAdmin ||
                (project.TeamMembers != undefined &&
                  project.TeamMembers[userID] != undefined &&
                  project.TeamMembers[userID].AccessRole == "Manager")) && (
                <div className="w-full flex justify-center md:justify-end">
                  <button
                    disabled={isLoading}
                    className="bg-red-primary px-[30px] py-[15px] w-fit rounded-[29px] my-[10px] flex items-center"
                    onClick={() => {
                      setNewMemberRole("Manager");
                      setIsShowAddTeamMemberModal(true);
                    }}
                  >
                    <Image
                      src={plusIcon}
                      width={20}
                      height={20}
                      alt="plus"
                      className="mr-[20px]"
                    />
                    <p className="text-small text-white">Add Team Member</p>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isShowEditProjectModal && (
        <div
          id="modal_user_role"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[610px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowEditProjectModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  Edit Project
                </h3>
                <button
                  disabled={isLoading}
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowEditProjectModal(false)}
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
                  placeholder="Enter Location..."
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
                  value={newCompanyRegion}
                  onChange={(e) => {
                    setNewCompanyRegion(e.target.value);
                  }}
                >
                  {company.CompanyRegions == null ||
                  company.CompanyRegions == undefined ? (
                    <></>
                  ) : (
                    company.CompanyRegions.split(",").map(
                      (item: any, id: any) => {
                        return (
                          <option value={item} key={id}>
                            {item}
                          </option>
                        );
                      }
                    )
                  )}
                </select>
              </div>
              <div className="mx-[82px] my-[20px] flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    value=""
                    className="w-[30px] h-[30px] text-white bg-gray-5 mx-[10px] rounded-[6px]  focus:ring-0 focus:bg-gray-5 focus:border-none focus:outline-none active:bg-gray-5 ring-0"
                    checked={allowAnyoneToScan}
                    onChange={(e: any) => {
                      setAllowAnyoneToScan(e.target.checked);
                    }}
                  />
                  <p className="text-primary text-white text-left ml-[20px] font-semibold">
                    Allow Anyone to scan QR Targets
                  </p>
                </div>
                <div className="has-tooltip">
                  <span className="tooltip rounded-[20px] shadow-lg bg-gray-4 text-white -mt-8 w-[380px] text-center p-[30px] border-white">
                    By default, the FieldAR mobile app allows anyone on your
                    project site to scan any QR target to view models in AR.
                    <br />
                    <br />
                    With this option, you can choose to allow only certain users
                    with the email domains below to scan the QR targets.
                    <br />
                    <br />
                    Example: if acme.com is allowed, then john@acme.com can
                    scan.
                    <br />
                    <br />
                    *Comma-separated values
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="white"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mx-[82px] my-[20px]">
                <div className="mx-[30px] flex justify-start w-full mt-[20px]">
                  <p className="text-primary text-white text-left ml-[20px] font-semibold">
                    Allowed email domains
                  </p>
                </div>
                <textarea
                  className="bg-gray-3 px-[23px] py-[14px] m-2 mr-5 w-full rounded-[17px] text-gray-10-5 ring-0 focus:outline-none focus:border-none focus:ring-0 border-0"
                  rows={3}
                  placeholder="gmail.com, company.com"
                  value={allowedDomains}
                  onChange={(e:any) => {
                    setAllowedDomains(e.target.value);
                  }}
                />
              </div>

              <div className="w-full flex justify-center my-[30px]">
                <button
                  disabled={isLoading}
                  className="flex justify-center items-center rounded-[28px] bg-gray-5 px-[80px] py-[15px] w-fit text-ssmall text-white font-bold"
                  onClick={handleUpdateProject}
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

      {isShowDeleteProjectModal && (
        <div
          id="modal_delete_project"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[610px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowDeleteProjectModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-start justify-center p-4 md:p-5 ">
                <div className="w-[50px] h-[50px] bg-red">
                  <Image src={alertIcon} width={50} height={50} alt={"alert"} />
                </div>
                <button
                  disabled={isLoading}
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowDeleteProjectModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="mx-[32px] flex flex-col justify-center ">
                <div className="flex justify-center w-full">
                  <p className="text-white text-center text-ssmall font-semibold">
                    Confirm Delete project
                  </p>
                </div>
                <p className="text-white text-primary text-center">
                  If you are sure you want to delete this project, please type
                  the project title in the field below. This project will be
                  removed for all team members currently assigned to the
                  project, and all currently active models will become
                  dislocated from their respective QR markers on your jobsite.
                  The models files associated to this project will be erased.
                  Please note that this action is irreversible.
                </p>
                <p className="text-white text-primary text-center my-[10px]">
                  Please note that this action is irreversible.
                </p>

                <div className="text-white text-primary text-center my-[10px] flex justify-center mt-[40px]">
                  <p className="text-gray-10">Project Title:</p>{" "}
                  {" " + project.ProjectTitle}
                </div>
                <div className="w-full flex justify-center">
                  <input
                    className="bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-9 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] m-2 mr-5 outline-none focus:ring-0 appearance-none font-semibold "
                    placeholder="Type the project title..."
                  />
                </div>
              </div>

              <div className="w-full flex justify-center my-[30px]">
                <button
                  disabled={isLoading}
                  className="flex items-center justify-center rounded-[28px] bg-red-primary px-[40px] py-[15px] w-fit text-ssmall text-white font-bold"
                  onClick={handleDeleteProject}
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
                  <p>Delete Project Project</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isShowDeleteModelModal && (
        <div
          id="modal_delete_model"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[610px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowDeleteModelModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-start justify-center p-4 md:p-5 ">
                <div className="w-[50px] h-[50px] bg-red">
                  <Image src={alertIcon} width={50} height={50} alt={"alert"} />
                </div>
                <button
                  disabled={isLoading}
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowDeleteModelModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="mx-[32px] flex flex-col justify-center ">
                <div className="flex justify-center w-full">
                  <p className="text-white text-center text-ssmall font-semibold">
                    Confirm Delete Model
                  </p>
                </div>
                <p className="text-white text-primary text-center">
                  If you are sure you want to delete this model, please type the
                  model title in the field below. Please note that this action
                  is irreversible.
                </p>

                <div className="text-white text-primary text-center my-[10px] flex justify-center mt-[40px]">
                  <p className="text-gray-10">Model Title:</p>{" "}
                  {project.Models[selectedModel].ModelTitle}
                </div>
                <div className="w-full flex justify-center">
                  <input
                    className="bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-9 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] m-2 mr-5 outline-none focus:ring-0 appearance-none font-semibold "
                    placeholder="Type the model title..."
                    value={deleteModelTitle}
                    onChange={(e) => {
                      setDeleteModelTitle(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="w-full flex justify-center my-[30px]">
                <button
                  disabled={isLoading}
                  className="flex items-center justify-center rounded-[28px] bg-red-primary px-[40px] py-[15px] w-fit text-ssmall text-white font-bold"
                  onClick={handleDeleteModel}
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
                  <p>Delete model</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isShowEditModelModal && (
        <div
          id="modal_user_role"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[610px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowEditModelModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  Edit Model
                </h3>
                <button
                  disabled={isLoading}
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowEditModelModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="mx-[82px] my-[20px]">
                <div className="mx-[30px] flex justify-start w-full mt-[20px]">
                  <p className="text-primary text-white text-left ml-[20px] font-semibold">
                    Model Name
                  </p>
                </div>
                <input
                  className="w-full bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-9 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] m-2 mr-5 outline-none focus:ring-0 appearance-none font-semibold "
                  placeholder="Enter Model Name..."
                  value={newModelName}
                  onChange={(e) => {
                    setNewModelName(e.target.value);
                  }}
                />
              </div>

              <div className="mx-[82px] my-[20px]">
                <div className="mx-[30px] flex justify-start w-full mt-[20px]">
                  <p className="text-primary text-white text-left ml-[20px] font-semibold">
                    Model Location
                  </p>
                </div>
                <input
                  className="w-full bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-9 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] m-2 mr-5 outline-none focus:ring-0 appearance-none font-semibold "
                  placeholder="Enter Project Name..."
                  value={newModelLocation}
                  onChange={(e) => {
                    setNewModelLocation(e.target.value);
                  }}
                />
              </div>

              <div className="w-full flex flex-col justify-center items-center my-[30px]">
                <button
                  disabled={isLoading}
                  className="rounded-[28px] px-[80px] py-[15px] w-fit text-primary text-red-primary font-bold"
                  onClick={deleteModel}
                >
                  Delete Model
                </button>
                <button
                  disabled={isLoading}
                  className="flex justify-center items-center rounded-[28px] bg-gray-5 px-[80px] py-[15px] w-fit text-ssmall text-white font-bold"
                  onClick={handleUpdateModel}
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

      {isShowUserRoleModal && (
        <div
          id="modal_user_role"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[580px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowUserRoleModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  Edit Project Role for{" "}
                  {project.TeamMembers[selectedTeamMember].MemberName}
                </h3>
                <button
                  disabled={isLoading}
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowUserRoleModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="mx-[50px] my-[10px] flex justify-start items-center">
                <p className="text-primary text-gray-10">Team member:</p>
                <p className="text-primary text-white mx-[10px]">
                  {project.TeamMembers[selectedTeamMember].MemberName}
                </p>
              </div>
              <div className="mx-[50px] my-[10px] flex justify-start items-center">
                <p className="text-primary text-gray-10">Assigned Project:</p>
                <p className="text-primary text-white mx-[10px]">
                  {project.ProjectTitle}
                </p>
              </div>
              <div className="mx-[50px] my-[10px] flex justify-start items-center">
                <p className="text-primary text-gray-10">
                  Current Member Role:
                </p>
                <p className="text-primary text-white mx-[10px]">
                  {project.TeamMembers[selectedTeamMember].AccessRole}
                </p>
              </div>
              <div className="flex flex-col items-center mt-[50px]">
                <p className="text-gray-10 text-primary font-normal">
                  Change Member Role
                </p>
                <select
                  className="custom-select bg-gray-5 border-gray-5 focus:border-gray-5 text-white placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] my-[10px] outline-none focus:ring-0 appearance-none font-semibold w-[300px]"
                  value={newMemberRole}
                  onChange={(e) => {
                    setNewMemberRole(e.target.value);
                  }}
                >
                  <option value={"Manager"}>Manager</option>
                  <option value={"Editor"}>Editor</option>
                  <option value={"Viewer"}>Viewer</option>
                </select>

                <button
                  disabled={isLoading}
                  className="flex justify-center items-center py-[14px] text-primary text-white bg-red-primary my-[10px] rounded-[33px] w-[300px]"
                  onClick={updateRole}
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
                  <p>Update Role</p>
                </button>
              </div>

              <hr className="border-gray-10 border-b-[1px] my-[30px]" />

              <div className="flex justify-center items-center p-4 md:p-5">
                <button
                  disabled={isLoading}
                  type="button"
                  className="flex items-center justify-center rounded-[24px] text-white bg-gray-8-5 px-[90px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6"
                  onClick={removeFromProject}
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
                  <p>Remove from Project</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isShowConfirmModal && (
        <div
          id="modal_confirm"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[490px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowConfirmModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  Remove from Project
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
                  Are you sure you wish to remove{" "}
                  {selectedTeamMember.trim().length != 0 &&
                    project.TeamMembers[selectedTeamMember].MemberName}{" "}
                  from {project.ProjectTitle}?
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
                  onClick={handleRemoveUserFromProject}
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
                  <p>Confrim</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isShowAddTeamMemberModal && (
        <div
          id="modal_user_role"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[680px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowAddTeamMemberModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  Add a Team Member to this project
                </h3>
                <button
                  disabled={isLoading}
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowAddTeamMemberModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="w-full flex justify-center">
                <p className="text-gray-10 text-center max-w-[340px]">
                  Add a company team member to this project, and assign their
                  access role below.
                </p>
              </div>

              <div className="w-full flex justify-around items-center px-[30px] md:px-[70px] mt-[50px] mb-[10px]">
                <p className="md:text-ssmall text-gray-10 text-primary text-center">
                  Company Team Members
                </p>
                <input
                  className="bg-gray-3 text-gray-11 text-2xsmall placeholder:italic rounded-[26px] font-small px-[23px] py-[10px] focus:border-none outline-none focus:ring-0 border-none"
                  type="text"
                  placeholder="Search Members"
                  value={filterString}
                  onChange={(e) => {
                    setFilterString(e.target.value);
                  }}
                />
              </div>

              <div className="bg-gray-3 h-[317px] flex flex-col rounded-[24px] mx-[30px] md:mx-[70px]">
                {Object.keys(members).map((member_id: any, id: any) => {
                  if (
                    members[member_id]?.MemberName.toLocaleLowerCase().includes(
                      filterString.toLocaleLowerCase()
                    )
                  ) {
                    return (
                      <>
                        {" "}
                        <div
                          className={
                            "grid grid-cols-2 py-[14px] " +
                            (selectedNewMember == member_id
                              ? (id == 0 ? " rounded-t-[24px] " : "") +
                                "bg-gray-7"
                              : "")
                          }
                          onClick={() => {
                            setSelectedNewMember(member_id);
                            console.log(member_id);
                          }}
                        >
                          <p className="col-span-1 text-2xsmall md:text-primary text-white font-normal ml-[40px] whitespace-pre">
                            {members[member_id]?.MemberName}
                          </p>
                          <p className="col-span-1 text-2xsmall md:text-primary text-white font-normal whitespace-pre">
                            {members[member_id]?.MemberEmail}
                          </p>
                        </div>
                        <hr className="border-b-[1px] border-gray-7" />
                      </>
                    );
                  } else {
                    return <></>;
                  }
                })}
              </div>

              <div className="flex flex-col items-center mt-[50px]">
                <p className="text-gray-10 text-primary font-normal">
                  Change Access Role
                </p>
                <select
                  className="custom-select bg-gray-5 border-gray-5 focus:border-gray-5 text-white placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] my-[10px] outline-none focus:ring-0 appearance-none font-semibold w-[80%] md:w-[400px]"
                  value={newMemberRole}
                  onChange={(e) => {
                    setNewMemberRole(e.target.value);
                  }}
                >
                  <option value={"Manager"}>Manager</option>
                  <option value={"Editor"}>Editor</option>
                  <option value={"Viewer"}>Viewer</option>
                </select>
              </div>

              <div className="flex justify-center items-center p-4 md:p-5">
                <button
                  disabled={isLoading}
                  type="button"
                  className="flex items-center justify-center rounded-[24px] text-white bg-red-primary px-[90px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6"
                  onClick={handleInviteNewMember}
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
                  <p>Add Team Member</p>
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

export default ProjectDetailPage;
