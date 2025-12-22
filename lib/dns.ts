export type DNSRecordType = 'A' | 'AAAA' | 'MX' | 'TXT' | 'CNAME' | 'NS';

export interface DNSResult {
  type: DNSRecordType;
  records: string[];
  status: 'valid' | 'warning' | 'error';
  message: string;
  explanation: string;
}

export interface AnalysisReport {
  domain: string;
  score: number;
  records: DNSResult[];
  timestamp: number;
}

const GOOGLE_DNS_API = 'https://dns.google/resolve';

async function fetchDNSRecord(domain: string, type: string) {
  try {
    const res = await fetch(`${GOOGLE_DNS_API}?name=${domain}&type=${type}`);
    const data = await res.json();
    return data.Answer ? data.Answer.map((a: { data: string }) => a.data) : [];
  } catch (err) {
    console.error(`Failed to fetch ${type} for ${domain}`, err);
    return [];
  }
}

export async function analyzeDomain(domain: string): Promise<AnalysisReport> {
  const records: DNSResult[] = [];
  let score = 100;

  // 1. MX Records (Mail)
  const mxData = await fetchDNSRecord(domain, 'MX');
  if (mxData.length > 0) {
    records.push({
      type: 'MX',
      records: mxData,
      status: 'valid',
      message: 'MX records found',
      explanation: 'Your domain is configured to receive emails.'
    });
  } else {
    score -= 20;
    records.push({
      type: 'MX',
      records: [],
      status: 'error',
      message: 'No MX records found',
      explanation: 'You cannot receive emails without MX records.'
    });
  }

  // 2. SPF (TXT)
  const txtData = await fetchDNSRecord(domain, 'TXT');
  const spfRecord = txtData.find((r: string) => r.includes('v=spf1'));
  
  if (spfRecord) {
    if (spfRecord.includes('-all') || spfRecord.includes('~all')) {
        records.push({
            type: 'TXT',
            records: [spfRecord],
            status: 'valid',
            message: 'SPF record found',
            explanation: 'SPF authorizes who can send email on your behalf.'
        });
    } else {
         score -= 10;
         records.push({
            type: 'TXT',
            records: [spfRecord],
            status: 'warning',
            message: 'Weak SPF record',
            explanation: 'Your SPF record allows too many senders (+all or ?all).'
        });
    }
  } else {
    score -= 20;
    records.push({
      type: 'TXT',
      records: [],
      status: 'error',
      message: 'Missing SPF record',
      explanation: 'Without SPF, your emails are likely to go to spam.'
    });
  }

  // 3. DMARC (TXT on _dmarc.domain)
  const dmarcData = await fetchDNSRecord(`_dmarc.${domain}`, 'TXT');
  const dmarcRecord = dmarcData.find((r: string) => r.includes('v=DMARC1'));

  if (dmarcRecord) {
    records.push({
      type: 'TXT',
      records: [dmarcRecord],
      status: 'valid',
      message: 'DMARC record found',
      explanation: 'DMARC tells receivers what to do with unauthenticated emails.'
    });
  } else {
    score -= 20;
    records.push({
      type: 'TXT',
      records: [],
      status: 'error',
      message: 'Missing DMARC record',
      explanation: 'DMARC creates a feedback loop and prevents spoofing.'
    });
  }

  // 4. A Record (Web)
  const aData = await fetchDNSRecord(domain, 'A');
  if (aData.length > 0) {
      records.push({
          type: 'A',
          records: aData,
          status: 'valid',
          message: 'Website is accessible (A Record found)',
          explanation: 'Your domain points to an IP address.'
      });
  } else {
      // Not necessarily an error if CNAME exists or only for email, but usually critical
      records.push({
          type: 'A',
          records: [],
          status: 'warning',
          message: 'No A Record',
          explanation: 'Your domain does not point to a website IP (IPv4).'
      });
  }

  return {
    domain,
    score: Math.max(0, score),
    records,
    timestamp: Date.now()
  };
}
