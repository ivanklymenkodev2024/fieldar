"use client";

import Header from "@/components/header";
import SideBar from "@/components/sidebar";

import Image from "next/image";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import backIcon from "../../public/icons/DropdownArrowIcon.png";
import projectIcon from "../../public/icons/ProjectIcon.png";
import modelIcon from "../../public/icons/ModelIcon.png";
import viewIcon from "../../public/icons/ViewIcon.png";
import editIcon from "../../public/icons/EditIcon.png";
import trashIcon from "../../public/icons/TrashIcon.png";
import closeIcon from "../../public/icons/CloseXIcon.png";

import { useEffect, useState } from "react";
import ReSideBar from "@/components/residebar";
import ReHeader from "@/components/reheader";
import { useGlobalContext } from "@/contexts/state";
import { child, get, getDatabase, ref } from "firebase/database";

import firebase_app from "../../config";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const database = getDatabase(firebase_app);

import { getFunctions, httpsCallable } from "firebase/functions";
import Link from "next/link";

const functions = getFunctions();
const cRemoveProjectsFromEnterprise = httpsCallable(
  functions,
  "removeProjectsFromEnterprise"
);

const EditSubscriptionPage = () => {
  const [isSide, setIsSide] = useState(false);

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

  const [companyProjectCount, setCompanyProjectCount] = useState(
    company.SubscriptionDetails != undefined
      ? company.SubscriptionDetails.projectQuantity
      : 0
  );

  const [selectedProjects, setSelectedProjects] = useState([]);

  const [isShowBillingDetailsModal, setIsShowBillingDetailsModal] =
    useState(false);

  const handleRemoveProjects = () => {
    setIsLoading(true);
    cRemoveProjectsFromEnterprise({
      numProjectsToRemove: selectedProjects.filter((item) => item == true)
        .length,
    })
      .then((result) => {
        toast.success(result.data.message);
        setIsLoading(false);
        setIsShowRemoveProjectsModal(false);
        updateContext();
      })
      .catch((error) => {
        setIsLoading(false);
        toast.warning(error.message);
      })
      .finally(() => {
        setIsEdit(false);
      });
  };

  const [projectCost, setProjectCost] = useState(199);

  const [isTrial, setIsTrial] = useState(company.SubscriptionPlan == "Trial");
  const [isAdmin, setIsAdmin] = useState(
    company.Admins != undefined &&
      Object.keys(company.Admins).includes(user.uid)
  );

  const [trialInfo, setTrialInfo] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [isShowRemoveProjectsModal, setIsShowRemoveProjectsModal] =
    useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [availableCount, setAvailableCount] = useState(0);

  const [paymentDate, setPaymentDate] = useState("");
  const [invoiceList, setInvoiceList] = useState({});

  const getFormatData = (dateString: any) => {
    let date = new Date(dateString);

    let year = date.getFullYear(); // Subtract 1 year to get 2023
    let month = date.getMonth() + 1; // Add 1 to get 1-based month
    let day = date.getDate(); // Add 1 to get the next day

    let formattedDate = `${year}/${month}/${day}`;
    if (Number.isNaN(year)) return "";
    return formattedDate;
  };

  const getTrialInfo = (companyKey) => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `free-trials/${companyKey}`))
      .then((snapshot: any) => {
        if (snapshot.exists()) {
          setTrialInfo(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  useEffect(() => {
    setIsTrial(company.SubscriptionPlan == "Trial");
    setIsAdmin(
      company.Admins != undefined &&
        Object.keys(company.Admins).includes(user.uid)
    );
    if (isTrial) {
      getTrialInfo(profile.CompanyKey);
    } else {
      setCompanyProjectCount(
        company.SubscriptionDetails != undefined
          ? company.SubscriptionDetails.projectQuantity
          : 0
      );
      setAvailableCount(
        Math.max(
          0,
          (company.SubscriptionDetails != undefined
            ? company.SubscriptionDetails.projectQuantity
            : 0) -
            (company.ProjectDirectory == undefined
              ? 0
              : Object.keys(company.ProjectDirectory).length)
        )
      );

      fetch("/api/stripe/getSubscription", {
        method: "POST",
        body: JSON.stringify({
          subscriptionId: company.SubscriptionDetails.stripeSubscriptionId,
        }),
      }).then((result) => {
        result.json().then((res) => {
          setPaymentDate(
            getFormatData(
              new Date(res.subscription.current_period_end * 1000).toString()
            )
          );
        });
      });

      fetch("/api/stripe/getInvoiceList", {
        method: "POST",
        body: JSON.stringify({
          subscriptionId: company.SubscriptionDetails.stripeSubscriptionId,
        }),
      }).then((result) => {
        result.json().then((res) => {
          setInvoiceList(res.invoices);
          console.log(res.invoices);
        });
      });

      setSelectedProjects(
        new Array(
          (company.SubscriptionDetails != undefined
            ? company.SubscriptionDetails.projectQuantity
            : 0) -
            (company.ProjectDirectory == undefined
              ? 0
              : company.ProjectDirectory == undefined
              ? 0
              : Object.keys(company.ProjectDirectory).length)
        ).fill(false)
      );
    }
  }, [profile, company]);

  return (
    <div className="flex min-h-[100vh] w-auto h-full">
      <SideBar index={4} />
      {isSide && <ReSideBar index={4} hide={setIsSide} />}
      {!isSide && (
        <div className="absolute lg:left-[320px] lg:w-panel w-full min-h-[100vh] h-fit bg-gray-4">
          <Header title={"Edit Subscription"} />
          <ReHeader title={"Edit Subscription"} index={5} show={setIsSide} />
          <div className="m-[32px] flex flex-wrap sm:justify-start justify-center">
            <div className="flex flex-col">
              <div className="px-[32px] py-[10px] flex">
                <Link
                  href={"/subscription"}
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
              <div className="w-[360px] flex flex-col justify-start items-center mr-[32px]">
                <p className="text-gray-10 font-small mb-[13px]">
                  My Current Plan
                </p>
                <div className="w-full rounded-[26px] bg-gray-3">
                  <div className="text-white  text-ssmall flex justify-center p-[14px] mb-[10px] border-b-[2px] border-gray-6 rounded-t-[26px] font-bold">
                    {isTrial ? "Trial" : "Enterprise"}
                  </div>
                  <div className="flex flex-row px-[22px] py-[10px] items-center">
                    <div className="w-[32px] h-[32px] mx-[20px]">
                      <Image
                        src={projectIcon}
                        width={32}
                        height={32}
                        alt="project icon"
                      />
                    </div>
                    <p className="text-white text-primary font-bold">
                      {isTrial ? 1 : companyProjectCount} Could-Hosted Project
                    </p>
                  </div>
                  <div className="flex flex-row px-[22px] py-[10px]">
                    <div className="w-[32px] h-[32px] mx-[20px]">
                      <Image
                        src={modelIcon}
                        width={32}
                        height={32}
                        alt="model icon"
                      />
                    </div>
                    <p className="text-white text-primary font-bold">
                      {company.SubscriptionPlan == "Trial"
                        ? "3 Models"
                        : "Unlimited Models"}
                    </p>
                  </div>
                  <div className="flex flex-row px-[22px] py-[10px]">
                    <div className="w-[32px] h-[32px] mx-[20px]">
                      <Image
                        src={viewIcon}
                        width={32}
                        height={32}
                        alt="model icon"
                      />
                    </div>
                    <p className="text-white text-primary font-bold">
                      Free Viewing For Everyone
                    </p>
                  </div>
                  {isTrial ? (
                    <>
                      <p className="text-gray-10 text-primary text-center font-light mt-[10px]">
                        Trial end date
                      </p>
                      <p className="text-white text-primary text-center font-light">
                        {getFormatData(trialInfo.trialEndDate) == ""
                          ? "Hasn't started free trial yet."
                          : getFormatData(trialInfo.trialEndDate)}
                      </p>
                      <p className="text-gray-5 text-ssmall text-center font-bold mt-[5px] mb-[25px]">
                        $0.00/Month
                      </p>
                    </>
                  ) : (
                    <>
                      {isAdmin ? (
                        <div className="flex justify-center flex-col items-center">
                          <p className="text-gray-10 text-primary text-center font-light mt-[10px]">
                            $
                            {(
                              companyProjectCount *
                              12 *
                              projectCost
                            ).toLocaleString()}{" "}
                            per year
                          </p>
                          <p className="text-gray-5 text-2xsmall text-center font-bold mt-[5px] mb-[10px]">
                            Next payment due
                          </p>
                          <p className="text-red-primary text-ssmall text-center font-bold mb-[10px]">
                            {paymentDate}
                          </p>
                          <button
                            className="text-center mb-[20px] bg-gray-7-5 rounded-[27px] px-[50px] py-[10px] text-white"
                            onClick={() => {
                              setIsShowBillingDetailsModal(true);
                            }}
                          >
                            View Invoices
                          </button>
                          <button
                            className="text-center mb-[20px] bg-gray-7-5 rounded-[27px] px-[50px] py-[10px] text-white"
                            onClick={() => {
                              setIsShowBillingDetailsModal(true);
                            }}
                          >
                            Edit Billing Details
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col justify-center items-center">
                          <p className="text-gray-10 text-small">
                            Subscription Managed by
                          </p>
                          <p className="text-ssmall text-gray-5 mb-[50px]">
                            {company.CompanyName}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            {isAdmin && (
              <>
                <div className="w-full md:w-[640px] flex flex-col items-center">
                  <div className="mt-[10px] mb-[10px] text-small text-white font-bold flex">
                    My Company Projects
                  </div>
                  <div className="w-full md:w-[640px] pl-[25px] pr-[5px] py-[11px]">
                    <div className="grid grid-cols-4 md:grid-cols-7 flex items-end">
                      <p className="font-small text-gray-10 col-span-3 font-light">
                        Project Name
                      </p>
                      <p className="font-small text-gray-10 col-span-3 font-light hidden md:block">
                        Company Region
                      </p>
                      <button
                        className="font-small text-white col-span-1 font-light px-[15px] py-[5px] bg-gray-5 rounded-[20px] flex items-center justify-center"
                        onClick={() => {
                          if (isEdit == false) {
                            setSelectedProjects(
                              new Array(availableCount).fill(false)
                            );
                            setIsEdit(true);
                          } else {
                            setIsEdit(false);
                          }
                        }}
                      >
                        {!isEdit && (
                          <Image
                            src={editIcon}
                            width={15}
                            height={15}
                            alt="edit"
                            className=" w-[15px] h-[15px]"
                          />
                        )}
                        {!isEdit ? "Edit" : "Cancel"}
                      </button>
                    </div>
                  </div>

                  <div
                    className={
                      "w-full md:w-[620px] flex flex-col bg-gray-3 h-ttable rounded-[24px] overflow-y-auto " +
                      (company.ProjectDirectory == undefined ||
                      Object.keys(company.ProjectDirectory).length == 0
                        ? "items-center"
                        : "")
                    }
                  >
                    {company.ProjectDirectory != null &&
                      company.ProjectDirectory != undefined &&
                      Object.keys(company.ProjectDirectory).map((key, id) => {
                        return (
                          <div
                            className={
                              "grid grid-cols-4 md:grid-cols-7 p-[10px] border-b-[1px] border-gray-4 hover:bg-gray-7 px-[22px]" +
                              (id == 0 ? " rounded-t-[24px]" : "")
                            }
                            key={id}
                          >
                            <p className="text-white col-span-3 font-light flex items-center">
                              {company.ProjectDirectory[key].ProjectTitle}
                            </p>
                            <p className="text-white col-span-3 font-light hidden md:block">
                              {company.ProjectDirectory[key].ProjectLocation}
                            </p>
                            <p className="text-white col-span-1 font-light"></p>
                          </div>
                        );
                      })}
                    {selectedProjects.map((key, id) => {
                      return (
                        <div
                          className={
                            "grid grid-cols-4 md:grid-cols-7 p-[10px] border-b-[1px] border-gray-4 hover:bg-gray-7 px-[22px] flex items-center w-full" +
                            (companyProjectCount == selectedProjects.length &&
                            id == 0
                              ? " rounded-t-[24px]"
                              : "")
                          }
                          key={id}
                        >
                          <p className="col-span-3 font-light flex items-center text-gray-5">
                            Available Project
                          </p>
                          <p className="text-white col-span-3 font-light hidden md:block"></p>
                          {isEdit && (
                            <div className="flex items-center justify-end mr-[20px] col-span-1">
                              <input
                                type="checkbox"
                                className=" mx-[10px]  focus:ring-0 focus:bg-gray-10 focus:border-none focus:outline-none active:bg-gray-10 ring-0"
                                checked={selectedProjects[id]}
                                onClick={(e) => {
                                  let arr = [...selectedProjects];
                                  arr[id] = e.target.checked;
                                  setSelectedProjects(arr);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="relative flex flex-col md:flex-row items-center w-full justify-center mt-[10px]">
                    <div className="max-w-[300px] text-center text-gray-10">
                      In order to remove active projects, please visit the{" "}
                      <Link href={"/project"} className="text-gray-11">
                        Project Management
                      </Link>{" "}
                      panel.
                    </div>
                    {isEdit && (
                      <button
                        className="md:absolute right-0 bg-red-primary px-[20px] py-[10px] text-white rounded-[20px] flex items-center"
                        onClick={() => {
                          setIsShowRemoveProjectsModal(true);
                        }}
                      >
                        <Image
                          src={trashIcon}
                          width={15}
                          height={15}
                          alt="trash"
                          className="mr-[5px]"
                        />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {isShowRemoveProjectsModal && (
        <div
          id="modal_single"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[520px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowRemoveProjectsModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  Remove projects
                </h3>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowRemoveProjectsModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="mx-[50px] my-[10px] flex flex-col justify-center">
                <p className="text-small text-gray-10 m-2 text-center">
                  Are you sure you would like to remove{" "}
                  <label className="text-medium text-white">
                    {selectedProjects.filter((item) => item == true).length}
                  </label>{" "}
                  projects from your enterprise subscription?
                </p>
              </div>
              <div className="mx-[50px] my-[10px] flex flex-col justify-center">
                <p className="text-small text-gray-10 m-2 text-center">
                  Current billing: $
                  {(companyProjectCount * projectCost * 12).toLocaleString()}{" "}
                  per year
                </p>
                <p className="text-small text-gray-10 m-2 text-center">
                  -${(projectCost * 12).toLocaleString()} per project
                </p>
                <p className="text-small text-white m-2 text-center">
                  New Subscription: $
                  {(
                    (companyProjectCount -
                      selectedProjects.filter((item) => item == true).length) *
                    projectCost *
                    12
                  ).toLocaleString()}{" "}
                  per year
                </p>
              </div>
              <div className="flex justify-center items-center p-4 md:p-5">
                <button
                  disabled={isLoading}
                  type="button"
                  className="flex justify-center items-center rounded-[24px] text-white bg-gray-5 px-[30px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 mx-[20px]"
                  onClick={() => {
                    setIsShowRemoveProjectsModal(false);
                  }}
                >
                  <p>Cancel</p>
                </button>
                <button
                  type="button"
                  className="bg-red-primary flex justify-center items-center rounded-[24px] text-white px-[30px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 mx-[30px]"
                  onClick={handleRemoveProjects}
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
                  <p>Remove projects</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isShowBillingDetailsModal && (
        <div
          id="modal_single"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[620px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowBillingDetailsModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  Billing Details
                </h3>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowBillingDetailsModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="mx-[20px] my-[20px] flex flex-col rounded-[26px] h-[430px] ">
                <div className="grid grid-cols-7">
                  <p className="col-span-2 text-center text-gray-10">Date</p>
                  <p className="col-span-2 text-center text-gray-10"> Name </p>
                  <p className="col-span-2 text-center text-gray-10">Amount</p>
                  <p className="col-span-1 text-center text-gray-10">Status</p>
                </div>
                <div className="bg-gray-3 rounded-[26px] h-[400px]">
                  {invoiceList.data != undefined &&
                    invoiceList.data.map((item, id) => {
                      return (
                        <div
                          className="grid grid-cols-7 my-[10px] border-b-[1px] border-gray-4"
                          key={id}
                        >
                          <p className="col-span-2 text-center text-gray-10 mb-0">
                            {new Date(
                              item.effective_at * 1000
                            ).toLocaleDateString()}
                          </p>
                          <p className="col-span-2 text-center text-gray-10 mb-0">
                            {item.account_name}
                          </p>
                          <p className="col-span-2 text-center text-gray-10 mb-0">
                            {item.amount_paid}
                          </p>
                          <p className="col-span-1 text-center text-gray-10 mb-0">
                            {item.paid ? "Paid" : ""}
                          </p>
                        </div>
                      );
                    })}
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

export default EditSubscriptionPage;
