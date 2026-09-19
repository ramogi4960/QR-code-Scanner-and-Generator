export type ScannedContentType = 'url' | 'wifi' | 'contact' | 'text';

export function detectContentType(data: string): ScannedContentType {
  if (isUrl(data)) return 'url';
  if (isWifi(data)) return 'wifi';
  if (isContact(data)) return 'contact';
  return 'text';
}

function isUrl(data: string): boolean {
  return /^https?:\/\/\S+/i.test(data.trim());
}

function isWifi(data: string): boolean {
  // Standard QR Wi-Fi format: WIFI:T:WPA;S:mynetwork;P:mypassword;;
  return /^WIFI:/i.test(data.trim());
}

function isContact(data: string): boolean {
  // vCard format always starts with BEGIN:VCARD
  return /^BEGIN:VCARD/i.test(data.trim());
}