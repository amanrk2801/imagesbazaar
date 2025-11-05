import React from 'react';
import './Legal.css';

const Privacy = () => {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-content">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: November 5, 2025</p>

          <section>
            <h2>1. Information We Collect</h2>
            <h3>Personal Information:</h3>
            <ul>
              <li>Name and email address</li>
              <li>Phone number (optional)</li>
              <li>Payment information (processed by Razorpay)</li>
              <li>Bank account details (for payouts)</li>
              <li>Profile information (bio, location, website)</li>
            </ul>
            <h3>Usage Information:</h3>
            <ul>
              <li>Images uploaded and purchased</li>
              <li>Search queries and browsing history</li>
              <li>Device and browser information</li>
              <li>IP address and location data</li>
            </ul>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>To provide and maintain our service</li>
              <li>To process transactions and payments</li>
              <li>To send important notifications</li>
              <li>To improve user experience</li>
              <li>To prevent fraud and ensure security</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2>3. Information Sharing</h2>
            <p>We do not sell your personal information. We may share information with:</p>
            <ul>
              <li><strong>Payment Processors:</strong> Razorpay for payment processing</li>
              <li><strong>Service Providers:</strong> Hosting and analytics services</li>
              <li><strong>Legal Requirements:</strong> When required by law</li>
              <li><strong>Business Transfers:</strong> In case of merger or acquisition</li>
            </ul>
          </section>

          <section>
            <h2>4. Data Security</h2>
            <p>We implement appropriate security measures to protect your information:</p>
            <ul>
              <li>Encrypted data transmission (HTTPS)</li>
              <li>Secure password storage (bcrypt hashing)</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
              <li>PCI DSS compliant payment processing</li>
            </ul>
          </section>

          <section>
            <h2>5. Cookies and Tracking</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Maintain user sessions</li>
              <li>Remember preferences</li>
              <li>Analyze site usage</li>
              <li>Improve functionality</li>
            </ul>
            <p>You can control cookies through your browser settings.</p>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request data deletion</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent</li>
            </ul>
          </section>

          <section>
            <h2>7. Data Retention</h2>
            <p>We retain your information for as long as necessary to:</p>
            <ul>
              <li>Provide our services</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce our agreements</li>
            </ul>
          </section>

          <section>
            <h2>8. Children's Privacy</h2>
            <p>Our service is not intended for users under 18 years of age. We do not knowingly collect information from children.</p>
          </section>

          <section>
            <h2>9. International Data Transfers</h2>
            <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place.</p>
          </section>

          <section>
            <h2>10. Changes to Privacy Policy</h2>
            <p>We may update this policy from time to time. We will notify you of significant changes via email or platform notification.</p>
          </section>

          <section>
            <h2>11. Contact Us</h2>
            <p>For privacy-related questions or requests:</p>
            <ul>
              <li>Email: privacy@imagesbazaar.com</li>
              <li>Phone: +91 1234567890</li>
              <li>Address: Mumbai, Maharashtra, India</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
