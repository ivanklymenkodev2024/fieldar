import type { Metadata } from "next";
import { PageLayoutProps } from "@/configs";

import "../globals.css";

export const metadata: Metadata = {
  title: "Company Activity - FieldAR",
  description: "FieldAR Company Activity Page",
};

const ActivityLayout: React.FC<PageLayoutProps> = ({ children }) => children;

export default ActivityLayout;
