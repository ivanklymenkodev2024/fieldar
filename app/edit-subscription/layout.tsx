import type { Metadata } from "next";
import { PageLayoutProps } from "@/configs";

import "../globals.css";

export const metadata: Metadata = {
  title: "Subscription - FieldAR",
  description: "FieldAR Subscription Page",
};

const SubscriptionLayout: React.FC<PageLayoutProps> = ({ children }) => children;

export default SubscriptionLayout;
