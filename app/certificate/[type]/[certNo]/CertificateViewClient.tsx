"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { RequireAuth } from "@/components/Guards";
import { COMPANY, getCertificate, getDeposit } from "@/lib/data";
import { Certificate, DepositType } from "@/lib/types";
import BackLink from "@/components/BackLink";
import CertificateReplica from "@/components/CertificateReplica";
import { downloadCertificateNode } from "@/lib/download-certificate";

export default function CertificateViewClient({
  type,
  certNo,
}: {
  type: string;
  certNo: string;
}) {
  return (
    <RequireAuth>
      <CertificateView type={type as DepositType} certNo={certNo} />
    </RequireAuth>
  );
}

function CertificateView({
  type,
  certNo,
}: {
  type: DepositType;
  certNo: string;
}) {
  const { member } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const captureRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const autoDownloadHandled = useRef(false);

  const dep = member ? getDeposit(member, type) : null;
  const displayTitle = type === "bank" ? "Initial Deposit" : "Post Deposit";
  
  useEffect(() => {
    if (!member) return;

    let cancelled = false;

    async function loadCertificate() {
      setLoading(true);

      const result = await getCertificate(
        member!,
        type,
        certNo
      );

      if (!cancelled) {
        setCert(result);
        setLoading(false);
      }
    }

    void loadCertificate();

    return () => {
      cancelled = true;
    };
  }, [member, type, certNo]);

  async function handleDownload() {
    if (!captureRef.current || !cert || !member) return;

    setDownloading(true);
    showToast("Generating certificate…");

    try {
      await downloadCertificateNode(
        captureRef.current,
        `SNK_Certificate_${cert.certNo}_${member.name.replace(/\s+/g, "_")}.png`
      );

      showToast("Certificate downloaded");
    } catch {
      showToast("Could not generate certificate");
    } finally {
      setDownloading(false);
    }
  }

  useEffect(() => {
    if (autoDownloadHandled.current) return;

    if (searchParams.get("download") === "1" && cert) {
      autoDownloadHandled.current = true;

      router.replace(`/certificate/${type}/${certNo}`);

      const t = setTimeout(() => {
        void handleDownload();
      }, 250);

      return () => clearTimeout(t);
    }

    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, cert]);

  if (!member || !dep) return null;

  if (loading) {
    return (
      <div className="animate-fadeIn">
        <BackLink href={`/deposit/${type}`} label={displayTitle} />
        <p className="text-ink-soft text-[14px]">
          Loading certificate…
        </p>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="animate-fadeIn">
        <BackLink href={`/deposit/${type}`} label={displayTitle} />
        <p className="text-ink-soft text-[14px]">
          Certificate not found.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <BackLink href={`/deposit/${type}`} label={displayTitle} />

      <div ref={captureRef}>
        <CertificateReplica cert={cert} company={COMPANY} />
      </div>

      <p className="mt-[18px] text-[11.5px] text-ink-faint text-center leading-relaxed">
        Deposit type: {displayTitle}
      </p>

      <button
        onClick={handleDownload}
        disabled={downloading}
        className="block w-full mt-6 py-4 rounded bg-navy text-cream font-semibold text-[14px] tracking-wide uppercase disabled:opacity-60"
      >
        {downloading ? "Preparing…" : "Download"}
      </button>
    </div>
  );
}