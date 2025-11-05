import React from 'react';
import './Legal.css';

const Terms = () => {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-content">
          <h1>Terms & Conditions</h1>
          <p className="last-updated">Last Updated: November 5, 2025</p>

          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using ImagesBazaar, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h2>2. User Accounts</h2>
            <p>When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms.</p>
            <ul>
              <li>You are responsible for safeguarding your password</li>
              <li>You must not share your account with others</li>
              <li>You must notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2>3. Content Ownership</h2>
            <h3>For Contributors:</h3>
            <ul>
              <li>You retain ownership of images you upload</li>
              <li>You grant us a license to display and sell your images</li>
              <li>You warrant that you own or have rights to all uploaded content</li>
              <li>You must not upload copyrighted material without permission</li>
            </ul>
            <h3>For Buyers:</h3>
            <ul>
              <li>You receive a license to use purchased images</li>
              <li>License terms depend on the image type and price</li>
              <li>You may not resell or redistribute purchased images</li>
            </ul>
          </section>

          <section>
            <h2>4. Payment Terms</h2>
            <ul>
              <li>All payments are processed through Razorpay</li>
              <li>Prices are in Indian Rupees (₹)</li>
              <li>Contributors receive 80% of each sale</li>
              <li>Platform retains 20% as commission</li>
              <li>Minimum payout threshold is ₹500</li>
            </ul>
          </section>

          <section>
            <h2>5. Prohibited Activities</h2>
            <p>You may not:</p>
            <ul>
              <li>Upload illegal, offensive, or copyrighted content</li>
              <li>Manipulate pricing or engage in fraudulent activities</li>
              <li>Attempt to bypass payment systems</li>
              <li>Use automated systems to scrape content</li>
              <li>Impersonate others or misrepresent your identity</li>
            </ul>
          </section>

          <section>
            <h2>6. Refund Policy</h2>
            <p>Digital products are generally non-refundable. However, refunds may be issued in cases of:</p>
            <ul>
              <li>Technical issues preventing download</li>
              <li>Duplicate purchases</li>
              <li>Fraudulent transactions</li>
            </ul>
          </section>

          <section>
            <h2>7. Termination</h2>
            <p>We reserve the right to terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.</p>
          </section>

          <section>
            <h2>8. Limitation of Liability</h2>
            <p>ImagesBazaar shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.</p>
          </section>

          <section>
            <h2>9. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. We will notify users of any material changes via email or platform notification.</p>
          </section>

          <section>
            <h2>10. Contact Information</h2>
            <p>For questions about these Terms, please contact us at:</p>
            <ul>
              <li>Email: legal@imagesbazaar.com</li>
              <li>Phone: +91 1234567890</li>
              <li>Address: Mumbai, Maharashtra, India</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
