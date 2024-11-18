import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  companyName: string;
  dataroomLink: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  companyName,
  dataroomLink,
}) => (
  <div>
    <h1>Dataroom Access Approved</h1>
    <p>Dear {firstName},</p>
    <p>
      Your request to access the dataroom for {companyName} has been approved. You can now
      access all confidential documents and information.
    </p>
    <p>
      Click here to access the dataroom:{' '}
      <a href={dataroomLink} style={{ color: '#0066cc' }}>
        View Dataroom
      </a>
    </p>
    <p>
      Please note that all information in the dataroom is confidential and should be
      treated accordingly.
    </p>
    <hr />
    <p style={{ color: '#666', fontSize: '0.9em' }}>
      This is an automated message. Please do not reply to this email.
    </p>
  </div>
);

interface DenialEmailTemplateProps {
  firstName: string;
  companyName: string;
}

export const DenialEmailTemplate: React.FC<Readonly<DenialEmailTemplateProps>> = ({
  firstName,
  companyName,
}) => (
  <div>
    <h1>Dataroom Access Request Update</h1>
    <p>Dear {firstName},</p>
    <p>
      We regret to inform you that your request to access the dataroom for {companyName} has not been approved at this time.
    </p>
    <p>
      This decision was made after careful consideration of your request. Please note that access to confidential information 
      is granted selectively based on various factors.
    </p>
    <p>
      You are welcome to continue exploring other investment opportunities on our platform.
    </p>
    <hr />
    <p style={{ color: '#666', fontSize: '0.9em' }}>
      This is an automated message. Please do not reply to this email.
    </p>
  </div>
);

interface FinancialStatementApprovalProps {
  firstName: string;
}

export const FinancialStatementApprovalEmail: React.FC<Readonly<FinancialStatementApprovalProps>> = ({
  firstName,
}) => (
  <div>
    <h1>Financial Statement Approved</h1>
    <p>Dear {firstName},</p>
    <p>
      We're pleased to inform you that your financial statement has been reviewed and approved. 
      You can now proceed with making investments on our platform.
    </p>
    <p>
      Visit your investment portfolio to explore available investment opportunities:{' '}
      <a href={`${process.env.NEXT_PUBLIC_APP_URL}/investment_portfolio`} style={{ color: '#0066cc' }}>
        Go to Investment Portfolio
      </a>
    </p>
    <p>
      Thank you for choosing B2D Venture for your investment journey.
    </p>
    <hr />
    <p style={{ color: '#666', fontSize: '0.9em' }}>
      This is an automated message. Please do not reply to this email.
    </p>
  </div>
);

interface FinancialStatementRejectionProps {
  firstName: string;
}

export const FinancialStatementRejectionEmail: React.FC<Readonly<FinancialStatementRejectionProps>> = ({
  firstName,
}) => (
  <div>
    <h1>Financial Statement Review Update</h1>
    <p>Dear {firstName},</p>
    <p>
      We regret to inform you that your financial statement could not be approved at this time.
    </p>
    <p>
      Please ensure your financial statement:
      <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
        <li>Is in a clear, readable format</li>
        <li>Contains all required information</li>
        <li>Is up to date and accurate</li>
      </ul>
    </p>
    <p>
      You can submit a new financial statement through your{' '}
      <a href={`${process.env.NEXT_PUBLIC_APP_URL}/investment_portfolio`} style={{ color: '#0066cc' }}>
        investment portfolio
      </a>.
    </p>
    <hr />
    <p style={{ color: '#666', fontSize: '0.9em' }}>
      This is an automated message. Please do not reply to this email.
    </p>
  </div>
);