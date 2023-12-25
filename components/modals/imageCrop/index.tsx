import { ImageCropModalProps } from "@/configs";

import Image from "next/image";

import closeIcon from "../../../public/icons/CloseXIcon.png";
import profileImg from "../../../public/images/profile.png";
import Button from "@/components/elements/button";

import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useRef, useState } from "react";

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isShow,
  isLoading,
  hide,
  title,
  uploadImageURLToDB,
  imageData,
}: ImageCropModalProps) => {
  const [resImg, setResImage] = useState("");

  const cropperRef = useRef<ReactCropperElement>(null);
  const onCrop = () => {
    const cropper: any = cropperRef.current?.cropper;
    setResImage(cropper.getCroppedCanvas().toDataURL());
  };

  const base64toFile = (base64Data: any, filename: any) => {
    const byteCharacters = atob(base64Data.substring(22));
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const chunk = byteCharacters.slice(offset, offset + 1024);

      const byteNumbers = new Array(chunk.length);
      for (let i = 0; i < chunk.length; i++) {
        byteNumbers[i] = chunk.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: "image/jpeg" });
    const file = new File([blob], filename, {
      type: "image/jpeg",
    });
    return file;
  };

  const handleUpdateImage = () => {
    uploadImageURLToDB(base64toFile(resImg, "profile.png"));
  };

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
          <div className="mx-[50px] my-[30px] flex justify-center items-end">
            <Cropper
              src={imageData}
              style={{ height: 224, width: 224 }}
              initialAspectRatio={16 / 9}
              guides={false}
              crop={onCrop}
              minCropBoxHeight={100}
              minCropBoxWidth={100}
              ref={cropperRef}
            />
            <Image
              src={resImg == "" ? profileImg : resImg}
              width={142}
              height={142}
              alt="profile image"
              className="mx-[13px] w-[142px] max-h-[142px]"
            />
          </div>
          <div className="flex justify-center items-center p-4 md:p-5 mx-[60px]">
            <Button
              title={"Cancel"}
              isLoading={isLoading}
              handleSubmit={hide}
              extraClass={"rounded-[24px] bg-gray-7 mx-[6px] py-[6px] w-full "}
              loadBtn={false}
            />
            <Button
              title={"Save"}
              isLoading={isLoading}
              handleSubmit={handleUpdateImage}
              extraClass={"rounded-[24px] bg-gray-5 mx-[6px] py-[6px] w-full"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
