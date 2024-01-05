import type { Metadata } from "next";
import { PageLayoutProps } from "@/configs";

import "../globals.css";

export const metadata: Metadata = {
  title: "Maser - FieldAR",
  description: "FieldAR Maser Page",
};

const MaserLayout: React.FC<PageLayoutProps> = ({ children }) => children;

export default MaserLayout;
