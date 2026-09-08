import { Company, DepositTotals, Deposit, Member, Certificate } from "./types";
import {
  ApiCertificate,
  getCertificate as getCertificateFromApi,
  getCertificates,
  getHolder,
  getHoldings,
} from "./api";

/**
 * Static company information.
 *
 * This is presentation metadata, not shareholder data, so it remains local.
 */
export const COMPANY: Company = {
  name: "SRI NAVANEETHA KRISHNAR ENTERPRISES LIMITED",
  cin: "U74999TN2018PLC121690",
  office: "NO.19, YADAVA COMPLEX, VADIVEL NAGAR, G.N.T ROAD, CHENNAI-600052",
};

function formatCertificateDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ordinal(day: number): string {
  if (day >= 11 && day <= 13) return `${day}th`;

  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

function formatCertificateDateSeal(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  const day = parsed.getDate();

  return `${ordinal(day)} day of ${parsed.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  })}`;
}

function mapCertificate(
  certificate: ApiCertificate,
  holder: { unique_id: string; holder_name: string }
): Certificate {
  return {
    certNo: certificate.certificate_no,
    folio: holder.unique_id,
    holder: holder.holder_name,
    shares: certificate.number_of_shares,
    distinctive: `${certificate.distinctive_from.toLocaleString("en-IN")} – ${certificate.distinctive_to.toLocaleString("en-IN")}`,
    dateShort: formatCertificateDate(certificate.certificate_date),
    dateSeal: formatCertificateDateSeal(certificate.certificate_date),
  };
}

export async function getCurrentMember(): Promise<Member> {
  const [holder, holdings] = await Promise.all([
    getHolder(),
    getHoldings(),
  ]);

  const [bankCertificates, cashCertificates] = await Promise.all([
    getCertificates("BANK"),
    getCertificates("CASH"),
  ]);

  return {
    name: holder.holder_name,
    folio: holder.unique_id,
    mobile: holder.masked_mobile,
    area: holder.place ?? "",
    deposits: {
      bank: {
        label: holdings.bank.label,
        tag: "Bank",
        certificates: bankCertificates.map((certificate) =>
          mapCertificate(certificate, holder)
        ),
      },
      cash: {
        label: holdings.cash.label,
        tag: "Cash",
        certificates: cashCertificates.map((certificate) =>
          mapCertificate(certificate, holder)
        ),
      },
    },
  };
}

export function depositTotals(dep: Deposit): DepositTotals {
  return {
    shares: dep.certificates.reduce((sum, certificate) => {
      return sum + certificate.shares;
    }, 0),
    count: dep.certificates.length,
  };
}

export function memberTotalShares(member: Member): number {
  return (
    depositTotals(member.deposits.bank).shares +
    depositTotals(member.deposits.cash).shares
  );
}

export function maskMobile(mobile: string): string {
  if (!mobile) return "";

  return mobile.slice(0, 2) + "••••••" + mobile.slice(-2);
}

export function getDeposit(
  member: Member,
  type: "bank" | "cash"
): Deposit {
  return member.deposits[type];
}

export async function getCertificate(
  member: Member,
  type: "bank" | "cash",
  certNo: string
): Promise<Certificate | null> {
  try {
    const certificate = await getCertificateFromApi(certNo);

    const expectedMode = type === "bank" ? "BANK" : "CASH";

    if (certificate.transaction_mode !== expectedMode) {
      return null;
    }

    return mapCertificate(certificate, {
      unique_id: member.folio,
      holder_name: member.name,
    });
  } catch {
    return null;
  }
}
