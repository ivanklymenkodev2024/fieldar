import type { Metadata } from "next";
import { PageLayoutProps } from "@/configs";

import "../globals.css";

export const metadata: Metadata = {
  title: "Company - FieldAR",
  description: "FieldAR Company Page",
};

const CompanyLayout: React.FC<PageLayoutProps> = ({ children }) => children;

export default CompanyLayout;
