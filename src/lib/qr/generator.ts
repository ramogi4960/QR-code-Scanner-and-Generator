export interface WifiFields {
  ssid: string;
  password: string;
  security: 'WPA' | 'WEP' | 'nopass';
}

export interface ContactFields {
  name: string;
  phone: string;
  email: string;
}

export function buildTextPayload(text: string): string {
  return text.trim();
}

export function buildUrlPayload(url: string): string {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function buildWifiPayload(fields: WifiFields): string {
  const { ssid, password, security } = fields;
  const escapedSsid = escapeWifiValue(ssid);
  const escapedPassword = escapeWifiValue(password);

  if (security === 'nopass') {
    return `WIFI:T:nopass;S:${escapedSsid};;`;
  }
  return `WIFI:T:${security};S:${escapedSsid};P:${escapedPassword};;`;
}

function escapeWifiValue(value: string): string {
  // Wi-Fi QR spec requires escaping these special characters with a backslash
  return value.replace(/([\\;,:"])/g, '\\$1');
}

export function buildContactPayload(fields: ContactFields): string {
  const { name, phone, email } = fields;
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name.trim()}`,
  ];
  if (phone.trim()) lines.push(`TEL:${phone.trim()}`);
  if (email.trim()) lines.push(`EMAIL:${email.trim()}`);
  lines.push('END:VCARD');
  return lines.join('\n');
}

// ---------- Minimum-field validation, used to gate the QR preview ----------

export function isTextValid(text: string): boolean {
  return text.trim().length > 0;
}

export function isUrlValid(url: string): boolean {
  return url.trim().length > 0;
}

export function isWifiValid(fields: WifiFields): boolean {
  return fields.ssid.trim().length > 0;
}

export function isContactValid(fields: ContactFields): boolean {
  return fields.name.trim().length > 0;
}