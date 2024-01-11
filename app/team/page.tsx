"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import plusIcon from "../../public/icons/PlusIcon.png";

import firebase_app from "../../firebase";
import { child, get, getDatabase, ref } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

const auth = getAuth();
const database = getDatabase(firebase_app);
const functions = getFunctions();

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useGlobalContext } from "@/contexts/state";

import SideBar from "@/components/sidebars/sidebar";
import ReSideBar from "@/components/sidebars/residebar";
import Header from "@/components/headers/header";
import ReHeader from "@/components/headers/reheader";
import InviteModal from "@/components/modals/inviteModal";
import UserDetailModal from "@/components/modals/userDetail";
import ConfirmModal from "@/components/modals/confirmModal";
import UserRoleModal from "@/components/modals/userRole";

const cchangeProjectAccessRole = httpsCallable(
  functions,
  "changeProjectAccessRole"
);
const cPromoteMemberToAdmin = httpsCallable(functions, "promoteMemberToAdmin");
const cRemoveCompanyAdminRole = httpsCallable(
  functions,
  "removeCompanyAdminRole"
);
const cRemoveMemberFromCompany = httpsCallable(
  functions,
  "removeMemberFromCompany"
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

  const [selectedUserId, setSelectedUserId] = useState<any>(-1);
  const [selectedProjectId, setSelectedProjectId] = useState<any>(-1);

  const [newRole, setNewRole] = useState("");

  const [members, setMembers] = useState<any>({});

  const [day, setDay] = useState(1);

  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmContent, setConfirmContent] = useState("");

  const [inviteEmail, setInviteEmail] = useState("");

  const [filterString, setFilterString] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [userID, setUserID] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [admins, setAdmins] = useState<any>([]);

  const { isMaster, inputUserId, user, profile, company, updateContext } =
    useGlobalContext();

  useEffect(() => {
    setUserID(isMaster ? inputUserId : user.uid);
    setMembers(company.Team);
    setAdmins(Object.keys(company.Admins));
    if (company.SubscriptionPlan != "Trial") {
      setIsAdmin(
        Object.keys(company.Admins).includes(isMaster ? inputUserId : user.uid)
      );
    } else {
      setIsAdmin(false);
    }
  }, [profile, company]);

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
    let data: any = {
      projectKey: selectedProjectId,
      selectedMemberId: selectedUserId,
      selectedAccessRole: newRole,
    };
    if (isMaster) {
      data["inputUserId"] = inputUserId;
    }
    cchangeProjectAccessRole(data)
      .then((result: any) => {
        updateContext();
        toast.success(result.data.message);
      })
      .catch((error) => {
        console.log(error);
        toast.warning(error.message);
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
      let data: any = {
        userIdToPromote: selectedUserId,
      };
      if (isMaster) {
        data["inputUserId"] = inputUserId;
      }
      cPromoteMemberToAdmin(data)
        .then((result: any) => {
          updateContext();
          toast.success(result.data.message);
        })
        .catch((error) => {
          console.log(error);
          toast.warning(error.message);
        })
        .finally(() => {
          setIsLoading(false);
          setIsShowConfirmModal(false);
        });
    } else if (confirmTitle == "Remove Admin Role") {
      let data: any = {
        userIdToRemove: selectedUserId,
      };
      if (isMaster) {
        data["inputUserId"] = inputUserId;
      }
      cRemoveCompanyAdminRole(data)
        .then((result: any) => {
          updateContext();
          toast.success(result.data.message);
        })
        .catch((error) => {
          console.log(error);
          toast.warning(error.message);
        })
        .finally(() => {
          setIsLoading(false);
          setIsShowConfirmModal(false);
        });
    } else if (confirmTitle == "Remove from Company") {
      let data: any = {
        userIdToRemove: selectedUserId,
      };
      if (isMaster) {
        data["inputUserId"] = inputUserId;
      }
      cRemoveMemberFromCompany(data)
        .then((result: any) => {
          updateContext();
          toast.success(result.data.message);
        })
        .catch((error) => {
          console.log(error);
          toast.warning(error.message);
        })
        .finally(() => {
          setIsLoading(false);
          setIsShowConfirmModal(false);
        });
    } else if (confirmTitle == "Remove Member from Project") {
      let data: any = {
        selectedProjectId,
        selectedMemberId: selectedUserId,
      };
      if (isMaster) {
        data["inputUserId"] = inputUserId;
      }
      cUnassignProjectFromMember(data)
        .then((result: any) => {
          setIsShowConfirmModal(false);
          updateContext();
          toast.success(result.data.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleInviteToCompany = () => {
    setIsLoading(true);
    let data: any = {
      inviteeEmail: inviteEmail,
      daysToExpiration: day,
    };
    if (isMaster) {
      data["inputUserId"] = inputUserId;
    }
    cInviteToCompany(data)
      .then((result: any) => {
        updateContext();
        toast.success(result.data.message);
      })
      .catch((error) => {
        console.log(error);
        toast.warning(error.message);
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
      {isSide && <ReSideBar index={1} hide={setIsSide} />}
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
                          id == 0 ? "rounded-t-[24px] pt-[16px]" : ""
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
                    setInviteEmail("");
                    setDay(7);
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

      <InviteModal
        isLoading={isLoading}
        isShow={isShowInviteModal}
        inviteEmail={inviteEmail}
        setInviteEmail={setInviteEmail}
        day={day}
        setDay={setDay}
        handleInviteToCompany={handleInviteToCompany}
        hide={() => {
          if (isLoading) return;
          setIsShowInviteModal(false);
        }}
      />

      <UserDetailModal
        isShow={isShowUserDetailModal}
        isLoading={isLoading}
        members={members}
        admins={admins}
        selectedUserId={selectedUserId}
        isAdmin={isAdmin}
        updateUserRole={updateUserRole}
        promoteToAdminFunc={promoteToAdminFunc}
        removeUserFromCompany={removeUserFromCompany}
        removeAdminRoleFunc={removeAdminRoleFunc}
        hide={() => {
          if (isLoading) return;
          setIsShowUserDetailModal(false);
        }}
      />

      <ConfirmModal
        isShow={isShowConfirmModal}
        title={confirmTitle}
        isLoading={isLoading}
        content={confirmContent}
        handleCancel={handleCancel}
        handleSubmit={handleConfirm}
        hide={() => {
          if (isLoading) return;
          setIsShowConfirmModal(false);
        }}
      />

      <UserRoleModal
        isShow={isShowUserRoleModal}
        isLoading={isLoading}
        hide={() => {
          if (isLoading) return;
          setIsShowUserRoleModal(false);
        }}
        members={members}
        newRole={newRole}
        setNewRole={setNewRole}
        selectedUserId={selectedUserId}
        selectedProjectId={selectedProjectId}
        isAdmin={isAdmin}
        handleUpdateRole={handleUpdateRole}
        unassignProjectFromMember={unassignProjectFromMember}
      />
      <ToastContainer />
    </div>
  );
};

export default TeamPage;
