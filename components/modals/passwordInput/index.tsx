import { PasswordInputModalProps } from "@/configs";

import Image from "next/image";

import closeIcon from "../../../public/icons/CloseXIcon.png";
import Input from "@/components/elements/input";
import Button from "@/components/elements/button";

const PasswordInputModal: React.FC<PasswordInputModalProps> = ({
  isShow,
  isLoading,
  hide,
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  updatePassword,
}: PasswordInputModalProps) => {
  if (!isShow) return <></>;
  return (
    <div className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div className="relative p-4 w-full max-w-[690px] max-h-full">
        <div
          className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
          onClick={hide}
        ></div>
        <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
          <div className="flex items-center justify-center p-4 md:p-5 ">
            <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
              Change Password
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
          <div className="mx-[70px] my-[10px] flex justify-center flex-col">
            <Input type={"password"} value={oldPassword} setValue={setOldPassword} placeholder={"Current Password..."} extraClass="rounded-[33px] px-[30px] py-[16px]  w-full my-[12px]" />
            <Input type={"password"} value={newPassword} setValue={setNewPassword} placeholder={"New Password..."} extraClass="rounded-[33px] px-[30px] py-[16px]  w-full my-[12px]" />
            <Input type={"password"} value={confirmPassword} setValue={setConfirmPassword} placeholder={"Confirm Password..."} extraClass="rounded-[33px] px-[30px] py-[16px]  w-full my-[12px]" />
          </div>
          <div className="flex justify-center items-center p-4 md:p-5">
            <Button title={"Update"} isLoading={isLoading} handleSubmit={updatePassword} extraClass="rounded-[24px] bg-gray-5 px-[90px] py-[12px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordInputModal;
