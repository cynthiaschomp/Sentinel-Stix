
/**
 * Security utility for CTI analysts to 'de-fang' indicators.
 * This prevents indicators like URLs or IPs from being clickable or automatically
 * resolved by applications, reducing the risk of accidental infection.
 */

export function defangIndicator(value: string): string {
  if (!value) return value;
  
  // Replace . with [.] for IPs and Domains
  let defanged = value.replace(/\./g, '[.]');
  
  // Replace http/https with hxxp/hxxps
  defanged = defanged.replace(/http/gi, 'hxxp');
  
  // Replace @ with [at] for emails
  defanged = defanged.replace(/@/g, '[at]');
  
  return defanged;
}

export function refangIndicator(value: string): string {
  if (!value) return value;
  return value
    .replace(/\[\.\]/g, '.')
    .replace(/hxxp/gi, 'http')
    .replace(/\[at\]/g, '@');
}
