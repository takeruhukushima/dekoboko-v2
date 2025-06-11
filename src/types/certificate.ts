// 証明書関連の型定義

export interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  displayHtml: string;
  criteria?: {
    narrative: string;
  };
}

export interface CertificateData {
  recipientName: string;
  recipientEmail: string;
  recipientId: string;
  issueDate: string;
  additionalData?: Record<string, any>;
}

export interface IssuedCertificate {
  "@context": string[];
  id: string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  credentialSubject: {
    id: string;
    name?: string;
    email?: string;
  };
  display: {
    contentMediaType: string;
    content: string;
  };
  metadata?: string;
  proof?: any;
}

export interface IssueFormData {
  templateId: string;
  recipientName: string;
  recipientEmail: string;
  recipientId: string;
  additionalData?: Record<string, any>;
}
