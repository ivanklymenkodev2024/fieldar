import { createContext, useContext } from "react";

export type GlobalData = {
  user: object;
  profile: object;
  company: object;
  project: object;
  setUser: (c:object) => void;
  setProfile: (c:object) => void;
  setCompany: (c:object) => void;
  setProject: (c:object) => void;
  updateContext: (c:object) => void;
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
