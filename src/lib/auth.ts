import { sign, verify, Secret } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { AuthPayload, UserRole } from "../types";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export function signJwt(payload: object, expiresIn: string = JWT_EXPIRES_IN): string {
  return sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
}

export function verifyJwt(token: string): AuthPayload | null {
  try {
    return verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
}

export function getSession(request: NextRequest): AuthPayload | null {
  const token = extractToken(request);
  if (!token) return null;
  return verifyJwt(token);
}

export function requireRole(session: AuthPayload, roles: UserRole[]): boolean {
  return roles.includes(session.role);
}

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
  teamId?: string | null;
}
