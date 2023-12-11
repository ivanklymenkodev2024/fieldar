"use client";

import Header from "@/components/header";
import SideBar from "@/components/sidebar";
import { useState } from "react";

import Image from "next/image";

import closeIcon from "../../public/icons/CloseXIcon.png";
import plusIcon from "../../public/icons/PlusIcon.png";
import projectIcon from "../../public/icons/ProjectIcon.png";
import editIcon from "../../public/icons/EditIcon.png";

import promoteToAdmin from "../../public/icons/AdminIcon.png";
import removeFromCompany from "../../public/icons/RemoveMember-Icon.png";
import { child, get, getDatabase, ref } from "firebase/database";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import firebase_app from "../../config";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const database = getDatabase(firebase_app);

import { getFunctions, httpsCallable } from "firebase/functions";
import ReSideBar from "@/components/residebar";
import ReHeader from "@/components/reheader";

const functions = getFunctions();
const cchangeProjectAccessRole = httpsCallable(
  functions,
  "changeProjectAccessRole"
);

const cPromoteMemberToAdmin = httpsCallable(functions, "promoteMemberToAdmin");

const cRemoveCompanyAdminRole = httpsCallable(
  functions,
  "removeCompanyAdminRole"
);

const cUnassignProjectFromMember = httpsCallable(
  functions,
  "unassignProjectFromMember"
);

const cInviteToCompany = httpsCallable(functions, "inviteToCompany");

const TeamPage = () => {
  const [isShowInviteModal, setIsShowInviteModal] = useState(false);
  const [isShowUserDetailModal, setIsShowUserDetailModal] = useState(false);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [isShowUserRoleModal, setIsShowUserRoleModal] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState(-1);
  const [selectedProjectId, setSelectedProjectId] = useState(-1);

  const [newRole, setNewRole] = useState("");

  const [members, setMembers] = useState({});

  const [day, setDay] = useState(1);

  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmContent, setConfirmContent] = useState("");

  const [inviteeEmail, setInviteeEmail] = useState("");

  const [filterString, setFilterString] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [userID, setUserID] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [admins, setAdmins] = useState([]);

  const getCompany = async (companyKey: string) => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `companies/${companyKey}`))
      .then((snapshot: any) => {
        if (snapshot.exists()) {
          setMembers(snapshot.val().Team);
        } else {
          console.log("No data available");
        }
        setAdmins(Object.keys(snapshot.val().Admins));
        if (isAdmin == false) {
          if (snapshot.val().SubscriptionPlan != "Trial") {
            setIsAdmin(Object.keys(snapshot.val().Admins).includes(userID));
          } else {
            setIsAdmin(false);
          }
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  auth.onAuthStateChanged(function (user: any) {
    if (user != null) {
      const uid = user.uid;
      setUserID(uid);
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

  const promoteToAdminFunc = () => {
    setIsShowUserDetailModal(false);
    setConfirmTitle("Promote to Admin");
    setConfirmContent(
      `Are you sure you wish to promote ${members[selectedUserId].MemberName} to Admin?`
    );
    setIsShowConfirmModal(true);
  };

  const removeAdminRoleFunc = () => {
    setIsShowUserDetailModal(false);
    setConfirmTitle("Remove Admin Role");
    setConfirmContent(
      `Are you sure you wish to remove admin role of ${members[selectedUserId].MemberName}?`
    );
    setIsShowConfirmModal(true);
  };

  const removeUserFromCompany = () => {
    setIsShowUserDetailModal(false);
    setConfirmTitle("Remove from Company");
    setConfirmContent(
      `Are you sure you wish to remove ${members[selectedUserId].MemberName} from company?`
    );
    setIsShowConfirmModal(true);
  };

  const unassignProjectFromMember = () => {
    setIsShowUserRoleModal(false);
    setConfirmTitle(`Remove Member from Project`);
    setConfirmContent(
      `Are you sure you wish to remove ${members[selectedUserId].MemberName} from Project ${members[selectedUserId].MemberProjects[selectedProjectId].ProjectName}?`
    );
    setIsShowConfirmModal(true);
  };

  const updateUserRole = (projectId: any) => {
    setSelectedProjectId(
      Object.keys(members[selectedUserId].MemberProjects)[projectId]
    );
    setNewRole(
      members[selectedUserId].MemberProjects[
        Object.keys(members[selectedUserId].MemberProjects)[projectId]
      ].ProjectRole
    );
    setIsShowUserDetailModal(false);
    setIsShowUserRoleModal(true);
  };

  const removeFromProject = () => {
    setIsShowUserRoleModal(false);
    setIsShowConfirmModal(true);
  };

  const openUserProjectModal = (id: any) => {
    setSelectedUserId(Object.keys(members)[id]);
    setIsShowUserDetailModal(true);
  };

  const handleUpdateRole = () => {
    setIsLoading(true);
    cchangeProjectAccessRole({
      projectKey: selectedProjectId,
      selectedMemberId: selectedUserId,
      selectedAccessRole: newRole,
    })
      .then((result) => {
        toast.success(result.data.message);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsShowUserRoleModal(false);
        setIsLoading(false);
      });
  };

  const handleRoleSelectChange = (e: any) => {
    setNewRole(e.target.value);
  };

  const handleAddMemberDaysChange = (e: any) => {
    setDay(e.target.value);
  };

  const handleConfirm = () => {
    setIsLoading(true);
    if (confirmTitle == "Promote to Admin") {
      cPromoteMemberToAdmin({
        userIdToPromote: selectedUserId,
      })
        .then((result) => {
          toast.success(result.data.message);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
          setIsShowConfirmModal(false);
        });
    } else if (confirmTitle == "Remove Admin Role") {
      cRemoveCompanyAdminRole({
        userIdToRemove: selectedUserId,
      })
        .then((result) => {
          toast.success(result.data.message);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
          setIsShowConfirmModal(false);
        });
    } else if (confirmTitle == "Remove from Company") {
      cRemoveCompanyAdminRole({
        userIdToRemove: selectedUserId,
      })
        .then((result) => {
          toast.success(result.data.message);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
          setIsShowConfirmModal(false);
        });
    } else if (confirmTitle == "Remove Member from Project") {
      cUnassignProjectFromMember({
        selectedProjectId,
        selectedMemberId: selectedUserId,
      })
        .then((result) => {
          setIsShowConfirmModal(false);
          toast.success(result.data.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleInviteToCompany = () => {
    setIsLoading(true);
    cInviteToCompany({
      inviteeEmail,
      daysToExpiration: day,
    })
      .then((result) => {
        toast.success(result.data.message);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
        setIsShowInviteModal(false);
      });
  };

  const handleCancel = () => {
    setIsShowConfirmModal(false);
  };

  const [isSide, setIsSide] = useState(false);

  return (
    <div className="flex overflow-hidden">
      <SideBar index={1} />
      {isSide && <ReSideBar index={1} />}
      {!isSide && (
        <div
          className={
            "fixed lg:left-[320px] lg:w-panel w-[100vw] min-h-[100vh] h-fit bg-gray-4"
          }
        >
          <ReHeader title={"Company Team"} index={1} show={setIsSide} />
          <Header title={"Company Team"} />
          <div className="px-[32px] py-[14px] flex flex-col">
            <div className="max-w-[1024px] flex justify-end">
              <input
                className="bg-gray-3 text-gray-11 placeholder:italic rounded-[26px] font-small px-[23px] py-[14px] sm:w-[400px] m-2 focus:border-none outline-none focus:ring-0 border-none w-[70%]"
                type="text"
                placeholder="Search Team Members"
                value={filterString}
                onChange={(e: any) => {
                  setFilterString(e.target.value);
                }}
              />
            </div>

            <div className="max-w-[1024px] px-[32px] py-[11px]">
              <div className="grid grid-cols-2 md:grid-cols-3">
                <p className="font-small text-gray-10 col-span-1 font-light">
                  Name
                </p>
                <p className="font-small text-gray-10 col-span-1 font-light hidden md:block">
                  Email
                </p>
                <p className="font-small text-gray-10 col-span-1 font-light">
                  Assigned Projects
                </p>
              </div>
            </div>

            <div className="max-w-[1024px] flex flex-col bg-gray-3 h-ttable rounded-[24px]">
              {members != undefined &&
                Object.keys(members).map((member_id: any, id: any) => {
                  if (
                    members[member_id]?.MemberName.toLocaleLowerCase().includes(
                      filterString.toLocaleLowerCase()
                    )
                  ) {
                    return (
                      <div
                        key={id}
                        className={`grid grid-cols-2 md:grid-cols-3 p-[10px] border-b-[1px] border-gray-4 hover:bg-gray-7 px-[22px] ${
                          id == 0 ? "rounded-t-[12px] pt-[16px]" : ""
                        }`}
                        onClick={() => {
                          if (isAdmin) openUserProjectModal(id);
                        }}
                      >
                        <button className="text-white col-span-1 font-light w-fit">
                          {members[member_id]?.MemberName}
                        </button>
                        <p className="text-white col-span-1 font-light hidden md:block">
                          {members[member_id]?.MemberEmail}
                        </p>
                        <p className="text-white col-span-1 font-light">
                          {members[member_id]?.MemberProjects == undefined
                            ? "0"
                            : Object.keys(members[member_id]?.MemberProjects)
                                .length}
                        </p>
                      </div>
                    );
                  } else {
                    return <></>;
                  }
                })}
            </div>

            {isAdmin && (
              <div className="max-w-[1024px] flex sm:justify-end justify-center">
                <button
                  className="mt-[16px] h-fit bg-red-primary rounded-[24px] px-[16px] py-[12px] font-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white flex items-center"
                  onClick={() => {
                    setIsShowInviteModal(true);
                    setInviteeEmail("");
                    setDay(1);
                  }}
                >
                  <Image
                    src={plusIcon}
                    width={20}
                    height={20}
                    alt="plus"
                    className="mr-[10px]"
                  />
                  <p className="font-light">Invite New Member</p>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isShowInviteModal && (
        <div
          id="modal_invite_new_member"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[580px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowInviteModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  Invite New Team Member
                </h3>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowInviteModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="mx-[70px] my-[10px] flex justify-center flex-col items-center">
                <p className="text-primary text-gray-10 text-center mx-[30px]">
                  Invite new team members to join your company, and you can
                  assign them to projects.
                </p>
                <div className="mx-[30px] flex justify-start w-full mt-[60px]">
                  <p className="text-primary text-white text-left ml-[20px] font-semibold">
                    Invite via company email
                  </p>
                </div>
                <input
                  className="text-primary bg-gray-3 text-gray-11 placeholder:italic rounded-[33px] px-[30px] py-[14px] focus:border-none focus:outline-none w-full focus:ring-0 border-none my-[12px]"
                  type="email"
                  placeholder="janedoe@email.com"
                  value={inviteeEmail}
                  onChange={(e: any) => setInviteeEmail(e.target.value)}
                />
                <div className="mx-[30px] flex justify-start w-full mt-[20px]">
                  <p className="text-primary text-white text-left ml-[20px] font-semibold">
                    Set Invite Expiration:
                  </p>
                </div>
                <select
                  className="custom-black-select w-full bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-9 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] m-2 mr-5 outline-none focus:ring-0 appearance-none font-semibold "
                  onChange={handleAddMemberDaysChange}
                  value={day}
                >
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 day</option>
                  <option value={60}>60 day</option>
                </select>
              </div>
              <div className="flex justify-center items-center p-4 md:p-5 mt-[30px]">
                <button
                  disabled={isLoading}
                  type="button"
                  className="flex items-center rounded-[24px] text-white bg-red-primary px-[90px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6"
                  onClick={handleInviteToCompany}
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
                  <p>Invite to company</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isShowUserDetailModal && (
        <div
          id="modal_user_detail"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[800px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowUserDetailModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  {members[selectedUserId].MemberName}
                </h3>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowUserDetailModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="mx-[50px] my-[10px] flex justify-start  items-center">
                <Image
                  src={projectIcon}
                  width={25}
                  height={25}
                  alt="[project]"
                  className="opacity-50"
                />
                <p className="text-ssmall text-gray-11 font-normal mx-[10px]">
                  Assigned Projects
                </p>
              </div>
              <div className="mx-[30px] my-[10px] flex flex-col items-start bg-gray-3 rounded-[33px] h-[360px]">
                {members[selectedUserId].MemberProjects != undefined &&
                  Object.keys(members[selectedUserId].MemberProjects).map(
                    (project, id) => {
                      return (
                        <>
                          <div
                            key={id}
                            className="flex justify-between items-center w-full px-[30px]"
                          >
                            <div className="flex justify-between grow">
                              <p className="rounded-t-[33px] my-[20px] text-primary font-normal text-white">
                                {
                                  members[selectedUserId].MemberProjects[
                                    project
                                  ].ProjectName
                                }
                              </p>
                              <p className="rounded-t-[33px] mx-[30px] my-[20px] text-primary font-normal text-white">
                                {
                                  members[selectedUserId].MemberProjects[
                                    project
                                  ].ProjectRole
                                }
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                if (isAdmin) updateUserRole(id);
                              }}
                            >
                              <Image
                                src={editIcon}
                                width={25}
                                height={25}
                                alt="edit"
                                className="mx-[30px]"
                              />
                            </button>
                          </div>
                          <hr className="border-b-[1px] border-gray-7 w-full" />
                        </>
                      );
                    }
                  )}
              </div>
              <div className="mx-[30px] my-[20px] flex flex-col justify-start items-center bg-gray-3 rounded-[33px]">
                <p className="text-ssmall text-gray-11 text-center my-[30px]">
                  Sensitive Features
                </p>
                <div className="flex justify-around mb-[20px]">
                  {!admins.includes(selectedUserId) ? (
                    <button
                      className="mx-[24px] mt-[10px] h-fit bg-gray-5 rounded-[24px] px-[16px] py-[12px] font-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white flex items-center"
                      onClick={promoteToAdminFunc}
                    >
                      <Image
                        src={promoteToAdmin}
                        width={25}
                        height={25}
                        alt="promote to admin"
                      />
                      <p className="ml-[10px] font-bold">Promote To Admin</p>
                    </button>
                  ) : (
                    <button
                      className="mx-[24px] mt-[10px] h-fit bg-gray-5 rounded-[24px] px-[16px] py-[12px] font-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white flex items-center"
                      onClick={removeAdminRoleFunc}
                    >
                      <Image
                        src={promoteToAdmin}
                        width={25}
                        height={25}
                        alt="promote to admin"
                      />
                      <p className="ml-[10px] font-bold">Remove Admin Role</p>
                    </button>
                  )}

                  <button
                    disabled={isLoading}
                    className="mx-[24px] mt-[10px] h-fit bg-red-primary rounded-[24px] px-[16px] py-[12px] font-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white flex items-center"
                    onClick={removeUserFromCompany}
                  >
                    <Image
                      src={removeFromCompany}
                      width={25}
                      height={25}
                      alt="remove from company"
                    />
                    <p className="ml-[10px] font-bold">
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
                      <p>Remove from company</p>
                    </p>
                  </button>
                </div>
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
                  {confirmTitle}
                </h3>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowConfirmModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="m-[30px] flex justify-center items-end text-center">
                <p className="text-small text-white font-semibold">
                  {confirmContent}
                </p>
              </div>
              <div className="flex justify-center items-center p-4 md:p-5 mx-[60px]">
                <button
                  disabled={isLoading}
                  onClick={handleCancel}
                  type="button"
                  className="rounded-[24px] text-white bg-gray-7-5 mx-[6px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 w-full"
                >
                  Cancel
                </button>
                <button
                  disabled={isLoading}
                  onClick={handleConfirm}
                  type="button"
                  className="flex justify-center items-center rounded-[24px] text-white bg-red-primary mx-[6px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 w-full"
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
                  Edit Project Role for {members[selectedUserId].MemberName}
                </h3>
                <button
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
                  {members[selectedUserId].MemberName}
                </p>
              </div>
              <div className="mx-[50px] my-[10px] flex justify-start items-center">
                <p className="text-primary text-gray-10">Assigned Project:</p>
                <p className="text-primary text-white mx-[10px]">
                  {
                    members[selectedUserId].MemberProjects[selectedProjectId]
                      .ProjectName
                  }
                </p>
              </div>
              <div className="mx-[50px] my-[10px] flex justify-start items-center">
                <p className="text-primary text-gray-10">
                  Current Member Role:
                </p>
                <p className="text-primary text-white mx-[10px]">
                  {
                    members[selectedUserId].MemberProjects[selectedProjectId]
                      .ProjectRole
                  }
                </p>
              </div>
              <div className="flex flex-col items-center mt-[50px]">
                <p className="text-gray-10 text-primary font-normal">
                  Change Member Role
                </p>
                <select
                  className="custom-select bg-gray-5 border-gray-5 focus:border-gray-5 text-white placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] my-[10px] outline-none focus:ring-0 appearance-none font-semibold w-[300px]"
                  value={newRole}
                  onChange={handleRoleSelectChange}
                >
                  <option value={"Manager"}>Manager</option>
                  <option value={"Editor"}>Editor</option>
                  <option value={"Viewer"}>Viewer</option>
                </select>

                <button
                  disabled={isLoading}
                  className="flex items-center justify-center py-[14px] text-primary text-white bg-red-primary my-[10px] rounded-[33px] w-[300px]"
                  onClick={() => {
                    handleUpdateRole();
                    // updateRole();
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
                  <p>Update Role</p>
                </button>
              </div>

              <hr className="border-gray-10 border-b-[1px] my-[30px]" />

              <div className="flex justify-center items-center p-4 md:p-5">
                <button
                  disabled={isLoading}
                  type="button"
                  className="flex items-center justify-center rounded-[24px] text-white bg-gray-8-5 px-[90px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6"
                  onClick={unassignProjectFromMember}
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
                  <p>Remove from project</p>
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

export default TeamPage;
