import { createContext, useContext } from "react";

export type GlobalData = {
  user: any;
  profile: any;
  company: any;
  project: any;
  setUser: (c:any) => void;
  setProfile: (c:any) => void;
  setCompany: (c:any) => void;
  setProject: (c:any) => void;
  updateContext: () => void;
};

export const CurrentDataContext = createContext<GlobalData>({
  user: {},
  profile: {},
  company: {},
  project: {},
  setUser: () => {},
  setProfile: () => {},
  setCompany: () => {},
  setProject: () => {},
  updateContext: () => {}
});

export const useGlobalContext = () => useContext(CurrentDataContext);
