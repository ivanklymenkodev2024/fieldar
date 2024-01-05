"use client";
import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { createContext } from "vm";
import { useContext, useEffect, useState } from "react";
import { CurrentDataContext } from "@/contexts/state";

import firebase_app from "../firebase";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(firebase_app);

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalContext } from "@/contexts/state";
import { child, get, getDatabase, ref } from "firebase/database";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMaster, setIsMaser] = useState<any> ((typeof window !== "undefined" &&  localStorage.getItem('isMaster') != undefined) ? JSON.parse(localStorage.getItem('isMaster')): {});
  const [user, setUser] = useState<any>((typeof window !== "undefined" &&  localStorage.getItem('user') != undefined) ? JSON.parse(localStorage.getItem('user')): {});
  const [profile, setProfile] = useState<any>((typeof window !== "undefined" &&  localStorage.getItem('profile') != undefined) ? JSON.parse(localStorage.getItem('profile')): {});
  const [company, setCompany] = useState<any>((typeof window !== "undefined" &&  localStorage.getItem('company') != undefined) ? JSON.parse(localStorage.getItem('company')): {});
  const [project, setProject] = useState<any>((typeof window !== "undefined" &&  localStorage.getItem('project') != undefined) ? JSON.parse(localStorage.getItem('project')): {});
  const [inputUserId, setInputUserId] = useState<any>((typeof window !== "undefined" &&  localStorage.getItem('inputUserId') != undefined) ? localStorage.getItem('inputUserId'): "");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMaser(localStorage.getItem('user') != undefined ? JSON.parse(localStorage.getItem('isMaster')): false);
      setUser(localStorage.getItem('user') != undefined ? JSON.parse(localStorage.getItem('user')): {});
      setProfile(localStorage.getItem('profile') != undefined ? JSON.parse(localStorage.getItem('profile')): {});
      setCompany(localStorage.getItem('company') != undefined ? JSON.parse(localStorage.getItem('company')): {});
      setInputUserId(localStorage.getItem('inputUserId') != undefined ? JSON.parse(localStorage.getItem('inputUserId')): "");
    }
  }, [])

  const getCompany = (companyKey: string) => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `companies/${companyKey}`))
      .then((snapshot: any) => {
        if (snapshot.exists()) {
          setCompany(snapshot.val());
          if (typeof window !== 'undefined') {
            localStorage.setItem('company', JSON.stringify(snapshot.val()));
          }
        } else {
          console.log("No data available");
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  const updateContext = () => {
    const dbRef = ref(getDatabase());
    let uid = user.uid;
    if(isMaster) {
      uid = inputUserId;
    }
    get(child(dbRef, `users/${uid}`))
      .then((snapshot: any) => {
        if (snapshot.exists()) {
          setProfile(snapshot.val());
          if (typeof window !== 'undefined') {
            localStorage.setItem('profile', JSON.stringify(snapshot.val()));
          }
          getCompany(snapshot.val().CompanyKey);
        } else {
          console.log("No data available");
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  return (
    <html lang="en">
      <CurrentDataContext.Provider
        value={{
          inputUserId,
          isMaster,
          user,
          profile,
          company,
          project,
          setIsMaser,
          setUser,
          setProfile,
          setCompany,
          setProject,
          setInputUserId,
          updateContext
        }}
      >
        <body className={inter.className} suppressHydrationWarning={true}>{children}</body>
      </CurrentDataContext.Provider>
    </html>
  );
}
