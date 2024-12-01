export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-700 mb-4">
            This Privacy Policy explains how B2D Venture ("we", "us", "our") collects, uses, discloses, 
            and protects your personal information in accordance with the General Data Protection 
            Regulation (GDPR) and Personal Data Protection Act (PDPA).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <div className="space-y-4">
            <p className="text-gray-700">We collect the following types of personal information:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Identity information (name, date of birth, identification numbers)</li>
              <li>Contact information (email address, phone number, physical address)</li>
              <li>Financial information (bank account details, investment history)</li>
              <li>Technical information (IP address, browser type, device information)</li>
              <li>Usage information (how you use our platform and services)</li>
              <li>Communication records (your interactions with us)</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <div className="space-y-4">
            <p className="text-gray-700">We use your personal information for:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Processing and managing your investments</li>
              <li>Communicating with you about your investments and our services</li>
              <li>Complying with legal and regulatory requirements</li>
              <li>Improving our services and user experience</li>
              <li>Marketing and promotional activities (with your consent)</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Legal Basis for Processing</h2>
          <div className="space-y-4">
            <p className="text-gray-700">We process your personal data based on:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Your consent</li>
              <li>Contractual necessity (to provide our services)</li>
              <li>Legal obligations</li>
              <li>Legitimate business interests</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Transfers</h2>
          <p className="text-gray-700 mb-4">
            We may share your information with:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Service providers and business partners</li>
            <li>Regulatory authorities and law enforcement</li>
            <li>Professional advisors and auditors</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Any international transfers of your data will be protected by appropriate safeguards.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
          <p className="text-gray-700 mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Restrict or object to processing</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
            <li>Lodge a complaint with a supervisory authority</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Data Security</h2>
          <p className="text-gray-700">
            We implement appropriate technical and organizational measures to protect your 
            personal information against unauthorized access, alteration, disclosure, or 
            destruction. These measures include encryption, access controls, and regular 
            security assessments.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
          <p className="text-gray-700">
            We retain your personal information for as long as necessary to fulfill the 
            purposes for which it was collected, including legal, accounting, or reporting 
            requirements. When data is no longer needed, it will be securely deleted or 
            anonymized.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Cookies and Tracking</h2>
          <p className="text-gray-700">
            We use cookies and similar tracking technologies to improve your experience 
            on our platform. You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. We will notify you of any 
            material changes through our platform or via email.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy or our data practices, please 
            contact our Data Protection Officer at:
          </p>
          <div className="mt-4 text-gray-700">
            <p>Email: privacy@b2dventure.com</p>
          </div>
        </section>

        <footer className="text-sm text-gray-600 mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </footer>
      </div>
    </main>
  );
} 