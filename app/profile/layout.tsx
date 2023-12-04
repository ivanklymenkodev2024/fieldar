import type { Metadata } from "next";
import { PageLayoutProps } from "@/configs";

import "../globals.css";

export const metadata: Metadata = {
  title: "Profile - FieldAR",
  description: "FieldAR Profile Page",
};

const ProfileLayout: React.FC<PageLayoutProps> = ({ children }) => children;

export default ProfileLayout;
