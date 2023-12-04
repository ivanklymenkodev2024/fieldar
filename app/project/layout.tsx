import type { Metadata } from "next";
import { PageLayoutProps } from "@/configs";

import "../globals.css";

export const metadata: Metadata = {
  title: "Project Management - FieldAR",
  description: "FieldAR Project Management Page",
};

const ProjectManagementLayout: React.FC<PageLayoutProps> = ({ children }) => children;

export default ProjectManagementLayout;
