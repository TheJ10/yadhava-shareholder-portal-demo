import { Suspense } from "react";
import { notFound } from "next/navigation";
import CertificateViewClient from "./CertificateViewClient";

export default function CertificatePage({
  params,
}: {
  params: { type: string; certNo: string };
}) {
  if (params.type !== "bank" && params.type !== "cash") {
    notFound();
  }
  return (
    <Suspense fallback={<div className="min-h-[40vh]" aria-hidden="true" />}>
      <CertificateViewClient type={params.type} certNo={params.certNo} />
    </Suspense>
  );
}
