import { AuditReport } from '../types';

export const exportAuditToCsv = (report: AuditReport): void => {
  const cleanDomain = (report.domain || report.target || 'audit')
    .replace(/[^a-zA-Z0-9.-]/g, '_');
  
  // 1. Audit Overview Section
  let csvContent = '\uFEFF'; // UTF-8 BOM for Excel Arabic / International support
  csvContent += '--- SOVERIFY MOROCCAN LAW 08/09 AUDIT REPORT ---\n';
  csvContent += `Domain,${report.domain || report.target}\n`;
  csvContent += `Organization,${report.businessName}\n`;
  csvContent += `Score,${report.score}/100\n`;
  csvContent += `Status,${report.status}\n`;
  csvContent += `Audit Date,${report.timestamp}\n`;
  csvContent += `Hosting Location,${report.sovereigntyStatus.location}\n`;
  csvContent += `Hosting ASN,${report.sovereigntyStatus.asn}\n`;
  csvContent += `TLS Grade,${report.metrics.tlsGrade}\n`;
  csvContent += `CNDP Declaration Found,${report.metrics.cndpDeclarationFound ? 'Yes' : 'No'}\n`;
  csvContent += `Cookie Consent Score,${report.metrics.cookieConsentScore}%\n`;
  csvContent += `Cryptographic Signature,${report.signature || 'N/A'}\n\n`;

  // 2. Compliance Gaps Section
  csvContent += '--- COMPLIANCE GAPS & STATUTORY VIOLATIONS ---\n';
  csvContent += 'Severity,Law Reference,Title,Legal Impact,Remediation Advice\n';
  report.gaps.forEach((gap) => {
    const sev = `"${gap.severity}"`;
    const ref = `"${gap.article}"`;
    const title = `"${(gap.title || '').replace(/"/g, '""')}"`;
    const impact = `"${(gap.impact || '').replace(/"/g, '""')}"`;
    const advice = `"${(gap.recommendation || '').replace(/"/g, '""')}"`;
    csvContent += `${sev},${ref},${title},${impact},${advice}\n`;
  });
  csvContent += '\n';

  // 3. Cookie Inventory Section
  csvContent += '--- DEEP COOKIE & TRACKER INVENTORY ---\n';
  csvContent += 'Cookie Name,Category,Provider,Lifespan,Moroccan Law Status,Description\n';
  report.cookies.forEach((cookie) => {
    const name = `"${cookie.name}"`;
    const cat = `"${cookie.category}"`;
    const provider = `"${cookie.provider}"`;
    const lifespan = `"${cookie.lifespan}"`;
    const status = `"${cookie.moroccanLawStatus}"`;
    const desc = `"${(cookie.description || '').replace(/"/g, '""')}"`;
    csvContent += `${name},${cat},${provider},${lifespan},${status},${desc}\n`;
  });

  // Trigger browser download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Soverify_Audit_${cleanDomain}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
