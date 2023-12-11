"use client";
import Image from "next/image";
import logoImage from "../../public/images/logo.png";
import appleMark from "../../public/images/apple_mark.png";
import appleMarkLetter from "../../public/images/apple_mark_letter.png";
import googleAppMark from "../../public/images/google_app.png";
import googleAppLetter from "../../public/images/google_app_letter.png";
import { useRouter } from "next/navigation";

import firebase_app from "../../config";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useState } from "react";

const auth = getAuth(firebase_app);

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (e: any) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.removeItem("picUrl");
        router.push("/profile");
        console.log(user);
      })
      .catch((error) => {
        if(error.code == 'auth/invalid-email') {
          toast.warning('Invalid Email');
        } else if(error.code == 'auth/user-not-found') {
          toast.warning('Invalid User');
        } else if(error.code == 'auth/wrong-password') {
          toast.warning('Wrong Password');
        }
        console.log(JSON.stringify(error));
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // toast.warning(errorMessage);
      });
  };

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  return (
    <form className="w-[100wh] h-[100vh] flex flex-col justify-center items-center bg-gray-4 ">
      <Image src={logoImage} width={300} height={78} alt="FieldAR Logo" />
      <p className="text-primary text-gray-11 m-8 ">
        Log in to view your dashboard
      </p>
      <input
        className="bg-gray-3 text-gray-11 placeholder:italic rounded-[33px] px-[30px] py-[20px] w-[80%] sm:w-[400px] m-2 focus:border-none outline-none shadown-none border-none focus:shadow-none focus:ring-0"
        type="email"
        placeholder="Email..."
        value={email}
        onChange={handleEmailChange}
      />
      <input
        className="bg-gray-3 text-gray-11 placeholder:italic rounded-[33px] px-[30px] py-[20px] w-[80%] sm:w-[400px] m-2 focus:border-none outline-none shadown-none border-none focus:shadow-none focus:ring-0"
        type="password"
        placeholder="Password..."
        value={password}
        onChange={handlePasswordChange}
      />
      <div className="gap-2"></div>
      <button
        className="bg-gray-5 rounded-[33px] px-[30px] py-[15px] w-[80%] sm:w-[400px] mx-2 mt-5 mb-20 text-white text-medium shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 "
        onClick={login}
      >
        Login
      </button>
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
