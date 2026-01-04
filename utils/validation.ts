
import { IndicatorType } from '../types';

export const REGEX_PATTERNS = {
  IPV4: /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/,
  MD5: /^[a-fA-F0-9]{32}$/,
  SHA1: /^[a-fA-F0-9]{40}$/,
  SHA256: /^[a-fA-F0-9]{64}$/,
  DOMAIN: /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

export function validateIndicator(type: IndicatorType, value: string): boolean {
  const v = value.trim();
  switch (type) {
    case IndicatorType.IP:
      return REGEX_PATTERNS.IPV4.test(v);
    case IndicatorType.HASH_MD5:
      return REGEX_PATTERNS.MD5.test(v);
    case IndicatorType.HASH_SHA1:
      return REGEX_PATTERNS.SHA1.test(v);
    case IndicatorType.HASH_SHA256:
      return REGEX_PATTERNS.SHA256.test(v);
    case IndicatorType.DOMAIN:
      return REGEX_PATTERNS.DOMAIN.test(v);
    case IndicatorType.URL:
      return REGEX_PATTERNS.URL.test(v);
    case IndicatorType.EMAIL:
      return REGEX_PATTERNS.EMAIL.test(v);
    default:
      return true;
  }
}
