/**
 * Decode a JWT token without verification (for client-side use only)
 * @param token - The JWT token string
 * @returns The decoded payload or null if invalid
 */
export function decodeJwt<T = Record<string, unknown>>(token: string): T | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload) as T;
  } catch {
    console.error("Failed to decode JWT");
    return null;
  }
}

export interface JwtPayload {
  UserID: string;
  RoleName: string;
  UserType: string;
  exp: number;
}
