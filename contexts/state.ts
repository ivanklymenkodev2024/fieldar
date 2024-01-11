import { createContext, useContext } from "react";

export type GlobalData = {
  inputUserId: string,
  isMaster: boolean;
  user: any;
  profile: any;
  company: any;
  project: any;
  setIsMaster: (c:any) => void;
  setUser: (c:any) => void;
  setProfile: (c:any) => void;
  setCompany: (c:any) => void;
  setProject: (c:any) => void;
  setInputUserId: (c:any) => void;
  updateContext: () => void;
};

export const CurrentDataContext = createContext<GlobalData>({
  inputUserId: "",
  isMaster: false,
  user: {},
  profile: {},
  company: {},
  project: {},
  setIsMaster: () => {},
  setUser: () => {},
  setProfile: () => {},
  setCompany: () => {},
  setProject: () => {},
  setInputUserId: () => {},
  updateContext: () => {}
});

export const useGlobalContext = () => useContext(CurrentDataContext);
