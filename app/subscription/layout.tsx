import type { Metadata } from "next";
import { PageLayoutProps } from "@/configs";

import "../globals.css";

export const metadata: Metadata = {
  title: "Team Management - FieldAR",
  description: "FieldAR Team Management Page",
};

const TeamManagementLayout: React.FC<PageLayoutProps> = ({ children }) => children;

export default TeamManagementLayout;
