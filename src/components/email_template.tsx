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
