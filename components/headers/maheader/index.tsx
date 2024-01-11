import { MaHeaderProps } from "@/configs";
import Image from "next/image";

import logoImage from "../../../public/images/logo.png";

import firebase_app from "../../../firebase";
import { child, get, getDatabase, ref, onValue } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

const auth = getAuth();
const database = getDatabase(firebase_app);
const functions = getFunctions();

import ConfirmModal from "@/components/modals/confirmModal";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MaHeader: React.FC<MaHeaderProps> = () => {
  const router = useRouter();
  const [isLogOut, setIsLogOut] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogOut = () => {
    setIsLoading(true);
    signOut(auth).then(() => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("profile");
        localStorage.removeItem("company");
        localStorage.removeItem("isMaster");
        localStorage.removeItem("inputUserId");
      }
      router.push("/login");
    });
  };

  return (
    <div className="absolute top-0 h-[90px] flex items-center justify-between bg-gray-3 w-[100vw]">
      <Image src={logoImage} width={176} height={46} alt="FieldAR Logo"/>
      <div
        className="h-[30px] px-[15px]"
      >
        <div className="text-white text-small font-bold px-[15px] cursor-pointer" onClick={() => {
          setIsLogOut(true);
        }}>
          Log Out
        </div>
      </div>
      <ConfirmModal
        isShow={isLogOut}
        isLoading={isLoading}
        hide={() => {
          setIsLogOut(false);
        }}
        title={"Log Out"}
        content={"Are you sure you wish to log out?"}
        handleCancel={() => {
          setIsLogOut(false);
        }}
        handleSubmit={handleLogOut}
      />
    </div>
  );
};

export default MaHeader;
