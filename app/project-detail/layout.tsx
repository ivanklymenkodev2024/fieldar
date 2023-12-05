import type { Metadata } from "next";
import { PageLayoutProps } from "@/configs";

import "../globals.css";

export const metadata: Metadata = {
  title: "Project Detail - FieldAR",
  description: "FieldAR Project Detail Page",
};

const ProjectDetailLayout: React.FC<PageLayoutProps> = ({ children }) => children;

export default ProjectDetailLayout;
