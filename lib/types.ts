export type DepositType = "bank" | "cash";

export interface Certificate {
  certNo: string;
  folio: string;
  holder: string;
  shares: number;
  distinctive: string;
  dateShort: string; // e.g. "27 March 2019" - for lists/UI
  dateSeal: string; // e.g. "27th day of March 2019" - verbatim certificate wording
}

export interface Deposit {
  label: string; // "Deposit-Bank" | "Deposit-Cash"
  tag: string; // "Bank" | "Cash"
  certificates: Certificate[];
}

export interface Member {
  name: string;
  folio: string;
  mobile: string;
  area: string;
  deposits: {
    bank: Deposit;
    cash: Deposit;
  };
}

export interface Company {
  name: string;
  cin: string;
  office: string;
}

export interface DepositTotals {
  shares: number;
  count: number;
}
