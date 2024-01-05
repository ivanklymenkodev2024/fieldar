import { createContext, useContext } from "react";

export type GlobalData = {
  isMaster: boolean;
  user: any;
  profile: any;
  company: any;
  project: any;
  setIsMaser: (c:any) => void;
  setUser: (c:any) => void;
  setProfile: (c:any) => void;
  setCompany: (c:any) => void;
  setProject: (c:any) => void;
  updateContext: () => void;
};

export const CurrentDataContext = createContext<GlobalData>({
  isMaster: false,
  user: {},
  profile: {},
  company: {},
  project: {},
  setIsMaser: () => {},
  setUser: () => {},
  setProfile: () => {},
  setCompany: () => {},
  setProject: () => {},
  updateContext: () => {}
});

export const useGlobalContext = () => useContext(CurrentDataContext);
