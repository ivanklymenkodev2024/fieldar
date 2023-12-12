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

  const [isLoading, setIsLoading] = useState(false);

  const login = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (typeof window !== "undefined") localStorage.removeItem("picUrl");
        router.push("/profile");
        console.log(user);
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
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // toast.warning(errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
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
        disabled={isLoading}
        className="flex items-center justify-center bg-gray-5 rounded-[33px] px-[30px] py-[15px] w-[80%] sm:w-[400px] mx-2 mt-5 mb-20 text-white text-medium shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 "
        onClick={login}
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
        <p>Login</p>
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
