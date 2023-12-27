import { EditCompanyModalProps } from "@/configs";

import Image from "next/image";

import closeIcon from "../../../public/icons/CloseXIcon.png";
import Button from "@/components/elements/button";

const EditCompanyModal: React.FC<EditCompanyModalProps> = ({
  isShow,
  isLoading,
  hide,
  reCompanyBio,
  handleReCompanyBioChange,
  reCompanyRegion,
  handleReCompanyRegionChange,
  reCompanyName,
  handleReCompanyNameChange,
  handleOnUpdateCompanyDetail
}: EditCompanyModalProps) => {
  if (!isShow) return <></>;
  return (
    <div
      className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relative p-4 w-full max-w-[620px] max-h-full">
        <div
          className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
          onClick={hide}
        ></div>
        <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
          <div className="flex items-center justify-center p-4 md:p-5 ">
            <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
              Edit Company Details
            </h3>
            <button
              type="button"
              className="absolute right-0 mr-[20px] text-white bg-gray-8 hover:bg-gray-200 hover:text-gray-900 rounded-[55px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              onClick={hide}
            >
              <Image src={closeIcon} width={20} height={20} alt="close" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="mx-[70px] my-[30px] flex flex-col justify-center">
            <div className="w-full my-[10px]">
              <p className="ml-[25px] my-[10px] text-primary text-white font-semibold">
                Company Name
              </p>
              <input
                className="bg-gray-3 px-[25px] py-[14px] w-full rounded-[33px] text-gray-10-5 ring-0 focus:outline-none focus:border-none"
                value={reCompanyName}
                onChange={handleReCompanyNameChange}
              />
            </div>

            <div className="w-full my-[10px]">
              <p className="ml-[25px] my-[10px] text-primary text-white font-semibold">
                Company Bio/Tagline
              </p>
              <textarea
                className="bg-gray-3 px-[25px] py-[14px] w-full rounded-[17px] text-gray-10-5 ring-0 focus:outline-none focus:border-none focus:ring-0 border-0"
                rows={4}
                value={reCompanyBio}
                onChange={handleReCompanyBioChange}
              />
            </div>

            <div className="w-full my-[10px]">
              <p className="ml-[25px] my-[10px] text-primary text-white font-semibold">
                Company Regions
              </p>
              <textarea
                className="bg-gray-3 px-[25px] py-[14px] w-full rounded-[17px] text-gray-10-5 ring-0 focus:outline-none focus:border-none focus:ring-0 border-0"
                rows={3}
                value={reCompanyRegion}
                onChange={handleReCompanyRegionChange}
              />
            </div>
          </div>
          <div className="flex justify-center items-center p-4 md:p-5 mx-[60px]">
            <button
              disabled={isLoading}
              type="button"
              className="rounded-[24px] text-white bg-gray-7-5 mx-[6px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 w-full"
              onClick={hide}
            >
              Cancel
            </button>
            <button
              disabled={isLoading}
              type="button"
              className="flex justify-center items-center rounded-[24px] text-white bg-red-primary mx-[6px] py-[12px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 w-full"
              onClick={handleOnUpdateCompanyDetail}
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
    </div>
  );
};

export default EditCompanyModal;
