import { InviteModalProps } from "@/configs";

import Image from "next/image";

import closeIcon from "../../../public/icons/CloseXIcon.png";
import Input from "@/components/elements/input";
import Button from "@/components/elements/button";

const InviteModal: React.FC<InviteModalProps> = ({
  isShow,
  isLoading,
  hide,
  inviteEmail,
  setInviteEmail,
  day,
  setDay,
  handleInviteToCompany,
}: InviteModalProps) => {
  if (!isShow) return <></>;
  return (
    <div className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div className="relative p-4 w-full max-w-[580px] max-h-full">
        <div
          className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
          onClick={hide}
        ></div>
        <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
          <div className="flex items-center justify-center p-4 md:p-5 ">
            <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
              Invite New Team Member
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
          <div className="mx-[70px] my-[10px] flex justify-center flex-col items-center">
            <p className="text-primary text-gray-10 text-center mx-[30px]">
              Invite new team members to join your company, and you can assign
              them to projects.
            </p>
            <div className="mx-[30px] flex justify-start w-full mt-[60px]">
              <p className="text-primary text-white text-left ml-[20px] font-semibold">
                Invite via company email
              </p>
            </div>
            <Input
              type={"email"}
              placeholder={"janedoe@email.com"}
              value={inviteEmail}
              setValue={setInviteEmail}
              extraClass=" rounded-[33px] px-[30px] py-[14px] my-[12px] w-full"
            />
            <div className="mx-[30px] flex justify-start w-full mt-[20px]">
              <p className="text-primary text-white text-left ml-[20px] font-semibold">
                Set Invite Expiration:
              </p>
            </div>
            <select
              className="custom-black-select w-full bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-9 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] m-2 mr-5 outline-none focus:ring-0 appearance-none font-semibold "
              onChange={(e: any) => {
                setDay(e.target.value);
              }}
              value={day}
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 day</option>
              <option value={60}>60 day</option>
            </select>
          </div>
          <div className="flex justify-center items-center p-4 md:p-5 mt-[30px]">
            <Button
              isLoading={isLoading}
              handleSubmit={handleInviteToCompany}
              title={"Invite to company"}
              extraClass={
                "rounded-[24px] text-white bg-red-primary px-[90px] py-[12px]"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
