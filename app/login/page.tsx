"use client";
import Image from "next/image";
import logoImage from "../../public/images/logo.png";
import appleMark from "../../public/images/apple_mark.png";
import appleMarkLetter from "../../public/images/apple_mark_letter.png";
import googleAppMark from "../../public/images/google_app.png";
import googleAppLetter from "../../public/images/google_app_letter.png";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  const goProfile = (e: any) => {
    e.preventDefault();
    router.push("/profile");
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
        />
        <input
          className="bg-gray-3 text-gray-11 placeholder:italic rounded-[33px] px-[30px] py-[20px] w-[80%] sm:w-[400px] m-2 focus:border-none outline-none shadown-none border-none focus:shadow-none focus:ring-0"
          type="password"
          placeholder="Password..."
        />
        <div className="gap-2"></div>
        <button
          className="bg-gray-5 rounded-[33px] px-[30px] py-[15px] w-[80%] sm:w-[400px] mx-2 mt-5 mb-20 text-white text-medium shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 "
          onClick={goProfile}
        >
          Login
        </button>
        <p className="text-white text-primary font-semibold">
          Don&apos;t have an account yet?
        </p>
        <p className="max-w-[350px] text-gray-9 text-center">
          Download the FieldAR app on Apple App Store or Google Play and
          register for a free account.
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
      </form>
  );
};

export default LoginPage;
