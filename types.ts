
export enum IndicatorType {
  IP = 'ipv4-addr',
  DOMAIN = 'domain-name',
  HASH_MD5 = 'file-hash-md5',
  HASH_SHA1 = 'file-hash-sha1',
  HASH_SHA256 = 'file-hash-sha256',
  URL = 'url',
  EMAIL = 'email-addr'
}

export interface StixObject {
  id: string;
  type: string;
  name?: string;
  description?: string;
  value?: string;
  labels?: string[];
  created?: string;
  modified?: string;
}

export interface TTP {
  technique_id: string;
  technique_name: string;
  description: string;
}

export interface ExtractionResult {
  threat_actors: StixObject[];
  victims: StixObject[];
  malware: StixObject[];
  ttps: TTP[];
  indicators: {
    type: IndicatorType;
    value: string;
    description?: string;
  }[];
  relationships: {
    source: string;
    target: string;
    relationship_type: string;
  }[];
}

export interface ParseState {
  isParsing: boolean;
  error: string | null;
  result: ExtractionResult | null;
}
