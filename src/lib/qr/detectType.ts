type ScannedContentType = 'url' | 'wifi' | 'text';

function detectContentType(data: string): ScannedContentType {
  if (/^https?:\/\//i.test(data)) return 'url';
  if (/^WIFI:/i.test(data)) return 'wifi';
  return 'text';
}