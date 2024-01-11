"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";

import logoImage from "../../public/images/logo.png";
import appleMark from "../../public/images/apple_mark.png";
import appleMarkLetter from "../../public/images/apple_mark_letter.png";
import googleAppMark from "../../public/images/google_app.png";
import googleAppLetter from "../../public/images/google_app_letter.png";

import firebase_app from "../../firebase";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { child, get, getDatabase, ref } from "firebase/database";
import { getFunctions, httpsCallable } from "firebase/functions";

const auth = getAuth(firebase_app);
const functions = getFunctions();

const cCheckMasterAccount = httpsCallable(
  functions,
  "checkMasterAccount"
);

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useGlobalContext } from "@/contexts/state";

import Button from "@/components/elements/button";
import Input from "@/components/elements/input";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const { setUser, setProfile, setCompany, setIsMaster } = useGlobalContext();

  const getCompany = (companyKey: any) => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `companies/${companyKey}`))
      .then((snapshot: any) => {
        if (snapshot.exists()) {
          setCompany(snapshot.val());
          if (typeof window !== 'undefined') {
            localStorage.setItem('company', JSON.stringify(snapshot.val()));
          }
          cCheckMasterAccount({}).then((result:any) => {
            setIsMaster(result.data.message);
            if (typeof window !== 'undefined') {
              localStorage.setItem('isMaster', JSON.stringify(result.data.message));
              if(result.data.message == false) {
                router.push('/subscription');
              } else {
                router.push('/master');
              }
            }
            console.log('Check Master Account' + result);
            setIsLoading(false);
          }).finally(() => {
            
          })
        } else {
          console.log("No data available");
        }
      })
      .catch((error: any) => {
        console.error(error);
        setIsLoading(false);
      }).finally(() => {
      });
  };

  const login = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (typeof window !== "undefined") localStorage.removeItem("picUrl");
        setUser(user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(user));
        }

        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${user.uid}`))
          .then((snapshot: any) => {
            if (snapshot.exists()) {
              setProfile(snapshot.val());
              if (typeof window !== 'undefined') {
                localStorage.setItem('profile', JSON.stringify(snapshot.val()));
              }
              getCompany(snapshot.val().CompanyKey);
            } else {
              console.log("No data available");
            }
          })
          .catch((error: any) => {
            console.error(error);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        if (error.code == "auth/invalid-email") {
          toast.warning("Invalid Email");
        } else if (error.code == "auth/user-not-found") {
          toast.warning("Invalid User");
        } else if (error.code == "auth/wrong-password") {
          toast.warning("Wrong Password");
        }
        console.log(JSON.stringify(error));
        setIsLoading(false);
      })
      .finally(() => {
      });
  };

  return (
    <form className="w-[100wh] h-[100vh] flex flex-col justify-center items-center bg-gray-4 ">
      <Image src={logoImage} width={300} height={78} alt="FieldAR Logo" />
      <p className="text-primary text-gray-11 m-8 ">
        Log in to view your dashboard
      </p>
      <Input type="email" placeholder="Email..." value={email} setValue={setEmail} extraClass={" rounded-[33px] px-[30px] py-[20px] w-[80%] sm:w-[400px] m-2"}/>
      <Input type="password" placeholder="Password..." value={password} setValue={setPassword} extraClass={" rounded-[33px] px-[30px] py-[20px] w-[80%] sm:w-[400px] m-2"}/>
      <div className="gap-2"></div>
      <Button title={"Log In"} handleSubmit={login} isLoading={isLoading} extraClass="bg-gray-5 rounded-[33px] px-[30px] py-[15px] w-[80%] sm:w-[400px] mx-2 mt-5 mb-20"/>
      <p className="text-white text-primary font-semibold">
        Don&apos;t have an account yet?
      </p>
      <p className="max-w-[350px] text-gray-9 text-center">
        Download the FieldAR app on Apple App Store or Google Play and register
        for a free account.
      </p>
      <div className="flex my-[10px] flex-wrap sm:justify-between justify-center">
        <div className="flex items-center text-gray-3-5 rounded-[18px] py-[10px] pl-[20px] pr-[30px] mt-[15px] bg-white shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 mx-2">
          <Image
            src={appleMark}
            width={24}
            height={22}
            alt="Apple Mark"
            className="p-[1px] mr-[10px]"
          />
          <Image
            src={appleMarkLetter}
            width={100}
            height={32}
            alt="Apple Mark"
          />
        </div>
        <div className="flex items-center text-gray-3-5 rounded-[18px] py-[10px] pl-[20px] pr-[30px] mt-[15px] bg-white shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 mx-2">
          <Image
            src={googleAppMark}
            width={33}
            height={30}
            alt="Apple Mark"
            className="p-[1px] mr-[10px]"
          />
          <Image
            src={googleAppLetter}
            width={112}
            height={36}
            alt="Apple Mark"
          />
        </div>
      </div>
      <ToastContainer />
    </form>
  );
};

export default LoginPage;
