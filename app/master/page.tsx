"use client";

import Button from "@/components/elements/button";
import Input from "@/components/elements/input";
import MaHeader from "@/components/headers/maheader";
import { useEffect, useState } from "react";

import firebase_app from "../../firebase";
import { child, get, getDatabase, ref } from "firebase/database";

import { useGlobalContext } from "@/contexts/state";
import { useRouter } from "next/navigation";

const MasterPage = () => {
  const router = useRouter();

  const [emailFilter, setEmailFilter] = useState("");
  const [uidFilter, setUidFilter] = useState("");

  const [allUsers, setAllUsers] = useState<any>([]);

  const [filteredUsers, setFilteredUsers] = useState<any>(allUsers);
  const { setUser, setProfile, setCompany, setIsMaser } = useGlobalContext();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const dbRef = ref(getDatabase());
        const snapshot = await get(child(dbRef, "users"));
        if (snapshot.exists()) {
          const users = snapshot.val();
          const tUsers = Object.keys(users).map((key) => ({
            ...users[key],
            uid: key,
            email: users[key].Email,
          }));
          setAllUsers(tUsers);
          setFilteredUsers(
            tUsers
              .filter((user) =>
                user.email.toLowerCase().includes(emailFilter.toLowerCase())
              )
              .filter((user) =>
                user.uid.toLowerCase().includes(uidFilter.toLowerCase())
              )
          );
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (
    allUsers: any,
    emailFilter: string,
    uidFilter: string
  ): void => {
    if (!allUsers || allUsers.length === 0) {
      setFilteredUsers([]);
    } else {
      const emailFilterLower = emailFilter.toLowerCase();
      const uidFilterLower = uidFilter.toLowerCase();

      const filteredUsers = allUsers.filter(
        (user: any) =>
          user.email.toLowerCase().includes(emailFilterLower) &&
          user.uid.toLowerCase().includes(uidFilterLower)
      );

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
    setProfile(user);
    if (typeof window !== "undefined") {
      localStorage.setItem("profile", JSON.stringify(user));
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
            <Input
              type={"text"}
              value={emailFilter}
              setValue={setEmailFilter}
              placeholder={"Email"}
              extraClass={
                "px-[33px] py-[18px] text-primary color-gray-11 rounded-[33px] max-w-[150px]"
              }
            />
          </div>
          <div className="flex flex-col mx-[10px] justify-end grow">
            <Input
              type={"text"}
              value={uidFilter}
              setValue={setUidFilter}
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
        <div className="grid grid-cols-2 my-[10px] mt-[30px]">
          <div className="cols-span-1 text-gray-11 text-small font-bold px-[40px]">
            Results
          </div>
          <div className="cols-span-1 text-gray-11 text-small font-bold px-[40px]">
            UID
          </div>
        </div>
        <div className="flex flex-col max-w-[750px] bg-gray-3 h-ttable rounded-[33px]">
          {allUsers != undefined &&
            filteredUsers.map((user: any, id: any) => {
              return (
                <div
                  className={
                    "cursor-default grid grid-cols-2 py-[10px] border-b-[1px] border-gray-10 hover:bg-gray-5 " +
                    (id == 0 ? "rounded-t-[33px]" : "")
                  }
                  key={id}
                  onClick={() => {
                    controlUser(user.uid);
                  }}
                >
                  <div className="cols-span-1 text-primary text-gray-11 font-medium px-[40px]">
                    {user.email}
                  </div>
                  <div className="cols-span-1 text-primary text-gray-11 font-medium px-[40px]">
                    {user.uid}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default MasterPage;
