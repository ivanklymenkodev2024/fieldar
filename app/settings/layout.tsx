import type { Metadata } from "next";
import { PageLayoutProps } from "@/configs";

import "../globals.css";

export const metadata: Metadata = {
  title: "Settings - FieldAR",
  description: "FieldAR Settings Page",
};

const SettingsLayout: React.FC<PageLayoutProps> = ({ children }) => children;

export default SettingsLayout;
