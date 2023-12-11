import Image from "next/image";

import logoImage from "../../public/images/logo.png";
import profilePic from "../../public/images/profile.png";
import { SidebarProps } from "@/configs";

import companyIcon from "../../public/icons/CompanyIcon.png";
import teamIcon from "../../public/icons/TeamIcon.png";
import projectIcon from "../../public/icons/ProjectIcon.png";
import activityIcon from "../../public/icons/Comment.png";
import subscriptionIcon from "../../public/icons/SubscriptionIcon.png";
import settingsIcon from "../../public/icons/SettingsIcon.png";
import logoutIcon from "../../public/icons/LogoutIcon.png";
import closeIcon from '../../public/icons/CloseXIcon.png';

import defaultUser from "../../public/icons/User.png";

import firebase_app from "../../config";
import { getAuth } from "firebase/auth";
import { getFirestore, onSnapshot } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

const auth = getAuth();
const functions = getFunctions();

const database = getDatabase(firebase_app);

import Link from "next/link";
import { child, get, getDatabase, ref } from "firebase/database";
import { useState } from "react";

const ReSideBar: React.FC<ReSidebarProps> = ({ index, hide }: ReSidebarProps) => {
  const [picUrl, setPicUrl] = useState("");

  auth.onAuthStateChanged(function (user: any) {
    if (user != null) {
      const uid = user.uid;

      const dbRef = ref(getDatabase());
      get(child(dbRef, `users/${uid}`))
        .then((snapshot: any) => {
          if (snapshot.exists()) {
            setPicUrl(snapshot.val().PhotoURL);
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

  return (
    <div className="w-[100vw] min-h-[100vh] lg:hidden bg-gray-2">
      <div className=" w-full flex flex-col justify-center items-center my-[30px]">
        <div className="w-full flex justify-end mx-[30px]" >
          <button className="mr-[40px]" onClick={() => {
            hide(false);
          }}>
            <Image src={closeIcon} width={40} height={40} alt="close" />
          </button>
        </div>
        <Link href="/profile">
          <div className="border-gray-4 border-[8px] rounded-[50%] bg-red-primary">
            <Image
              src={picUrl == "" ? defaultUser : picUrl}
              width={92}
              height={92}
              alt="Profile Image"
              className="rounded-[50%] border-[4px] border-gray-3 shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 w-[100px] h-[100px]"
            />
          </div>
        </Link>
      </div>

      <div className="flex flex-col h-menu justify-between">
        <div className="flex flex-col">
          <Link href="/company">
            <div
              className={
                "flex items-center justify-start h-[60px] w-full " +
                (index == 0 ? "bg-gray-4" : "bg-gray-2")
              }
            >
              <Image
                src={companyIcon}
                width={25}
                height={25}
                alt="company"
                className="ml-[75px]"
              />
              <p className="ml-[10px] text-white text-small font-bold">
                Company Details
              </p>
            </div>
          </Link>
          <Link href="/team">
            <div
              className={
                "flex items-center justify-start h-[60px] w-full " +
                (index == 1 ? "bg-gray-4" : "bg-gray-2")
              }
            >
              <Image
                src={teamIcon}
                width={25}
                height={25}
                alt="team"
                className="ml-[75px]"
              />
              <p className="ml-[10px] text-white text-small font-bold">Team</p>
            </div>
          </Link>
          <Link href="/project">
            <div
              className={
                "flex items-center justify-start h-[60px] w-full " +
                (index == 2 ? "bg-gray-4" : "bg-gray-2")
              }
            >
              <Image
                src={projectIcon}
                width={25}
                height={25}
                alt="[project]"
                className="ml-[75px]"
              />
              <p className="ml-[10px] text-white text-small font-bold">
                Project
              </p>
            </div>
          </Link>
          <Link href="/activity">
            <div
              className={
                "flex items-center justify-start h-[60px] w-full " +
                (index == 3 ? "bg-gray-4" : "bg-gray-2")
              }
            >
              <Image
                src={activityIcon}
                width={25}
                height={25}
                alt="activity"
                className="ml-[75px]"
              />
              <p className="ml-[10px] text-white text-small font-bold">
                Activity
              </p>
            </div>
          </Link>
          <Link href="/subscription">
            <div
              className={
                "flex items-center justify-start h-[60px] w-full " +
                (index == 4 ? "bg-gray-4" : "bg-gray-2")
              }
            >
              <Image
                src={subscriptionIcon}
                width={25}
                height={25}
                alt="subscription"
                className="ml-[75px]"
              />
              <p className="ml-[10px] text-white text-small font-bold">
                Subscription
              </p>
            </div>
          </Link>
          <Link href="/settings">
            <div
              className={
                "flex items-center justify-start h-[60px] w-full " +
                (index == 5 ? "bg-gray-4" : "bg-gray-2")
              }
            >
              <Image
                src={settingsIcon}
                width={25}
                height={25}
                alt="settings"
                className="ml-[75px]"
              />
              <p className="ml-[10px] text-white text-small font-bold">
                Settings
              </p>
            </div>
          </Link>
          <Link href={"/login"}>
            <div className="flex items-center justify-start bg-gray-2 h-[60px] w-full">
              <Image
                src={logoutIcon}
                width={25}
                height={25}
                alt="logout"
                className="ml-[75px]"
              />
              <p className="ml-[10px] text-white text-small font-bold">
                Log Out
              </p>
            </div>
          </Link>
        </div>
        <div className="flex flex-col mb-[20px]">
            <div className="text-gray-11 py-[15px] text-primary text-center">Home</div>
            <div className="text-gray-11 py-[15px] text-primary text-center">Blog</div>
            <div className="text-gray-11 py-[15px] text-primary text-center">Plugins</div>
            <div className="text-gray-11 py-[15px] text-primary text-center">Support</div>
        </div>
      </div>
    </div>
  );
};

export default ReSideBar;
