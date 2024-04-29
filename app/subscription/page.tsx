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
import supportIcon from "../../public/icons/SupportIcon.png";
import teamIcon from "../../public/icons/TeamIcon.png";
import adminIcon from "../../public/icons/AdminIcon.png";
import brandIcon from "../../public/icons/BrandingIcon.png";
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
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import Stripe from "stripe";
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

import { useRouter } from "next/navigation";

import countryList from "react-select-country-list";

const functions = getFunctions();
const cAddProjectsToEnterprise = httpsCallable(
  functions,
  "addProjectsToEnterprise"
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

const SubscriptionPage = () => {
  const router = useRouter();

  const [isSide, setIsSide] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const [isUpdatePayment, setIsUpdatePayment] = useState(false);

  const { isMaster, inputUserId, user, profile, company, updateContext } =
    useGlobalContext();

  const [projectCount, setProjectCount] = useState(1);
  const [companyProjectCount, setCompanyProjectCount] = useState(
    company.SubscriptionDetails != undefined
      ? company.SubscriptionDetails.projectQuantity
      : 0
  );

  const [projectCost, setProjectCost] = useState(199);

  const [isTrial, setIsTrial] = useState(company.SubscriptionPlan == "Trial");
  const [isAdmin, setIsAdmin] = useState(
    company.Admins != undefined &&
      Object.keys(company.Admins).includes(user.uid)
  );
  const [trialInfo, setTrialInfo] = useState<any>({});
  const [isLoading, setIsLoading] = useState<any>(false);
  const [isShowUpgradeModal, setIsShowUpgradeModal] = useState<any>(false);

  const [isShowUpdateBillingDetails, setIsShowUpdateBillingDetails] =
    useState(false);

  const [paymentDate, setPaymentDate] = useState<any>("");

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
    if (isLoading) return;

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (cardNumberElement) {
      setIsLoading(true);
      stripe
        .createPaymentMethod({
          type: "card",
          card: cardNumberElement,
        })
        .then((result: any) => {
          // console.log(result);
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
              if (isTrial) {
                setIsShowUpgradeModal(true);
              }
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

  const addProjectsToSubscription = () => {
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!isUpdatePayment) {
      let data: any = {
        numProjectsToAdd: projectCount,
      };
      if (isMaster) {
        data["inputUserId"] = inputUserId;
      }
      cAddProjectsToEnterprise(data)
        .then((result: any) => {
          toast.success(result.data.message);
          setIsShowUpgradeModal(false);
          updateContext();
          setProjectCount(1);
        })
        .catch((error) => {})
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      if (cardNumberElement) {
        setIsLoading(true);
        stripe
          .createPaymentMethod({
            type: "card",
            card: cardNumberElement,
          })
          .then((result: any) => {
            let data: any = {
              numProjectsToAdd: projectCount,
              paymentMethodId: result.paymentMethod.id,
            };
            if (isMaster) {
              data["inputUserId"] = inputUserId;
            }
            cAddProjectsToEnterprise(data)
              .then((res: any) => {
                toast.success(res.data.message);
                setIsLoading(false);
                setIsShowUpgradeModal(false);
                updateContext();
              })
              .catch((error) => {
                setIsLoading(false);
              });
          })
          .catch((error) => {
            setIsLoading(false);
          });
      }
    }
  };

  const getFormatData = (dateString: any) => {
    let date = new Date(dateString);

    let year = date.getFullYear(); // Subtract 1 year to get 2023
    let month = date.getMonth() + 1; // Add 1 to get 1-based month
    let day = date.getDate(); // Add 1 to get the next day

    let formattedDate = `${year}/${month}/${day}`;
    if (Number.isNaN(year)) return "";
    return formattedDate;
  };

  const getTrialInfo = (companyKey: any) => {
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
    // console.log(company);
    setIsTrial(company.SubscriptionPlan == "Trial");
    setIsAdmin(
      company.Admins != undefined &&
        Object.keys(company.Admins).includes(isMaster ? inputUserId : user.uid)
    );
    if (isTrial) {
      getTrialInfo(profile.CompanyKey);
    } else {
      setCompanyProjectCount(
        company.SubscriptionDetails != undefined
          ? company.SubscriptionDetails.projectQuantity
          : 0
      );
      // console.log(company);
      fetch("/api/stripe/getSubscription", {
        method: "POST",
        body: JSON.stringify({
          subscriptionId: company.SubscriptionDetails.stripeSubscriptionId,
        }),
      }).then((result) => {
        result.json().then((res) => {
          console.log(res);
          setPaymentDate(
            getFormatData(
              new Date(res.subscription.current_period_end * 1000).toString()
            )
          );
        });
      });
    }
  }, [profile, company]);

  return (
    <div className="flex min-h-[100vh] w-auto h-full">
      <SideBar index={4} />
      {isSide && <ReSideBar index={4} hide={setIsSide} />}
      {!isSide && (
        <div className="absolute lg:left-[320px] lg:w-panel w-full min-h-[100vh] h-fit bg-gray-4">
          <Header title={"My Subscription"} />
          <ReHeader title={"My Subscription"} index={4} show={setIsSide} />
          <div className="m-[32px] flex flex-wrap sm:justify-start justify-center">
            <div className="w-full sm:w-[360px] flex flex-col justify-start items-center sm:mr-[32px]">
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
                            router.push("/edit-subscription");
                          }}
                        >
                          Edit Subscription
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
            {isAdmin && (
              <div className="w-[620px] flex flex-col items-center">
                <div className="mb-[36px]"></div>
                <div className="w-full rounded-[26px] bg-gray-3">
                  <div className="text-white  text-sbig flex justify-center p-[30px] border-b-[2px] border-gray-6 rounded-t-[26px] font-bold">
                    {isTrial ? "Upgrade To Enterprise" : "Add More Projects"}
                  </div>
                  <div className="w-full flex flex-wrap justify-between pt-[10px]">
                    <div className="md:w-[40%] w-full m-[10px] flex items-center">
                      <div className="w-[32px] h-[32px] mx-[20px]">
                        <Image
                          src={modelIcon}
                          width={32}
                          height={32}
                          alt="model icon"
                        />
                      </div>
                      <p className="text-white text-sxsmall">
                        Unlimited Models
                      </p>
                    </div>
                    <div className="md:w-[40%] w-full m-[10px] flex items-center">
                      <div className="w-[32px] h-[32px] mx-[20px]">
                        <Image
                          src={supportIcon}
                          width={32}
                          height={32}
                          alt="model icon"
                        />
                      </div>
                      <p className="text-white text-sxsmall">
                        Priority Expert Support
                      </p>
                    </div>
                    <div className="md:w-[40%] w-full m-[10px] flex items-center">
                      <div className="w-[32px] h-[32px] mx-[20px]">
                        <Image
                          src={teamIcon}
                          width={32}
                          height={32}
                          alt="model icon"
                        />
                      </div>
                      <p className="text-white text-sxsmall">
                        All Collaboration Tools
                      </p>
                    </div>
                    <div className="md:w-[40%] w-full m-[10px] flex items-center">
                      <div className="w-[32px] h-[32px] mx-[20px]">
                        <Image
                          src={adminIcon}
                          width={32}
                          height={32}
                          alt="model icon"
                        />
                      </div>
                      <p className="text-white text-sxsmall">Admin Accounts</p>
                    </div>
                    <div className="md:w-[40%] w-full m-[10px] flex items-center">
                      <div className="w-[32px] h-[32px] mx-[20px]">
                        <Image
                          src={brandIcon}
                          width={32}
                          height={32}
                          alt="model icon"
                        />
                      </div>
                      <p className="text-white text-sxsmall">
                        Custom Company Branding
                      </p>
                    </div>
                    <div className="md:w-[40%] w-full m-[10px] flex items-center">
                      <div className="w-[32px] h-[32px] mx-[20px]">
                        <Image
                          src={viewIcon}
                          width={32}
                          height={32}
                          alt="model icon"
                        />
                      </div>
                      <p className="text-white text-sxsmall">
                        Free Viewing For Everyone
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center mb-[30px] mt-[50px]">
                    <p className="text-center font-light text-sxsmall text-white ml-[55px] m-1">
                      Choose projects to add
                    </p>
                    <div className="flex items-center justify-center">
                      <p className="text-ssmall m-[12px] text-white">Add</p>
                      <select
                        className="text-white bg-red-primary rounded-[31px] p-[15px] w-[200px] border-r-[20px] focus:border-red-primary font-bold mb-4 ring-0 border-red-primary focus:ring-0"
                        value={projectCount}
                        onChange={(e: any) => {
                          setProjectCount(e.target.value);
                        }}
                      >
                        <option value={1}>1 Project</option>
                        <option value={2}>2 Project</option>
                        <option value={3}>3 Project</option>
                        <option value={5}>5 Project</option>
                        <option value={10}>10 Project</option>
                        <option value={15}>15 Project</option>
                      </select>
                    </div>
                    <div className="flex justify-center items-end">
                      <p className="text-center text-custom-1 text-2xbig mr-1 mb-0">
                        {isTrial ? "" : "+"}${projectCost}
                      </p>
                      <p className="text-center text-gray-12 text-msmall mb-[12px]">
                        per month
                      </p>
                    </div>
                    <p className="text-red-primary text-xsmall text-center mt-[-10px]">
                      Billed yearly
                    </p>
                    <div className="w-[1px] h-[60px]"></div>

                    {!isTrial && (
                      <p className="text-center text-gray-10 font-normal">
                        Current Billing: $
                        {(
                          companyProjectCount *
                          12 *
                          projectCost
                        ).toLocaleString()}{" "}
                        per year
                      </p>
                    )}
                    <p className="text-center text-gray-10 font-normal">
                      {isTrial ? (
                        <>${(projectCost * 12).toLocaleString()} per project</>
                      ) : (
                        <>
                          +${(projectCost * 12).toLocaleString()} per new
                          project
                        </>
                      )}
                    </p>
                    <p className="text-center text-white text-2xsmall font-bold">
                      {isTrial ? (
                        <>
                          {" "}
                          Total: $
                          {(
                            projectCount *
                            projectCost *
                            12
                          ).toLocaleString()}{" "}
                          per year
                        </>
                      ) : (
                        <>
                          {" "}
                          Total: $
                          {(
                            (Number(projectCount) +
                              Number(companyProjectCount)) *
                            projectCost *
                            12
                          ).toLocaleString()}{" "}
                          per year
                        </>
                      )}
                    </p>
                    <div className="w-full flex justify-center">
                      <button
                        className="mx-[24px] mt-[24px] h-fit bg-gray-5 rounded-[44px] px-[16px] py-[12px] w-[320px] font-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white"
                        onClick={() => {
                          if (isTrial) {
                            setIsShowUpdateBillingDetails(true);
                          } else {
                            setIsShowUpgradeModal(true);
                          }
                        }}
                      >
                        <p className="font-semibold">
                          {isTrial
                            ? "Upgrade Subscription"
                            : "Add To Subscription"}
                        </p>
                      </button>
                    </div>
                    <p className="text-center text-gray-10 font-normal text-2xsmall m-1">
                      Add/Remove projects at any time
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {isShowUpgradeModal && (
        <div
          id="modal_single"
          className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-[520px] max-h-full">
            <div
              className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
              onClick={() => setIsShowUpgradeModal(false)}
            ></div>
            <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
              <div className="flex items-center justify-center p-4 md:p-5 ">
                <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
                  {isTrial ? "Upgrade Subscription" : "Add To Subscription"}
                </h3>
                <button
                  type="button"
                  className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => setIsShowUpgradeModal(false)}
                >
                  <Image src={closeIcon} width={20} height={20} alt="close" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="mx-[50px] my-[10px] flex flex-col justify-center">
                <p className="text-small text-gray-10 m-2 text-center">
                  You are adding{" "}
                  <label className="text-medium text-white">
                    {projectCount}
                  </label>{" "}
                  project to your Enterprise subscription
                </p>
              </div>
              <div className="mx-[50px] my-[10px] flex flex-col justify-center">
                {!isTrial && (
                  <p className="text-small text-gray-10 m-2 text-center">
                    Current billing: $
                    {(companyProjectCount * projectCost * 12).toLocaleString()}{" "}
                    per year
                  </p>
                )}
                <p className="text-small text-white m-2 text-center">
                  New Subscription: $
                  {(projectCount * projectCost * 12).toLocaleString()} per year
                </p>
                {!isTrial && (
                  <button
                    className="text-2small text-gray-8-5 m-4 text-center"
                    onClick={() => {
                      resetBillingStep(() => {
                        setIsShowUpdateBillingDetails(true);
                      });
                    }}
                  >
                    Update my payment method
                  </button>
                )}
              </div>
              <div className="flex justify-center items-center p-4 md:p-5">
                <button
                  disabled={isLoading}
                  type="button"
                  className="flex justify-center items-center rounded-[24px] text-white bg-gray-5 px-[30px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 w-[150px] blur-6 mx-[20px]"
                  onClick={() => {
                    setIsShowUpgradeModal(false);
                  }}
                >
                  <p>Cancel</p>
                </button>
                <button
                  disabled={isLoading}
                  type="button"
                  className="flex justify-center items-center rounded-[24px] text-white bg-gray-5 px-[30px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 w-[150px] blur-6 mx-[20px]"
                  onClick={addProjectsToSubscription}
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
                  <p>Pay</p>
                </button>
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

const SubscriptionPageWrapper = () => {
  const options = {
    appearance: {},
  };
  return (
    <Elements stripe={stripePromise} options={options}>
      <SubscriptionPage />
    </Elements>
  );
};

export default SubscriptionPageWrapper;
