import type { Metadata } from "next";

import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login | MeetSpace",
};

export default function LoginPage() {
  return <LoginForm />;
}
