"use client";

import Button from "@/components/elements/button";
import Input from "@/components/elements/input";
import MaHeader from "@/components/headers/maheader";
import { useEffect, useState } from "react";

import firebase_app from "../../firebase";
import { child, get, getDatabase, ref } from "firebase/database";

import { useGlobalContext } from "@/contexts/state";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/modals/confirmModal";

const MasterPage = () => {
  const router = useRouter();

  const [filterType, setFilterType] = useState("Email");
  const [filterValue, setFilterValue] = useState("");

  const [allUsers, setAllUsers] = useState<any>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isControlUser, setIsControlUser] = useState<boolean>(false);
  const [selectedUID, setSelectedUID] = useState<string>("");

  const [filteredUsers, setFilteredUsers] = useState<any>(allUsers);
  const { isMaster, setProfile, setCompany, user, setInputUserId } =
    useGlobalContext();

  useEffect(() => {
    if (!isMaster) {
      router.push("/profile");
      return;
    }
    const fetchUsers = async () => {
      try {
        const dbRef = ref(getDatabase());
        const snapshot = await get(child(dbRef, "users"));
        if (snapshot.exists()) {
          const users = snapshot.val();
          const tUsers = Object.keys(users)
            .map((key) => ({
              ...users[key],
              uid: key,
              email: users[key].Email,
            }))
            .filter((item) => item.email != user.email);
          setAllUsers(tUsers);
          setFilteredUsers(tUsers);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (): void => {
    if (!allUsers || allUsers.length === 0) {
      setFilteredUsers([]);
    } else {
      const filterValueLower = filterValue.toLowerCase().trim();

      const filteredUsers = allUsers.filter((user: any) => {
        return (
          user[filterType] != undefined &&
          ((user[filterType] != "None" &&
            user[filterType].toLowerCase().includes(filterValueLower)) ||
            filterValueLower.length == 0)
        );
      });

      setFilteredUsers(filteredUsers);
    }
  };

  const getCompany = (companyKey: any) => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `companies/${companyKey}`))
      .then((snapshot: any) => {
        if (snapshot.exists()) {
          setCompany(snapshot.val());
          if (typeof window !== "undefined") {
            localStorage.setItem("company", JSON.stringify(snapshot.val()));
          }
          router.push("/profile");
        } else {
          console.log("No data available");
        }
      })
      .catch((error: any) => {
        console.error(error);
      })
      .finally(() => {});
  };

  const controlUser = (uid: string) => {
    const user = filteredUsers.filter((user: any) => user.uid == uid)[0];
    if (typeof window !== "undefined") localStorage.removeItem("picUrl");
    setInputUserId(uid);
    setProfile(user);
    if (typeof window !== "undefined") {
      localStorage.setItem("profile", JSON.stringify(user));
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("inputUserId", uid);
    }
    getCompany(user.CompanyKey);
  };

  return (
    <div className="w-[100wh] h-[100vh] flex justify-center items-center bg-gray-4 ">
      <MaHeader />
      <div className="flex flex-col items-stretch md:w-[750px] max-w-[750px] mt-[50px]">
        <div className="text-white color-gray-11 text-medium font-bold w-full flex justify-center">
          Search Users
        </div>
        <div className="flex">
          <div className="flex flex-col mx-[10px]">
            <p className="text-white color-gray-11 ml-[47px] text-small font-bold my-[10px]">
              Search By:
            </p>
            <select
              className="custom-select bg-gray-3 border-gray-3 focus:border-gray-3 border-r-[30px] text-gray-11 placeholder:italic rounded-[25px] font-small px-[23px] py-[14px] md:w-[260px] m-2 mr-5 outline-none focus:ring-0 appearance-none w-[100%]"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
              }}
            >
              <option value={"Email"}>Email</option>
              <option value={"PhoneNumber"}>Phone Number</option>
              <option value={"DisplayName"}>Username</option>
            </select>
            {/* <Input
              type={"text"}
              value={filterType}
              setValue={setFilterType}
              placeholder={"Email"}
              extraClass={
                "px-[33px] py-[18px] text-primary color-gray-11 rounded-[33px] max-w-[150px]"
              }
            /> */}
          </div>
          <div className="flex flex-col mx-[10px] justify-end grow">
            <Input
              type={"text"}
              value={filterValue}
              setValue={setFilterValue}
              placeholder={"Search..."}
              extraClass={
                "px-[33px] py-[18px] text-primary color-gray-11 rounded-[33px]"
              }
            />
          </div>
          <div className="flex flex-col mx-[10px] justify-end">
            <Button
              title={"Search"}
              handleSubmit={handleSearch}
              isLoading={false}
              extraClass={
                "bg-gray-5 text-white text-small font-bold rounded-[33px] px-[33px] py-[18px]"
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-3 my-[10px] mt-[30px]">
          <div className="cols-span-1 text-gray-11 text-small font-bold px-[40px]">
            Email
          </div>
          <div className="cols-span-1 text-gray-11 text-small font-bold px-[40px]">
            UserName
          </div>
          <div className="cols-span-1 text-gray-11 text-small font-bold px-[40px]">
            PhoneNumber
          </div>
        </div>
        <div className="flex flex-col max-w-[750px] bg-gray-3 h-ttable rounded-[33px]">
          {allUsers != undefined &&
            filteredUsers.map((user: any, id: any) => {
              return (
                <div
                  className={
                    "cursor-default grid grid-cols-3 py-[10px] border-b-[1px] border-gray-10 hover:bg-gray-5 " +
                    (id == 0 ? "rounded-t-[33px]" : "")
                  }
                  key={id}
                  onClick={() => {
                    setSelectedUID(user.uid);
                    setIsControlUser(true);
                  }}
                >
                  <div className="cols-span-1 text-primary text-gray-11 font-medium px-[40px]">
                    {user.email}
                  </div>
                  <div className="cols-span-1 text-primary text-gray-11 font-medium px-[40px]">
                    {user.DisplayName}
                  </div>
                  <div className="cols-span-1 text-primary text-gray-11 font-medium px-[40px]">
                    {user.PhoneNumber != "None" ? user.PhoneNumber : ""}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <ConfirmModal
        isShow={isControlUser}
        isLoading={isLoading}
        hide={() => {
          setIsControlUser(false);
        }}
        title={"Control User"}
        content={"Are you sure you wish to control this user?"}
        handleCancel={() => {
          setIsControlUser(false);
        }}
        handleSubmit={() => {
          controlUser(selectedUID);
        }}
      />
    </div>
  );
};

export default MasterPage;
