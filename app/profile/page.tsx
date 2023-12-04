"use client";

import Header from "@/components/header";
import SideBar from "@/components/sidebar";

const ProfilePage = () => {
    return (<div className="flex">
        <SideBar />
        <div className="absolute left-[320px] w-panel h-[100vh] bg-gray-4">
            <Header title={"My Profile"} />

            <div className="m-[40px] ml-[52px]">
                <p className="m-[20px] text-gray-10 font-bold">Profile Image</p>

                <div className="flex flex-wrap items-end">
                    <div className="ml-[40px] w-[175px] h-[175px] rounded-[23px] bg-white">Profile Image</div>
                    <button className="mx-[24px] mt-[24px] h-fit bg-gray-5 rounded-[24px] px-[16px] py-[12px] font-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white"><p className="font-bold">Update</p></button>
                </div>
            </div>

            <hr className="m-[40px] ml-[72px] h-[2px] bg-gray-10 max-w-[1072px]" />

            <div className="m-[40px] ml-[62px]">
                <div className="flex items-center">
                    <p className="m-[10px] text-gray-10 font-bold w-[90px]">Name: </p>
                    <p className="m-[10px] text-white font-bold w-[200px]">Kyle Szostek </p>
                    <div className="w-[20px] h-[20px] bg-white"></div>
                </div>
                <div className="flex items-center">
                    <p className="m-[10px] text-gray-10 font-bold w-[90px]">Email: </p>
                    <p className="m-[10px] text-white font-bold w-[200px]">kyle@gmail.com </p>
                    <div className="w-[20px] h-[20px] bg-white"></div>
                </div>
                <div className="flex items-center">
                    <p className="m-[10px] text-gray-10 font-bold w-[90px]">Phone: </p>
                    <p className="m-[10px] text-white font-bold w-[200px]">800-555-1235 </p>
                    <div className="w-[20px] h-[20px] bg-white"></div>
                </div>
                <div className="flex items-center">
                    <p className="m-[10px] text-gray-10 font-bold w-[90px]">Job Title: </p>
                    <p className="m-[10px] text-white font-bold w-[200px]">SR.VDC Engineer </p>
                    <div className="w-[20px] h-[20px] bg-white"></div>
                </div>
                <div className="flex items-center">
                    <p className="m-[10px] text-gray-10 font-bold w-[90px]">Password: </p>
                    <p className="m-[10px] text-white font-bold w-[200px]">*************** </p>
                    <div className="w-[20px] h-[20px] bg-white"></div>
                </div>
            </div>

        </div>
    </div>)
}

export default ProfilePage;