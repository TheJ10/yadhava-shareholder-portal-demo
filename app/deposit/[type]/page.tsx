import { notFound } from "next/navigation";
import DepositDetailClient from "./DepositDetailClient";

export function generateStaticParams() {
  return [{ type: "bank" }, { type: "cash" }];
}

export default function DepositTypePage({ params }: { params: { type: string } }) {
  if (params.type !== "bank" && params.type !== "cash") {
    notFound();
  }
  return <DepositDetailClient type={params.type} />;
}
