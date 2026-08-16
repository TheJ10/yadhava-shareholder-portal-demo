import { Company, DepositTotals, Deposit, Member } from "./types";

/**
 * ---------------------------------------------------------------------------
 * DATA SOURCE NOTE
 * ---------------------------------------------------------------------------
 * Every field below is taken directly from the supplied source documents
 * (the Deposit-Bank and Deposit-Cash share certificate documents, and the
 * member record). Nothing here is invented. Share totals are calculated
 * from the certificate documents only, never from an external share-count
 * field.
 *
 * This file is the ONLY place that should change when the real backend/API
 * is wired up. `getMemberByMobile` and `verifyOtp` are the seam: replace
 * their bodies with real network calls and nothing else in the app needs
 * to change, since every page/component calls through these two functions
 * (or the `useAuth` hook, which itself calls through them).
 * ---------------------------------------------------------------------------
 */

export const COMPANY: Company = {
  name: "SRI NAVANEETHA KRISHNAR ENTERPRISES LIMITED",
  cin: "U74999TN2018PLC121690",
  office: "NO.19, YADAVA COMPLEX, VADIVEL NAGAR, G.N.T ROAD, CHENNAI-600052",
};

const MEMBERS: Record<string, Member> = {
  "9876543210": {
    name: "ARUL SEKAR",
    folio: "SNK/0411",
    mobile: "9876543210",
    area: "SASTRI NAGAR",
    deposits: {
      bank: {
        label: "Deposit-Bank",
        tag: "Bank",
        certificates: [
          {
            certNo: "508",
            folio: "SNK/0411",
            holder: "ARUL SEKAR",
            shares: 5000,
            distinctive: "4227501 – 4232500",
            dateShort: "27 March 2019",
            dateSeal: "27th day of March 2019",
          },
          {
            certNo: "660",
            folio: "SNK/0411",
            holder: "ARUL SEKAR",
            shares: 2000,
            distinctive: "5500901 – 5502900",
            dateShort: "18 January 2020",
            dateSeal: "18th day of January 2020",
          },
          {
            certNo: "707",
            folio: "SNK/0411",
            holder: "ARUL SEKAR",
            shares: 2000,
            distinctive: "5790901 – 5792900",
            dateShort: "18 January 2020",
            dateSeal: "18th day of January 2020",
          },
        ],
      },
      cash: {
        label: "Deposit-Cash",
        tag: "Cash",
        certificates: [
          {
            certNo: "105",
            folio: "SNK/0411",
            holder: "ARUL SEKAR",
            shares: 1000,
            distinctive: "401501 – 402500",
            dateShort: "31 March 2019",
            dateSeal: "31th day of March 2019",
          },
        ],
      },
    },
  },
};

/** Demo OTP used for every registered member in this local dataset. */
const VALID_OTP = "123456";

/** Sum shares/certificates for a deposit — always derived from certificates[], never a stored total. */
export function depositTotals(dep: Deposit): DepositTotals {
  return {
    shares: dep.certificates.reduce((sum, c) => sum + c.shares, 0),
    count: dep.certificates.length,
  };
}

export function memberTotalShares(member: Member): number {
  return (
    depositTotals(member.deposits.bank).shares +
    depositTotals(member.deposits.cash).shares
  );
}

/**
 * Lookup seam — swap this for `await fetch('/api/members/' + mobile)` when a
 * real backend exists. Everything else in the app is unaffected.
 */
export function getMemberByMobile(mobile: string): Member | null {
  return MEMBERS[mobile] ?? null;
}

/**
 * OTP verification seam — swap for a real SMS/OTP provider call.
 */
export function verifyOtp(mobile: string, otp: string): boolean {
  return Boolean(MEMBERS[mobile]) && otp === VALID_OTP;
}

export function maskMobile(mobile: string): string {
  return mobile.slice(0, 2) + "••••••" + mobile.slice(-2);
}

export function getDeposit(member: Member, type: "bank" | "cash"): Deposit {
  return member.deposits[type];
}

export function getCertificate(
  member: Member,
  type: "bank" | "cash",
  certNo: string
) {
  return member.deposits[type].certificates.find((c) => c.certNo === certNo) ?? null;
}
