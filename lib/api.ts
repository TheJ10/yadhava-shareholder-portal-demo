const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://snk-shareholder-portal.onrender.com";

export interface ApiHolder {
  unique_id: string;
  holder_name: string;
  masked_mobile: string;
  place: string | null;
  total_shares: number;
}

export interface ApiHolding {
  mode: "BANK" | "CASH";
  label: "Deposit-Bank" | "Deposit-Cash";
  total_shares: number;
  certificate_count: number;
}

export interface ApiHoldings {
  bank: ApiHolding;
  cash: ApiHolding;
  total_shares: number;
  total_certificates: number;
}

export interface ApiCertificate {
  certificate_no: string;
  transaction_mode: "BANK" | "CASH";
  number_of_shares: number;
  distinctive_from: number;
  distinctive_to: number;
  certificate_date: string;
  certificate_storage_key: string | null;
}

interface ApiErrorResponse {
  detail?: string;
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const devMemberId =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem("yadhava_dev_member_id")
      : null;

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (devMemberId) {
    headers.set("X-Dev-Member-Id", devMemberId);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `API request failed (${response.status})`;

    try {
      const error = (await response.json()) as ApiErrorResponse;
      if (error.detail) {
        message = error.detail;
      }
    } catch {
      // Keep the generic HTTP error if the response is not JSON.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function requestDevOtp(mobile: string) {
  return apiRequest<{ message: string; member_id: string }>(
    "/api/v1/dev/auth/request-otp",
    {
      method: "POST",
      body: JSON.stringify({ mobile }),
    }
  );
}

export async function verifyDevOtp(mobile: string, otp: string) {
  return apiRequest<{ message: string; member_id: string }>(
    "/api/v1/dev/auth/verify-otp",
    {
      method: "POST",
      body: JSON.stringify({ mobile, otp }),
    }
  );
}

export async function getHolder(): Promise<ApiHolder> {
  return apiRequest<ApiHolder>("/api/v1/me/holder");
}

export async function getHoldings(): Promise<ApiHoldings> {
  return apiRequest<ApiHoldings>("/api/v1/me/holdings");
}

export interface ApiCertificatesResponse {
  mode: "BANK" | "CASH";
  count: number;
  total_shares: number;
  certificates: ApiCertificate[];
}

export async function getCertificates(
  mode: "BANK" | "CASH"
): Promise<ApiCertificate[]> {
  const response = await apiRequest<ApiCertificatesResponse>(
    `/api/v1/me/certificates?mode=${mode}`
  );

  return response.certificates;
}

export async function getCertificate(
  certificateNo: string
): Promise<ApiCertificate> {
  return apiRequest<ApiCertificate>(
    `/api/v1/me/certificates/${encodeURIComponent(certificateNo)}`
  );
}
