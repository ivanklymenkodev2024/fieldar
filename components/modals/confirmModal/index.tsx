import { ConfirmModalProps } from "@/configs";

import Image from "next/image";

import closeIcon from "../../../public/icons/CloseXIcon.png";
import Button from "@/components/elements/button";

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isShow,
  isLoading,
  hide,
  title,
  content,
  handleCancel,
  handleSubmit,
}: ConfirmModalProps) => {
  if (!isShow) return <></>;
  return (
    <div className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div className="relative p-4 w-full max-w-[490px] max-h-full">
        <div
          className="fixed bg-black opacity-30 w-[100vw] h-[100vh] left-0 top-0"
          onClick={hide}
        ></div>
        <div className="relative bg-gray-4 border-[1px] border-gray-6 rounded-[26px] shadow-md drop-shadow-0 drop-shadow-y-3 blur-6">
          <div className="flex items-center justify-center p-4 md:p-5 ">
            <h3 className="text-center text-xl font-semibold dark:text-white text-small text-white">
              {title}
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
          <div className="m-[30px] flex justify-center items-end text-center">
            <p className="text-small text-white font-semibold">{content}</p>
          </div>
          <div className="flex justify-center items-center p-4 md:p-5 mx-[60px]">
            <Button
              isLoading={isLoading}
              title={"Cancel"}
              handleSubmit={handleCancel}
              extraClass="rounded-[24px] bg-gray-7-5 mx-[6px] py-[12px] w-full text-xsmall"
              loadBtn={false}
            />
            <Button
              isLoading={isLoading}
              title={"Confirm"}
              handleSubmit={handleSubmit}
              extraClass={
                "rounded-[24px] mx-[6px] py-[12px] bg-red-primary w-full text-xsmall"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
