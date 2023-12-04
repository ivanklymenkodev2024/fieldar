"use client";

import Header from "@/components/header";
import SideBar from "@/components/sidebar";

const CompanyPage = () => {
  return (
    <div className="flex">
      <SideBar />
      <div className="absolute left-[320px] w-panel h-[100vh] bg-gray-4">
        <Header title={"My Profile"} />

        <div className="m-[40px] ml-[52px]">
          <p className="m-[20px] text-gray-10 font-bold">Company Logo</p>

          <div className="flex flex-wrap items-end">
            <div className="ml-[40px] w-[350px] h-[120px] rounded-[23px] bg-red-primary text-white flex justify-center items-center">
              Company logo
            </div>
            <div className="flex flex-col justify-between h-[120px]">
              <button className="mx-[24px] h-fit bg-gray-5 rounded-[24px] px-[16px] py-[12px] text-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white">
                <p className="font-bold">Update</p>
              </button>
              <button className="mx-[24px] h-fit bg-red-primary rounded-[24px] px-[16px] py-[12px] text-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white">
                <p className="font-bold">Remove</p>
              </button>
            </div>
          </div>
          <div className="ml-[40px] mt-[5px]">
          <p className="text-2xsmall font-bold text-gray-10">
            Recommended size: 500x150px
          </p>
          <p className="text-2xsmall font-bold text-gray-10">
            Required format: .jpg, .jpeg
          </p>
          </div>
        </div>

        <hr className="m-[40px] ml-[72px] h-[2px] bg-gray-10 max-w-[1072px]" />

        <div className="m-[40px] ml-[62px]">
            <div className="my-[25px]">
                <p className="text-gray-10 text-small font-bold">Company Name</p>
                <p className="text-white text-small font-bold ml-[12px]">Simulation Lab, LLC.</p>
            </div>
            <div className="my-[25px]">
                <p className="text-gray-10 text-small font-bold">Company Bio / Tag-Line</p>
                <p className="text-white text-small font-bold ml-[12px] max-w-[850px]">Simulation Lab is a company in Brooklyn, NY that specializes in AR/VR app development, and there's more to be said but this is just some default placeholder text so yeah..</p>
            </div>
            <div className="my-[25px]">
                <p className="text-gray-10 text-small font-bold">Company Regions</p>
                <p className="text-white text-small font-bold ml-[12px]">NYRO, NERO, SERO, WRO, NWRO</p>
            </div>

            <button className="h-fit bg-gray-5 rounded-[24px] px-[16px] py-[12px] text-small shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-white">
                <p className="font-bold">Edit Info</p>
              </button>            
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
