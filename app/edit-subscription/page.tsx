"use client";

import Header from "@/components/headers/header";
import SideBar from "@/components/sidebars/sidebar";

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

import paymentIcons from "../../public/icons/PaymentIcons.png";
import securityIcon from "../../public/icons/CVV-Icon.png";

import { useEffect, useMemo, useState } from "react";
import ReSideBar from "@/components/sidebars/residebar";
import ReHeader from "@/components/headers/reheader";
import { useGlobalContext } from "@/contexts/state";
import { child, get, getDatabase, ref } from "firebase/database";

import firebase_app from "../../firebase";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const database = getDatabase(firebase_app);

import { getFunctions, httpsCallable } from "firebase/functions";

import { loadStripe } from "@stripe/stripe-js";
import {
  AddressElement,
  CardCvcElement,
  CardElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import countryList from "react-select-country-list";

import Stripe from "stripe";
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

import Link from "next/link";

const functions = getFunctions();
const cRemoveProjectsFromEnterprise = httpsCallable(
  functions,
  "removeProjectsFromEnterprise"
);

const cUpdateBillingDetails = httpsCallable(functions, "updateBillingDetails");

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#DFDFDF",
      fontSize: "16px",
      fontFamily: '"Open Sans", sans-serif',
      bacgroundColor: "#fff",
      letterSpacing: "0.025em",
      "::placeholder": {
        color: "#6b7280",
      },
      invalid: {
        color: "#a0a0a0",
        ":focus": {
          color: "#707070",
        },
      },
    },
  },
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

const EditSubscriptionPage = () => {
  const [isSide, setIsSide] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const [activeTab, setActiveTab] = useState("PROJECT_SUBSCRIPTIONS");

  const [members, setMembers] = useState<any>({});

  const {
    isMaster,
    inputUserId,
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

  const [isShowUpdateBillingDetails, setIsShowUpdateBillingDetails] =
    useState(false);

  const [billingStep, setBillingStep] = useState(0);
  const continueBillingStep = () => {
    if (firstName == "") {
      toast.warning("Please input first name");
      return;
    }
    if (secondName == "") {
      toast.warning("Please input second name");
      return;
    }
    if (streetAddress == "") {
      toast.warning("Please input street address");
      return;
    }
    if (city == "") {
      toast.warning("Please input city");
      return;
    }
    if (state == "") {
      toast.warning("Please input state");
      return;
    }
    if (ZIP == "") {
      toast.warning("Please input zip");
      return;
    }
    if (email == "") {
      toast.warning("Please input email");
      return;
    }
    if (phoneNumber == "") {
      toast.warning("Please input phone number");
      return;
    }
    setBillingStep(1);
  };
  const resetBillingStep = (callback: any) => {
    fetch("/api/stripe/getCustomer", {
      method: "POST",
      body: JSON.stringify({
        customerId: company.SubscriptionDetails.customerId,
      }),
    }).then((result) => {
      result.json().then((res: any) => {
        setFirstName(
          res.customer.name.split(" ")[0] || profile.DisplayName.split(" ")[0]
        );
        setSecondName(
          res.customer.name.split(" ")[1] || profile.DisplayName.split(" ")[1]
        );
        setStreetAddress(res.customer?.address?.line1 || "");
        setStreetAddress2(res.customer?.address?.line2 || "");
        setCity(res.customer?.address?.city || "");
        setState(res.customer?.address?.state || "");
        setZIP(res.customer?.address?.postal_code || "");
        setCountry(res.customer?.address?.country || "US");
        setEmail(res.customer.email || "");
        setPhoneNumber(res.customer.phone || "");
        setBillingStep(0);
        console.log(callback);
        callback();
      });
    });
  };

  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [streetAddress2, setStreetAddress2] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [ZIP, setZIP] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [aCountryList, setACountryList] = useState<any>([]);

  const options = useMemo(() => {
    setACountryList(countryList().getData());
  }, []);

  const updateBillingDetails = () => {
    if (!stripe || !elements) {
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (cardNumberElement) {
      setIsLoading(true);
      stripe
        .createPaymentMethod({
          type: "card",
          card: cardNumberElement,
        })
        .then((result: any) => {
          console.log(result);
          if (result.error) {
            setIsLoading(false);
            toast.warning(result.error.message);
            return;
          }
          let data: any = {
            paymentMethodId: result.paymentMethod.id,
            billingDetails: {
              name: firstName + " " + secondName,
              phoneNumber: phoneNumber,
              email: email,
              addressLine1: streetAddress,
              addressLine2: streetAddress2,
              addressCity: city,
              addressState: state,
              addressCountry: country,
              addressZip: ZIP,
            },
          };
          if (isMaster) {
            data["inputUserId"] = inputUserId;
          }
          cUpdateBillingDetails(data)
            .then((res: any) => {
              toast.success(res.data.message);
              setIsLoading(false);
              setIsShowUpdateBillingDetails(false);
              updateContext();
            })
            .catch((error) => {
              setIsLoading(false);
            });
        })
        .catch((error) => {
          toast.warning(error.message);
          setIsLoading(false);
        });
    }
  };

  const [companyProjectCount, setCompanyProjectCount] = useState(
    company.SubscriptionDetails != undefined
      ? company.SubscriptionDetails.projectQuantity
      : 0
  );

  const [selectedProjects, setSelectedProjects] = useState([]);

  const [isShowInvoiceModal, setIshowInvoiceModal] = useState(false);

  const handleRemoveProjects = () => {
    setIsLoading(true);
    let data: any = {
      numProjectsToRemove: selectedProjects.filter((item) => item == true)
        .length,
    };
    if (isMaster) {
      data["inputUserId"] = inputUserId;
    }
    cRemoveProjectsFromEnterprise(data)
      .then((result: any) => {
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
      Object.keys(company.Admins).includes(isMaster ? inputUserId : user.uid)
  );

  const [trialInfo, setTrialInfo] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [isShowRemoveProjectsModal, setIsShowRemoveProjectsModal] =
    useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [availableCount, setAvailableCount] = useState(0);

  const [paymentDate, setPaymentDate] = useState("");
  const [invoiceList, setInvoiceList] = useState({});
  const [paymentList, setPaymentList] = useState([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState("");

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
          console.log(res)
          setPaymentDate(
            getFormatData(
              new Date(res.subscription.current_period_end * 1000).toString()
            )
          );
        });
      });

      fetch("/api/stripe/getCards", {
        method: "POST",
        body: JSON.stringify({
          customerId: company.SubscriptionDetails.customerId,
        }),
      }).then((result) => {
        result.json().then((res) => {
          setPaymentList(res.cardDetails);
        });
      });

      fetch("/api/stripe/getInvoiceList", {
        method: "POST",
        body: JSON.stringify({
          customerId: company.SubscriptionDetails.customerId,
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
          <div className="m-[32px] flex flex-wrap justify-start">
            <div className="flex flex-col">
              <div className="px-[0px] py-[10px] flex">
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
            </div>
          </div>
          <div className="flex mx-[32px] mb-0">
            <div
              className={
                (activeTab == "PROJECT_SUBSCRIPTIONS"
                  ? "bg-gray-3"
                  : "bg-gray-4") +
                " px-[50px] py-[17px] text-white rounded-t-[17px] cursor-pointer"
              }
              onClick={() => {
                setActiveTab("PROJECT_SUBSCRIPTIONS");
              }}
            >
              Project Subscriptions
            </div>
            <div
              className={
                (activeTab == "ORDER_HISTORY" ? "bg-gray-3" : "bg-gray-4") +
                " px-[50px] py-[17px] text-white rounded-t-[17px] cursor-pointer"
              }
              onClick={() => {
                setActiveTab("ORDER_HISTORY");
              }}
            >
              Order History
            </div>
            <div
              className={
                (activeTab == "PAYMENT_METHODS" ? "bg-gray-3" : "bg-gray-4") +
                " px-[50px] py-[17px] text-white rounded-t-[17px] cursor-pointer"
              }
              onClick={() => {
                setActiveTab("PAYMENT_METHODS");
              }}
            >
              Payment methods
            </div>
          </div>
          {activeTab == "PROJECT_SUBSCRIPTIONS" && (
            <>
              {" "}
              <div
                className={
                  "max-w-[1200px] mx-[32px] mt-0 mb-[11px] py-[17px] px-[30px] bg-gray-3 rounded-b-[24px] rounded-tr-[17px] " +
                  (activeTab == "PROJECT_SUBSCRIPTIONS"
                    ? "rounded-tl-[0px]"
                    : "rounded-tl-[17px]")
                }
              >
                <div className="flex justify-start w-fit gap-2 mb-3">
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
                    {!isEdit ? "Edit" : "Done"}
                  </button>
                  {isEdit && (
                    <button
                      className="bg-red-primary px-[15px] py-[5px] text-white rounded-[20px] flex items-center"
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
                <div className="grid grid-cols-2 md:grid-cols-9 border-b-[1px] border-solid">
                  <p className="font-small text-gray-10 col-span-1 font-light"></p>
                  <p className="font-small text-gray-10 col-span-2 font-light">
                    Project Name
                  </p>
                  <p className="font-small text-gray-10 col-span-2 font-light">
                    Company Region
                  </p>
                  <p className="font-small text-gray-10 col-span-2 font-light hidden md:block">
                    Billing Date
                  </p>
                  <p className="font-small text-gray-10 col-span-2 font-light">
                    Payment Method
                  </p>
                </div>
                <div className="flex flex-col bg-gray-3 h-ttable">
                  {isAdmin && (
                    <>
                      <div
                        className={
                          "w-full flex flex-col bg-gray-3 h-ttable overflow-y-auto " +
                          (company.ProjectDirectory == undefined ||
                          Object.keys(company.ProjectDirectory).length == 0
                            ? "items-center"
                            : "")
                        }
                      >
                        {company.ProjectDirectory != null &&
                          company.ProjectDirectory != undefined &&
                          Object.keys(company.ProjectDirectory).map(
                            (key, id) => {
                              return (
                                <div
                                  className={
                                    "grid grid-cols-4 md:grid-cols-9 py-[10px] border-b-[1px] border-gray-4 hover:bg-gray-7"
                                  }
                                  key={id}
                                >
                                  <p className="text-white col-span-1 font-light flex items-center"></p>
                                  <p className="text-white col-span-2 font-light flex items-center">
                                    {company.ProjectDirectory[key].ProjectTitle}
                                  </p>
                                  <p className="text-white col-span-2 font-light hidden md:block">
                                    {
                                      company.ProjectDirectory[key]
                                        .ProjectLocation
                                    }
                                  </p>
                                  <p className="text-white col-span-2 font-light"></p>
                                  <p className="text-white col-span-2 font-light"></p>
                                </div>
                              );
                            }
                          )}
                        {selectedProjects.map((key, id) => {
                          return (
                            <div
                              className={
                                "grid grid-cols-4 md:grid-cols-9 py-[10px] border-b-[1px] border-gray-4 hover:bg-gray-7"
                              }
                              key={id}
                            >
                              {isEdit ? (
                                <div className="flex items-center justify-center mr-[20px] col-span-1">
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
                              ) : (
                                <div className="flex items-center justify-end mr-[20px] col-span-1"></div>
                              )}
                              <div
                                className={
                                  "col-span-2 md:col-span-2 hover:bg-gray-7 flex items-center w-full text-gray-5"
                                }
                                key={id}
                              >
                                Available Project
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="max-w-[1200px] relative flex flex-col md:flex-row items-center w-full justify-center mt-[10px]">
                <div className="max-w-[300px] text-center text-gray-10">
                  In order to remove active projects, please visit the{" "}
                  <Link href={"/project"} className="text-gray-11">
                    Project Management
                  </Link>{" "}
                  panel.
                </div>
              </div>
            </>
          )}
          {activeTab == "ORDER_HISTORY" && (
            <>
              {" "}
              <div
                className={
                  "max-w-[1200px] mx-[32px] mt-0 mb-[11px] py-[17px] px-[30px] bg-gray-3 rounded-b-[24px] rounded-tr-[17px] rounded-tl-[17px]"
                }
              >
                <div className="mx-[20px] my-[20px] flex flex-col rounded-[26px] h-[430px] ">
                  <div className="grid grid-cols-7 md:grid-cols-8 border-b-[1px] border-solid">
                    <p className="col-span-2 text-center text-gray-10">Date</p>
                    <p className="col-span-2 text-center text-gray-10">Email</p>
                    <p className="col-span-2 text-center text-gray-10">
                      Amount
                    </p>
                    <p className="col-span-2 text-center text-gray-10">
                      Status
                    </p>
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
                              {item.customer_email}
                            </p>
                            <p className="col-span-2 text-center text-gray-10 mb-0">
                              {item.amount_paid}
                            </p>
                            <p className="col-span-2 text-center text-gray-10 mb-0">
                              {item.paid ? "Paid" : ""}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
              <div className="max-w-[1200px] relative flex flex-col md:flex-row items-center w-full justify-center mt-[10px]">
                <div className="max-w-[300px] text-center text-gray-10">
                  In order to remove active projects, please visit the{" "}
                  <Link href={"/project"} className="text-gray-11">
                    Project Management
                  </Link>{" "}
                  panel.
                </div>
              </div>
            </>
          )}
          {activeTab == "PAYMENT_METHODS" && (
            <>
              {" "}
              <div
                className={
                  "max-w-[1200px] mx-[32px] mt-0 mb-[11px] py-[17px] px-[30px] bg-gray-3 rounded-b-[24px] rounded-tr-[17px] rounded-tl-[17px]"
                }
              >
                <div className="flex justify-start w-fit gap-2 mb-3">
                  <button
                    className="font-small text-white col-span-1 font-light px-[15px] py-[5px] bg-gray-5 rounded-[20px] flex items-center justify-center"
                    onClick={() => {}}
                  >
                    Add Payment Methods
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-11 border-b-[1px] border-solid">
                  <p className="font-small text-gray-10 col-span-1 font-light"></p>
                  <p className="font-small text-gray-10 col-span-2 font-light">
                    Method Type
                  </p>
                  <p className="font-small text-gray-10 col-span-2 font-light">
                    Method Details
                  </p>
                  <p className="font-small text-gray-10 col-span-2 font-light hidden md:block">
                    Exp. Date
                  </p>
                  <p className="font-small text-gray-10 col-span-4 font-light"></p>
                </div>
                <div className="flex flex-col bg-gray-3 h-ttable">
                  {isAdmin && (
                    <>
                      <div
                        className={
                          "w-full flex flex-col bg-gray-3 h-ttable overflow-y-auto "
                        }
                      >
                        {paymentList.map((paymentMethod: any, id) => {
                          return (
                            <div
                              className={
                                "grid grid-cols-4 md:grid-cols-11 py-[10px] border-b-[1px] border-gray-4 hover:bg-gray-7"
                              }
                              key={id}
                            >
                              <div
                                className={
                                  "col-span-1 md:col-span-1 hover:bg-gray-7 flex items-center w-full text-white"
                                }
                              >
                                {paymentMethod.isDefaultCard ? "Primary" : ""}
                              </div>
                              <div
                                className={
                                  "col-span-2 md:col-span-2 hover:bg-gray-7 flex items-center w-full text-white"
                                }
                              >
                                {paymentMethod.cardType}
                              </div>
                              <div
                                className={
                                  "col-span-2 md:col-span-2 hover:bg-gray-7 flex items-center w-full text-white"
                                }
                              >
                                {paymentMethod.last4}
                              </div>
                              <div
                                className={
                                  "col-span-2 md:col-span-2 hover:bg-gray-7 flex items-center w-full text-white"
                                }
                              >
                                {paymentMethod.expDate}
                              </div>
                              <div
                                className={
                                  "col-span-4 md:col-span-2 hover:bg-gray-7 flex items-center w-full text-white gap-3"
                                }
                              >
                                {paymentMethod.isDefaultCard ? (
                                  <></>
                                ) : (
                                  <>
                                    <button
                                      disabled={isLoading}
                                      className="text-white col-span-1 font-light px-[20px] py-[1px] bg-gray-5 rounded-[20px] flex items-center justify-center w-fit"
                                      onClick={() => {
                                        setSelectedPaymentMethodId(
                                          paymentMethod.method.id
                                        );
                                        setIsLoading(true);
                                        fetch(
                                          "/api/stripe/updateDefaultPaymentMethod",
                                          {
                                            method: "POST",
                                            body: JSON.stringify({
                                              customerId:
                                                company.SubscriptionDetails
                                                  .customerId,
                                              paymentMethodId:
                                                paymentMethod.method.id,
                                            }),
                                          }
                                        )
                                          .then((result) => {
                                            fetch("/api/stripe/getCards", {
                                              method: "POST",
                                              body: JSON.stringify({
                                                customerId:
                                                  company.SubscriptionDetails
                                                    .customerId,
                                              }),
                                            })
                                              .then((result) => {
                                                result.json().then((res) => {
                                                  setPaymentList(
                                                    res.cardDetails
                                                  );
                                                });
                                              })
                                              .finally(() => {
                                                setIsLoading(false);
                                              });
                                          })
                                          .catch((error) => {
                                            setIsLoading(false);
                                          });
                                      }}
                                    >
                                      {isLoading &&
                                        selectedPaymentMethodId ==
                                          paymentMethod.method.id && (
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
                                      <label className="text-xsmall p-0 my-0 cursor-pointer whitespace-nowrap">
                                        Make Primary
                                      </label>
                                    </button>
                                  </>
                                )}
                                <button
                                  className="text-white col-span-1 font-light px-[20px] py-[1px] bg-gray-3-5 rounded-[20px] flex items-center justify-center w-fit"
                                  disabled={isLoading}
                                  onClick={() => {
                                    resetBillingStep(() => {
                                      setIsShowUpdateBillingDetails(true);
                                    });
                                  }}
                                >
                                  <Image
                                    src={editIcon}
                                    width={15}
                                    height={15}
                                    alt="Edit Payment Method"
                                  />
                                  <label className="text-xsmall p-0 mx-1 my-0 cursor-pointer whitespace-nowrap">
                                    Edit
                                  </label>
                                </button>
                                <button
                                  className="bg-red-primary px-[20px] py-[1px] text-white rounded-[20px] flex items-center justify-center w-fit"
                                  disabled={isLoading}
                                >
                                  <Image
                                    src={trashIcon}
                                    width={15}
                                    height={15}
                                    alt="trash"
                                  />
                                  <label className="text-xsmall p-0 mx-1 my-0 cursor-pointer whitespace-nowrap">
                                    Remove
                                  </label>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="max-w-[1200px] relative flex flex-col md:flex-row items-center w-full justify-center mt-[10px]">
                <div className="max-w-[300px] text-center text-gray-10">
                  In order to remove active projects, please visit the{" "}
                  <Link href={"/project"} className="text-gray-11">
                    Project Management
                  </Link>{" "}
                  panel.
                </div>
              </div>
            </>
          )}
          {/* <div className="flex flex-wrap sm:justify-start justify-center">
            <div className="flex flex-col w-full sm:w-auto mb-[80px] mx-[32px]">
              <div className="sm:w-[360px] flex flex-col justify-start items-center sm:mr-[32px]">
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
                              setIshowInvoiceModal(true);
                            }}
                          >
                            View Invoices
                          </button>
                          <button
                            className="text-center mb-[20px] bg-gray-7-5 rounded-[27px] px-[50px] py-[10px] text-white"
                            onClick={() => {
                              resetBillingStep(() => {
                                setIsShowUpdateBillingDetails(true);
                              });
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
                <div className="w-full md:w-[640px] flex flex-col items-center mt-[-70px] mx-[32px]">
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
                      "w-full md:w-[640px] flex flex-col bg-gray-3 h-ttable rounded-[24px] overflow-y-auto " +
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
                    <div className="max-w-[300px] text-center text-gray-10">
                      In order to remove active projects, please visit the{" "}
                      <Link href={"/project"} className="text-gray-11">
                        Project Management
                      </Link>{" "}
                      panel.
                    </div>
                  </div>
                </div>
              </>
            )}
          </div> */}
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
      {isShowInvoiceModal && (
        <div
          id="modal_single"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[620px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIshowInvoiceModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  Billing Details
                </h3>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIshowInvoiceModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="mx-[20px] my-[20px] flex flex-col rounded-[26px] h-[430px] ">
                <div className="grid grid-cols-7">
                  <p className="col-span-2 text-center text-gray-10">Date</p>
                  <p className="col-span-2 text-center text-gray-10"> Email </p>
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
                            {item.customer_email}
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
      {isShowUpdateBillingDetails && (
        <div
          id="modal_single"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[500px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowUpdateBillingDetails(false)}
            ></div>
            <div
              className={
                "relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6" +
                (billingStep == 0 ? " hidden" : "")
              }
            >
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  Billing Details
                </h3>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowUpdateBillingDetails(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="px-[25px] py-[20px] flex flex-col">
                <button
                  className="text-small px-[10px] py-[5px] flex items-center bg-gray-2 w-fit rounded-[29px]"
                  onClick={() => {
                    setBillingStep(0);
                  }}
                >
                  <Image
                    src={backIcon}
                    width={10}
                    height={15}
                    alt="back"
                    className="mr-[10px] transform rotate-90"
                  />{" "}
                  <p className="text-xsmall font-semibold text-white">Back</p>
                </button>
              </div>
              <div className="flex flex-col justify-center items-center p-4 md:p-5">
                <p className="text-white mb-[20px] px-[10px] text-left w-full font-bold">
                  Payment Method
                </p>
                <div className="grid grid-cols-12 w-full gap-4">
                  <div className="col-span-8 flex flex-col">
                    <div className=" ml-3 text-white text-xsmall">
                      Card Number *
                    </div>
                    <div className="pl-4 bg-gray-3 text-gray-11 text-2xsmall placeholder:italic rounded-[20px] focus:border-none outline-none shadown-none border-none focus:shadow-none focus:ring-0 w-full py-[10px]">
                      <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                  </div>
                  <div className="col-span-4 flex flex-col justify-end mb-[3px]">
                    <Image
                      src={paymentIcons}
                      alt="paymentIcons"
                      width={180}
                      height={60}
                    />
                  </div>
                  <div className="col-span-12 flex flex-col">
                    <div className=" ml-3 text-white text-xsmall">
                      Expiration *
                    </div>
                    <div className="pl-4 bg-gray-3 text-gray-11 text-2xsmall placeholder:italic rounded-[20px] focus:border-none outline-none shadown-none border-none focus:shadow-none focus:ring-0 w-full py-[10px]">
                      <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                    {/* <input
                      type="text"
                      className=" pl-4 bg-gray-3 text-gray-11 text-2xsmall placeholder:italic rounded-[20px] focus:border-none outline-none shadown-none border-none focus:shadow-none focus:ring-0 w-full"
                      placeholder="123 Main St..."
                    /> */}
                  </div>
                  <div className="col-span-10 flex flex-col">
                    <div className=" ml-3 text-white text-xsmall">
                      Security Code
                    </div>
                    <div className="pl-4 bg-gray-3 text-gray-11 text-2xsmall placeholder:italic rounded-[20px] focus:border-none outline-none shadown-none border-none focus:shadow-none focus:ring-0 w-full py-[10px]">
                      <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                  </div>
                  <div className="col-span-2 flex flex-col justify-end">
                    <Image
                      src={securityIcon}
                      alt="security icon"
                      width={100}
                      height={80}
                    />
                  </div>
                </div>
                <div className="flex justify-center items-center p-4 md:p-5">
                  <button
                    disabled={isLoading}
                    type="button"
                    className="flex justify-center items-center rounded-[24px] text-white bg-gray-5 px-[30px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 w-[150px] blur-6 mx-[20px]"
                    onClick={() => {
                      setIsShowUpdateBillingDetails(false);
                    }}
                  >
                    <p>Cancel</p>
                  </button>
                  <button
                    type="button"
                    className="flex justify-center items-center rounded-[24px] text-white bg-red-primary px-[30px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 w-[250px] blur-6 mx-[20px]"
                    onClick={() => {
                      updateBillingDetails();
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
            <div
              className={
                "relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6" +
                (billingStep == 1 ? " hidden" : "")
              }
            >
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  Billing Details
                </h3>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowUpdateBillingDetails(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="flex flex-col justify-center items-center p-4 md:p-5">
                <p className="text-white mb-[20px] px-[10px] text-left w-full font-bold">
                  Billing Address
                </p>
                <div className="grid grid-cols-12 w-full gap-4">
                  <div className="col-span-6 flex flex-col">
                    <div className=" ml-3 text-white text-xsmall">
                      First Name *
                    </div>
                    <input
                      type="text"
                      className=" pl-4 bg-gray-3 text-gray-11 text-2xsmall placeholder:italic rounded-[20px] focus:border-none outline-none shadown-none border-none focus:shadow-none focus:ring-0 w-full"
                      placeholder="John"
                      value={firstName}
                      onChange={(e: any) => {
                        setFirstName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-span-6 flex flex-col">
                    <div className=" ml-3 text-white text-xsmall">
                      Last Name *
                    </div>
                    <input
                      type="text"
                      className=" pl-4 bg-gray-3 text-gray-11 text-2xsmall placeholder:italic rounded-[20px] focus:border-none outline-none shadown-none border-none focus:shadow-none focus:ring-0 w-full"
                      placeholder="Doe"
                      value={secondName}
                      onChange={(e: any) => {
                        setSecondName(e.target.value);
                      }}
                    />
                  </div>

                  <div className="col-span-12 flex flex-col">
                    <div className=" ml-3 text-white text-xsmall">
                      Street Address *
                    </div>
                    <input
                      type="text"
                      className=" pl-4 bg-gray-3 text-gray-11 text-2xsmall placeholder:italic rounded-[20px] focus:border-none outline-none shadown-none border-none focus:shadow-none focus:ring-0 w-full"
                      placeholder="123 Main St..."
                      value={streetAddress}
                      onChange={(e: any) => {
                        setStreetAddress(e.target.value);
                      }}
                    />
                  </div>

                  <div className="col-span-6 flex flex-col">
                    <div className=" ml-3 text-white text-xsmall">
                      Street Address 2 (Optional)
                    </div>
                    <input
                      type="text"
                      className=" pl-4 bg-gray-3 text-gray-11 text-2xsmall placeholder:italic rounded-[20px] focus:border-none outline-none shadown-none border-none focus:shadow-none focus:ring-0 w-full"
                      placeholder="Apt #, Unit, etc."
                      value={streetAddress2}
                      onChange={(e: any) => {
                        setStreetAddress2(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-span-6 flex flex-col">
                    <div className=" ml-3 text-white text-xsmall">
                      Country *
                    </div>
                    <select
                      className="pl-4 bg-gray-3 text-gray-11 text-2xsmall placeholder:italic rounded-[20px] focus:border-none outline-none shadown-none border-none focus:shadow-none focus:ring-0 w-full"
                      value={country}
                      onChange={(e: any) => {
                        setCountry(e.target.value);
                      }}
                    >
                      {aCountryList.map((item: any, id: any) => {
                        return (
                          <option key={id} value={item.value}>
                            {item.label}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="col-span-4 flex flex-col">
                    <div className=" ml-3 text-white text-xsmall">City</div>
                    <input
                      type="text"
                      className=" pl-4 bg-gray-3 text-gray-11 text-2xsmall placeholder:italic rounded-[20px] focus:border-none outline-none shadown-none border-none focus:shadow-none focus:ring-0 w-full"
                      placeholder="Brooklym"
                      value={city}
                      onChange={(e: any) => {
                        setCity(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-span-4 flex flex-col">
                    <div className=" ml-3 text-white text-xsmall">State</div>
                    <input
                      type="text"
                      className=" pl-4 bg-gray-3 text-gray-11 text-2xsmall placeholder:italic rounded-[20px] focus:border-none outline-none shadown-none border-none focus:shadow-none focus:ring-0 w-full"
                      placeholder="NY"
                      value={state}
                      onChange={(e: any) => {
                        setState(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-span-4 flex flex-col">
                    <div className=" ml-3 text-white text-xsmall">ZIP</div>
                    <input
                      type="text"
                      className=" pl-4 bg-gray-3 text-gray-11 text-2xsmall placeholder:italic rounded-[20px] focus:border-none outline-none shadown-none border-none focus:shadow-none focus:ring-0 w-full"
                      placeholder="12345"
                      value={ZIP}
                      onChange={(e: any) => {
                        setZIP(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <p className="text-white mb-[20px] px-[10px] text-left w-full mt-[30px] font-bold">
                  Contact
                </p>
                <div className="grid grid-cols-12 w-full gap-4">
                  <div className="col-span-6 flex flex-col">
                    <div className=" ml-3 text-white text-xsmall">Email *</div>
                    <input
                      type="text"
                      className=" pl-4 bg-gray-3 text-gray-11 text-2xsmall placeholder:italic rounded-[20px] focus:border-none outline-none shadown-none border-none focus:shadow-none focus:ring-0 w-full"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e: any) => {
                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-span-6 flex flex-col">
                    <div className=" ml-3 text-white text-xsmall">
                      Telephone number *
                    </div>
                    <input
                      type="text"
                      className=" pl-4 bg-gray-3 text-gray-11 text-2xsmall placeholder:italic rounded-[20px] focus:border-none outline-none shadown-none border-none focus:shadow-none focus:ring-0 w-full"
                      placeholder="+1-___-___-___"
                      value={phoneNumber}
                      onChange={(e: any) => {
                        setPhoneNumber(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center p-4 md:p-5">
                <button
                  disabled={isLoading}
                  type="button"
                  className="flex justify-center items-center rounded-[24px] text-white bg-gray-5 px-[30px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 w-[150px] blur-6 mx-[20px]"
                  onClick={() => {
                    setIsShowUpdateBillingDetails(false);
                  }}
                >
                  <p>Cancel</p>
                </button>
                <button
                  type="button"
                  className="flex justify-center items-center rounded-[24px] text-white bg-gray-5 px-[30px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 w-[250px] blur-6 mx-[20px]"
                  onClick={continueBillingStep}
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
                  <p>Continue</p>
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

const EditSubscriptionPageWrapper = () => {
  const options = {
    appearance: {},
  };
  return (
    <Elements stripe={stripePromise} options={options}>
      <EditSubscriptionPage />
    </Elements>
  );
};

export default EditSubscriptionPageWrapper;
