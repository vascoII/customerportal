import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Techem Customer Portal",
  description: "Sign in to your Techem customer portal account",
};

export default function SignIn() {
  return <SignInForm />;
}
