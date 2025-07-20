import { API_BASE } from '../config/api-config.js';

export interface SendVerificationPayload {
  phoneNumber: string;
}

export interface VerifyCodePayload {
  phoneNumber: string;
  code: string;
}

export interface ResetPasswordPayload {
  phoneNumber: string;
  newPassword: string;
}

export async function sendVerificationCode(payload: SendVerificationPayload) {
  const response = await fetch(`${API_BASE}/account/send-verification-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
}

export async function verifyCode(payload: VerifyCodePayload) {
  const response = await fetch(`${API_BASE}/account/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const response = await fetch(`${API_BASE}/account/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
}