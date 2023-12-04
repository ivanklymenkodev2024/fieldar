import type { Metadata } from "next";
import { PageLayoutProps } from "@/configs";

import "../globals.css";

export const metadata: Metadata = {
  title: "Login - FieldAR",
  description: "FieldAR Login Page",
};

const LoginLayout: React.FC<PageLayoutProps> = ({ children }) => children;

export default LoginLayout;
