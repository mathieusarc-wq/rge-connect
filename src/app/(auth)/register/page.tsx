import { Suspense } from "react";
import RegisterClient from "./register-client";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-50" />}>
      <RegisterClient />
    </Suspense>
  );
}
