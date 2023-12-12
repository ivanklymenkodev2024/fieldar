"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { createContext } from "vm";
import { useContext, useEffect, useState } from "react";
import { CurrentDataContext } from "@/contexts/state";

import firebase_app from "../config";
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
  const [user, setUser] = useState((typeof window !== "undefined" &&  localStorage.getItem('user') != undefined) ? JSON.parse(localStorage.getItem('user')): {});
  const [profile, setProfile] = useState((typeof window !== "undefined" &&  localStorage.getItem('profile') != undefined) ? JSON.parse(localStorage.getItem('profile')): {});
  const [company, setCompany] = useState((typeof window !== "undefined" &&  localStorage.getItem('company') != undefined) ? JSON.parse(localStorage.getItem('company')): {});
  const [project, setProject] = useState((typeof window !== "undefined" &&  localStorage.getItem('project') != undefined) ? JSON.parse(localStorage.getItem('project')): {});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUser(localStorage.getItem('user') != undefined ? JSON.parse(localStorage.getItem('user')): {});
      setProfile(localStorage.getItem('profile') != undefined ? JSON.parse(localStorage.getItem('profile')): {});
      setCompany(localStorage.getItem('company') != undefined ? JSON.parse(localStorage.getItem('company')): {});
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
    get(child(dbRef, `users/${user.uid}`))
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
          user,
          profile,
          company,
          project,
          setUser,
          setProfile,
          setCompany,
          setProject,
          updateContext
        }}
      >
        <body className={inter.className}>{children}</body>
      </CurrentDataContext.Provider>
    </html>
  );
}
