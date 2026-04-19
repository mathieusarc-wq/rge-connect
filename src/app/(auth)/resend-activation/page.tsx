import { Suspense } from "react";
import ResendActivationClient from "./resend-client";

export const metadata = {
  title: "Renvoyer l'email d'activation — RGE Connect",
};

export default function ResendActivationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-50" />}>
      <ResendActivationClient />
    </Suspense>
  );
}
