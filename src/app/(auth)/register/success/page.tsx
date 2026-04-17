import { Suspense } from "react";
import Link from "next/link";
import SuccessClient from "./success-client";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-50" />}>
      <SuccessClient />
    </Suspense>
  );
}
